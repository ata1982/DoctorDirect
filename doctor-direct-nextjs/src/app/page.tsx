import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { DoctorSearchPreview } from "@/components/home/DoctorSearchPreview";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { CTASection } from "@/components/home/CTASection";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default async function HomePage() {
  const session = await auth();

  // 認証済みユーザーは適切なダッシュボードにリダイレクト
  if (session?.user) {
    switch (session.user.role) {
      case "ADMIN":
        redirect("/admin/dashboard");
      case "DOCTOR":
        redirect("/doctor/dashboard");
      case "PATIENT":
        redirect("/patient/dashboard");
      default:
        redirect("/dashboard");
    }
  }

  // 統計データの取得（パフォーマンス向上のため）
  const [doctorCount, hospitalCount, appointmentCount] = await Promise.all([
    prisma.doctor.count({ where: { isVerified: true } }),
    prisma.hospital.count(),
    prisma.appointment.count({ where: { status: "COMPLETED" } }),
  ]);

  const stats = {
    doctors: doctorCount,
    hospitals: hospitalCount,
    completedConsultations: appointmentCount,
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main>
        {/* ヒーローセクション */}
        <HeroSection stats={stats} />

        {/* 機能紹介セクション */}
        <FeaturesSection />

        {/* 医師検索プレビュー */}
        <DoctorSearchPreview />

        {/* お客様の声 */}
        <TestimonialsSection />

        {/* CTA セクション */}
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}
