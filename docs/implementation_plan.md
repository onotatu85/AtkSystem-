# 自動テストツール実装計画

`test_plan.md` に定義されたチェックリストを自動実行し、証跡（スクリーンショット）を保存するツールを作成します。

## 概要
- **使用技術**: Node.js, Playwright
- **目的**: 認証、勤怠、ユーザー管理のE2Eテスト自動化とエビデンス取得
- **成果物**: `AtkSystem.Tests` フォルダ内にスクリプト一式

## Prerequisites
- Node.js v14以上 (確認済: v14.15.3)
- ローカルサーバーが起動していること (`https://localhost:5001` 等)
- SQL Serverが稼働していること

## Proposed Changes

### 1. プロジェクトセットアップ
`c:\works\AtkSystem` 直下に `AtkSystem.Tests` ディレクトリを作成し、npmプロジェクトとして初期化します。
- `npm init -y`
- `npm i -D @playwright/test`

### 2. テスト設定 (playwright.config.js)
- ベースURL設定
- スクリーンショット保存設定 (`on: 'always'`)
- ブラウザ設定 (Chromium, Firefox, WebKit)

### 3. テストシナリオ実装
各仕様カテゴリに対応するテストファイルを作成します。

#### [NEW] tests/auth.spec.js
- **A-01 ログイン成功**: 正しい資格情報でログインし、ダッシュボード遷移確認。スクショ保存。
- **A-02 ログイン失敗**: 誤った情報でエラー確認。スクショ保存。
- **A-03 ログアウト**: ログアウト処理確認。

#### [NEW] tests/attendance.spec.js
- **B-01 出勤打刻**: 出勤ボタン押下 -> DB反映確認(UI上)。
- **B-04 退勤打刻**: 退勤ボタン押下 -> 完了確認。
※ 休憩開始・終了も同様に実装。

#### [NEW] tests/user_management.spec.js
- **D-01 ユーザー一覧**: 管理者でログインし一覧表示。
- **D-03 ユーザー編集**: 情報更新とそれが反映されたかの確認。
- **D-03 ユーザー無効化**: 無効化チェック -> ログイン不可確認。

### 4. エビデンス収集・レポート
- テスト実行後、`playwright-report` または指定したフォルダにスクリーンショットと結果HTMLが生成されるよう構成します。

## Verification Plan
1. アプリケーション (`AtkSystem.Web`) を起動 (`dotnet run`)。
2. 別ターミナルで `npx playwright test` を実行。
3. 生成されたレポートを開き、全テストがPASSしていること、および必要な箇所のスクリーンショットが撮れていることを確認。
