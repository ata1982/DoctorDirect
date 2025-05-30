import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';
import { analyzeSymptoms, assessEmergency } from '@/lib/ai-client';
import { log, LogLevel, AppError } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      symptoms, 
      severity, 
      duration, 
      additionalSymptoms, 
      patientInfo,
      location 
    } = body;

    // 緊急度評価
    const emergencyAssessment = await assessEmergency([symptoms, ...additionalSymptoms]);
    
    // 詳細症状分析
    const analysis = await analyzeSymptoms({
      primarySymptom: symptoms,
      duration,
      severity,
      additionalSymptoms,
      patientInfo
    });

    // データベースに症状記録を保存
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (user) {
      await prisma.symptomEntry.create({
        data: {
          userId: user.id,
          symptoms: [symptoms, ...additionalSymptoms],
          severity,
          duration,
          triggers: body.triggers || [],
          notes: body.notes,
          primaryDiagnosis: analysis.primaryDiagnosis,
          confidence: analysis.confidence,
          urgency: analysis.urgency,
          recommendations: analysis.recommendations,
          aiAnalysisData: JSON.parse(JSON.stringify({
            analysis,
            emergencyAssessment,
            timestamp: new Date().toISOString()
          }))
        }
      });
    }

    // 関連する医療機関の情報
    const hospitalRecommendation = {
      suggestedSpecialists: analysis.suggestedSpecialists,
      urgencyLevel: analysis.urgency,
      location: location || null
    };

    const response = {
      success: true,
      data: {
        diagnosis: {
          primaryDiagnosis: analysis.primaryDiagnosis,
          confidence: analysis.confidence,
          urgency: analysis.urgency,
          recommendations: analysis.recommendations,
          riskFactors: analysis.riskFactors,
          followUpRequired: analysis.followUpRequired
        },
        emergencyAssessment,
        hospitalRecommendation,
        timestamp: new Date().toISOString()
      }
    };

    log(LogLevel.INFO, 'AI診断が正常に完了しました');
    return NextResponse.json(response);

  } catch (error) {
    log(LogLevel.ERROR, 'AI診断エラー:', { 
      error: error instanceof Error ? error.message : String(error) 
    });
    
    const appError = error instanceof AppError ? error : new AppError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      500
    );

    return NextResponse.json({
      success: false,
      error: 'AI診断の処理中にエラーが発生しました',
      data: {
        timestamp: new Date().toISOString()
      }
    }, { status: appError.statusCode });
  }
}