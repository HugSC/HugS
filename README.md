# LP用 画像素材一覧

## 現行ファイル構成（実装で使用中）

| 配置 | パス | 用途 |
|---|---|---|
| KV | `images/hero/hero-family.jpg` | ヒーロー画像（親子写真） |
| ストーリー | `images/brand/yansae-logo.jpg` | 「なぜ赤ジャージで?」セクションのヤンサエ円形ロゴ（赤ジャージ姿）。白背景は `mix-blend-mode: multiply` で透過表示 |
| 自己紹介 | `images/profile/profile-portrait.jpg` | 「カブラルサエ」上部のリードポートレート |
| 自己紹介 / 看護師 | `images/profile/profile-nurse-portrait.jpg` | 看護師としてのポートレート（1 枚目） |
| 自己紹介 / 看護師 | `images/profile/profile-nurse-surgery.jpg` | 看護師としての医療現場ショット（2 枚目） |
| サービス | `images/service/service-kamishibai.jpg` | 紙芝居・歌の出前授業 |
| サービス | `images/service/service-staff-training.jpg` | 職員研修 |
| サービス | `images/service/service-classroom.jpg` | 小学校での包括的性教育（複数カードで使用） |
| サービス | `images/service/service-guardian-training.jpg` | 保護者向け講座 |
| サービス | `images/service/service-online-lesson.jpg` | オンライン個別レッスン |
| ファビコン | `images/favicon/*` | 各サイズのファビコン |

---

## 未使用ファイル（保持中・参考用）

クライアント支給素材の元データを残しています。差し替え検討時に利用可能：

- `images/profile/profile-kimono.jpg` — 着物姿（神社・桜背景）
- `images/profile/profile-nurse-smile.jpg` — 旧：超音波装置前のポーズ写真
- `images/profile/profile-nurse-ultrasound.jpg` — 旧：超音波装置前の作業ショット
- 作業ディレクトリ直下 `LINE_ALBUM_HP写真_260516_2/3/4/6/7/8.jpg` — クライアント支給の未採用 6 枚

---

## 補足: アイコンで代替している箇所（画像不要）

| 箇所 | 現状の処理 |
|---|---|
| Voiceカード（3枚）のアバター | SVG人物アイコンで表示中。実際の写真は不要（匿名の声なので） |
| Visionカード（4枚）のアイコン | SVGアイコンで表示中。イラスト不要 |
| 実績カウンター（3つ）のアイコン | SVGアイコンで表示中。イラスト不要 |
