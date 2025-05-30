import Header from '@/components/Header'
import styles from './page.module.css'

export default function Home() {
  return (
    <main className={styles.main}>
      <Header />
      
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              <span>AI診断と専門医相談で</span>
              <span className={styles.titleGradient}>安心の医療サポート</span>
            </h1>
            
            <p className={styles.heroDescription}>
              症状が気になったその瞬間から、AI技術と経験豊富な医師があなたの健康をサポート。
              24時間いつでも、信頼できる医療アドバイスをお届けします。
            </p>
            
            <div className={styles.heroButtons}>
              <a href="/ai-diagnosis" className={styles.primaryButton}>
                AI症状診断を始める
              </a>
              <a href="/consultation" className={styles.secondaryButton}>
                医師に相談する
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Doctor Directの特徴</h2>
            <p className={styles.sectionDescription}>
              最新のAI技術と専門医のネットワークで、安心の医療サポートを提供します
            </p>
          </div>
          
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
              </div>
              <h3 className={styles.featureTitle}>AI症状診断</h3>
              <p className={styles.featureDescription}>
                症状を入力するだけで、AIが瞬時に分析し、可能性のある病気を教えます
              </p>
            </div>
            
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
              </div>
              <h3 className={styles.featureTitle}>専門医相談</h3>
              <p className={styles.featureDescription}>
                認定された専門医と直接チャットで相談できます
              </p>
            </div>
            
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className={styles.featureTitle}>24時間対応</h3>
              <p className={styles.featureDescription}>
                いつでも、どこでも医療サポートを受けることができます
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.stats}>
        <div className="container">
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>100+</div>
              <div className={styles.statLabel}>認定医師</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>24/7</div>
              <div className={styles.statLabel}>利用可能</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>1000+</div>
              <div className={styles.statLabel}>完了相談</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}