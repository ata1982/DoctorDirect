# デザイン破綻防止ガイドライン

## 問題の原因と解決策

### 1. TailwindCSS関連の問題

#### **原因**
- **TailwindCSS v4の使用**: 実験的で不安定、設定が複雑
- **PostCSS設定の不備**: `@import "tailwindcss"`形式が正しく動作しない
- **カスタムクラスとの競合**: グローバルCSSとTailwindの衝突
- **ビルド時のコンパイルエラー**: CSS生成の失敗

#### **対策**
✅ **CSS Modulesを使用する**（推奨）
✅ どうしてもTailwindを使う場合はv3.4.x以下を使用
✅ カスタムCSSは最小限に抑制
✅ PostCSS設定を正確に行う

### 2. CSS設計の問題

#### **原因**
- **グローバルCSSの乱用**: 予期しないスタイルの継承
- **詳細度の競合**: !importantの濫用
- **命名規則の不統一**: クラス名の衝突
- **レスポンシブ対応の不備**: メディアクエリの不適切な使用

#### **対策**
✅ **CSS Modulesで局所化**
✅ **BEMやSMACSS等の命名規則**を採用
✅ **モバイルファーストデザイン**
✅ **コンポーネント単位でのCSS管理**

### 3. Next.js特有の問題

#### **原因**
- **ファイル読み込み順序**: CSSの読み込み順序が不定
- **SSR/CSRの差異**: サーバーとクライアントでのスタイル差異
- **Hot Reload時の問題**: 開発時のCSS反映遅延

#### **対策**
✅ **CSS Modulesの使用**で局所化
✅ **globals.cssは最小限**に抑制
✅ **開発サーバーの定期的な再起動**

## 推奨アーキテクチャ

### ファイル構成
```
app/
├── globals.css              # 最小限のグローバルスタイル
├── page.tsx                 # ページコンポーネント
├── page.module.css          # ページ専用CSS
components/
├── Header/
│   ├── Header.tsx           # コンポーネント
│   └── Header.module.css    # コンポーネント専用CSS
```

### CSS Modules設計原則

#### 1. **ファイル構成**
```css
/* コンポーネント名.module.css */

/* メインコンテナ */
.container { }

/* 要素 */
.header { }
.title { }
.description { }

/* 修飾子 */
.isActive { }
.isDisabled { }

/* レスポンシブ */
@media (min-width: 768px) {
  .container { }
}
```

#### 2. **命名規則**
- **camelCase**を使用: `.primaryButton` 
- **BEMライク**: `.card`, `.cardTitle`, `.cardDescription`
- **状態**: `.isActive`, `.isLoading`, `.hasError`

#### 3. **CSS変数の活用**
```css
.component {
  --primary-color: #007aff;
  --secondary-color: #30d158;
  --border-radius: 8px;
  
  background-color: var(--primary-color);
  border-radius: var(--border-radius);
}
```

### globals.css設計

#### **最小限の内容に限定**
```css
/* リセット・ノーマライズ */
* { margin: 0; padding: 0; box-sizing: border-box; }

/* 基本フォント・色 */
body { 
  font-family: system-ui, sans-serif;
  line-height: 1.6;
}

/* ダークモード変数 */
.dark { --text-color: #f5f5f7; }

/* ユーティリティ（最小限） */
.container { max-width: 1200px; margin: 0 auto; }
.hidden { display: none; }
```

## 開発時のベストプラクティス

### 1. **段階的開発**
1. HTMLマークアップを先に完成
2. CSS Modulesでスタイリング
3. レスポンシブ対応
4. ダークモード対応
5. アニメーション追加

### 2. **テスト方法**
- **複数ブラウザでの確認**
- **デベロッパーツールでのCSS検証**
- **モバイル・デスクトップでの表示確認**
- **ダークモード切り替えテスト**

### 3. **トラブルシューティング**

#### デザインが反映されない場合
1. **開発サーバー再起動**: `npm run dev`
2. **ブラウザキャッシュクリア**: Ctrl+Shift+R
3. **CSS Modulesクラス名確認**: `styles.className`
4. **エラーログ確認**: コンソールエラーチェック

#### レイアウト崩れの場合
1. **ボックスモデル確認**: `box-sizing: border-box`
2. **Flexbox/Grid設定確認**: 親要素の設定
3. **z-index競合確認**: 重なり順序の確認
4. **レスポンシブ設定確認**: メディアクエリの適用

## AIに依頼する際の指示テンプレート

```
【指示テンプレート】

このプロジェクトではCSS Modulesを使用しています。以下の原則に従ってください：

1. **CSS Modulesを使用**:
   - コンポーネント名.module.cssファイルを作成
   - クラス名はcamelCaseで命名
   - styles.classNameでインポート

2. **TailwindCSSは使用禁止**:
   - 代わりにCSS Modulesで実装
   - globals.cssは最小限に留める

3. **レスポンシブ対応必須**:
   - モバイルファーストで設計
   - 768px以上でデスクトップ対応

4. **ダークモード対応**:
   - .dark セレクタを使用
   - CSS変数での色管理

例：
```tsx
import styles from './Component.module.css'

export default function Component() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>タイトル</h1>
    </div>
  )
}
```

この指示を遵守して、安定したデザインシステムを構築してください。
```

## 禁止事項

❌ **TailwindCSS v4の使用**
❌ **大量のカスタムCSSクラス**
❌ **!importantの濫用**
❌ **インラインスタイルの多用**
❌ **グローバルCSSでのコンポーネントスタイリング**
❌ **命名規則の無視**

## 推奨事項

✅ **CSS Modulesの使用**
✅ **コンポーネント単位でのCSS管理**
✅ **CSS変数での色・サイズ管理**
✅ **段階的なスタイル適用**
✅ **レスポンシブ・ダークモード対応**
✅ **定期的な開発サーバー再起動**

---

**このガイドラインを遵守することで、安定したデザインシステムを維持できます。**