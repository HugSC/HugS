# LP用 画像素材一覧

## 現行ファイル構成（実装で使用中）

| 配置 | パス | 用途 |
|---|---|---|
| KV | `images/hero/hero-family.jpg` | ヒーロー画像（親子写真） |
| ストーリー | `images/brand/yansae-logo.jpg` | 「なぜ赤ジャージで?」セクションのヤンサエ円形ロゴ（赤ジャージ姿）。白背景は `mix-blend-mode: multiply` で透過表示 |
| 自己紹介 | `images/profile/profile-portrait.jpg` | 「カブラルサエ」上部のリードポートレート |
| 自己紹介 / 看護師 | `images/profile/profile-nurse-surgery.jpg` | 手術衣姿で医療現場に立つショット |
| サービス | `images/service/service-kamishibai.jpg` | 紙芝居・歌の出前授業 |
| サービス | `images/service/service-staff-training.jpg` | 職員研修 |
| サービス | `images/service/service-classroom.jpg` | 小学校での包括的性教育（複数カードで使用） |
| サービス | `images/service/service-guardian-training.jpg` | 保護者向け講座 |
| サービス | `images/service/service-online-lesson.jpg` | オンライン個別レッスン |
| 講座の様子 | `images/atmosphere/atmosphere-family-lesson.jpg` | ギャラリー：親子で講座を受けている様子 |
| 講座の様子 | `images/atmosphere/atmosphere-individual-lesson.jpg` | ギャラリー：少人数で対話的に学ぶ子どもたち |
| 講座の様子 | `images/atmosphere/atmosphere-community.jpg` | ギャラリー：コミュニティイベントの集合写真 |
| 講座の様子 | `images/atmosphere/atmosphere-discussion.jpg` | ギャラリー：保護者向け座談会の様子 |
| 講座の様子 | `images/atmosphere/atmosphere-instructor.jpg` | ギャラリー：教材を手にお話を届けるカブラルサエ |
| ファビコン | `favicon.ico`, `apple-touch-icon.png`（ルート直下）/ `images/favicon/favicon-16x16.png`, `favicon-32x32.png` | 各サイズのファビコン（HTML `<head>` で参照中の4点） |

---

## 補足: アイコンで代替している箇所（画像不要）

| 箇所 | 現状の処理 |
|---|---|
| Voiceカード（3枚）のアバター | SVG人物アイコンで表示中。実際の写真は不要（匿名の声なので） |
| Visionカード（4枚）のアイコン | SVGアイコンで表示中。イラスト不要 |
| 実績カウンター（3つ）のアイコン | SVGアイコンで表示中。イラスト不要 |

---

## メンテナンスメモ

- **未使用素材の整理（2026-06）**: 参照のないクライアント支給素材（`profile-kimono.jpg` / `profile-nurse-smile.jpg` / `profile-nurse-ultrasound.jpg`）および旧看護師ポートレート（`profile-nurse-portrait.jpg`）は実装から外れたため削除済み。元データが必要な場合はクライアント支給フォルダ（`LINE_ALBUM_HP写真_*`）を参照。
- **ファビコン**: PWA用の `android-chrome-192x192.png` / `android-chrome-512x512.png` / `favicon-48x48.png` は `site.webmanifest` 未設置で未参照だったため削除済み。ホーム画面追加（PWA）対応を行う場合は、マニフェストとあわせて再生成すること。
- 上記はいずれも Git 管理下のため、必要時は履歴から復元可能。
