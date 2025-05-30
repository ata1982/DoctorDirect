'use client'

import { useEffect } from 'react'

interface PerformanceMetrics {
  fcp?: number // First Contentful Paint
  lcp?: number // Largest Contentful Paint
  fid?: number // First Input Delay
  cls?: number // Cumulative Layout Shift
  ttfb?: number // Time to First Byte
}

export default function PerformanceMonitor() {
  useEffect(() => {
    // Web Vitals の監視
    const observeWebVitals = () => {
      // Performance Observer を使用してメトリクスを収集
      if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
        // LCP (Largest Contentful Paint) の監視
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1] as any
          console.log('LCP:', lastEntry.startTime)
          
          // Analytics にメトリクスを送信
          if (window.gtag) {
            window.gtag('event', 'web_vitals', {
              event_category: 'Performance',
              event_label: 'LCP',
              value: Math.round(lastEntry.startTime),
              custom_map: { metric_value: lastEntry.startTime }
            })
          }
        })
        
        try {
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
        } catch (e) {
          console.warn('LCP observer not supported')
        }

        // FID (First Input Delay) の監視
        const fidObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry: any) => {
            console.log('FID:', entry.processingStart - entry.startTime)
            
            if (window.gtag) {
              window.gtag('event', 'web_vitals', {
                event_category: 'Performance',
                event_label: 'FID',
                value: Math.round(entry.processingStart - entry.startTime),
              })
            }
          })
        })
        
        try {
          fidObserver.observe({ entryTypes: ['first-input'] })
        } catch (e) {
          console.warn('FID observer not supported')
        }

        // CLS (Cumulative Layout Shift) の監視
        let clsValue = 0
        const clsObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value
            }
          })
        })
        
        try {
          clsObserver.observe({ entryTypes: ['layout-shift'] })
          
          // ページ離脱時にCLS値を送信
          window.addEventListener('beforeunload', () => {
            console.log('CLS:', clsValue)
            if (window.gtag) {
              window.gtag('event', 'web_vitals', {
                event_category: 'Performance',
                event_label: 'CLS',
                value: Math.round(clsValue * 1000),
              })
            }
          })
        } catch (e) {
          console.warn('CLS observer not supported')
        }
      }

      // ページロード時間の測定
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = window.performance.timing
          const loadTime = perfData.loadEventEnd - perfData.navigationStart
          console.log('Page Load Time:', loadTime)
          
          if (window.gtag) {
            window.gtag('event', 'page_load_time', {
              event_category: 'Performance',
              value: loadTime,
            })
          }
        }, 0)
      })
    }

    // エラー監視
    const handleError = (error: ErrorEvent) => {
      console.error('JavaScript Error:', error)
      
      if (window.gtag) {
        window.gtag('event', 'exception', {
          description: error.message,
          fatal: false,
        })
      }
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled Promise Rejection:', event.reason)
      
      if (window.gtag) {
        window.gtag('event', 'exception', {
          description: `Unhandled Promise: ${event.reason}`,
          fatal: false,
        })
      }
    }

    // イベントリスナーの追加
    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    
    // Web Vitals の監視開始
    observeWebVitals()

    // クリーンアップ
    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  // 本番環境でのみ監視を実行
  if (process.env.NODE_ENV !== 'production') {
    return null
  }

  return null
}