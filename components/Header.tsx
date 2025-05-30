'use client'

import { useState } from 'react'
import Link from 'next/link'
import ThemeToggle from './ThemeToggle'
import styles from './Header.module.css'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.headerContent}>
          {/* ロゴ */}
          <Link href="/" className={styles.logo}>
            <div className={styles.logoIcon}>D</div>
            <span className={styles.logoText}>Doctor Direct</span>
          </Link>

          {/* デスクトップナビゲーション */}
          <nav className={`${styles.nav} ${styles.desktopNav}`}>
            <Link href="/ai-diagnosis" className={styles.navLink}>
              AI診断
            </Link>
            <Link href="/consultation" className={styles.navLink}>
              医師相談
            </Link>
            <Link href="/doctor-search" className={styles.navLink}>
              医師検索
            </Link>
            <Link href="/emergency" className={`${styles.navLink} ${styles.emergencyLink}`}>
              緊急サポート
            </Link>
          </nav>

          <div className={styles.headerActions}>
            <ThemeToggle />
            <button 
              className={styles.mobileMenuButton}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="メニューを開く"
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
          </div>
        </div>

        {/* モバイルメニュー */}
        {isMenuOpen && (
          <div className={styles.mobileMenu}>
            <nav className={styles.mobileNav}>
              <Link 
                href="/ai-diagnosis" 
                className={styles.mobileNavLink}
                onClick={() => setIsMenuOpen(false)}
              >
                AI診断
              </Link>
              <Link 
                href="/consultation" 
                className={styles.mobileNavLink}
                onClick={() => setIsMenuOpen(false)}
              >
                医師相談
              </Link>
              <Link 
                href="/doctor-search" 
                className={styles.mobileNavLink}
                onClick={() => setIsMenuOpen(false)}
              >
                医師検索
              </Link>
              <Link 
                href="/emergency" 
                className={`${styles.mobileNavLink} ${styles.emergencyLink}`}
                onClick={() => setIsMenuOpen(false)}
              >
                緊急サポート
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}