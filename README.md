# HoliJoy

> 🇬🇧 English: [README.en.md](README.en.md)

**Otel animatörlerini**, **otelleri** ve **tatilcileri** doğrulanmış puan ve yorumlarla buluşturan bir web pazar yeri.

- Ürün ve teknik spec: [`docs/`](docs/README.md) (İngilizce)
- Commit yazma ve Git ile çalışma kuralları: [`CONTRIBUTING.md`](CONTRIBUTING.md)

Sitenin ana dili Türkçe (`/tr`, varsayılan); İngilizce (`/en`) ve Rusça (`/ru`) ikincil diller. Bunun dışındaki her şey (kod, rotalar, commit'ler, dokümanlar) İngilizce.

## Teknolojiler

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · shadcn/ui · next-intl · Supabase · Vercel. Planlanan: Cloudflare R2, kendi SMTP sunucumuz. Sitede ödeme sistemi yok (havale/EFT). Ayrıntı: [docs/05](docs/05-technical-architecture.md).

## Kendi bilgisayarında çalıştırma

Gerekenler: Node.js 20+ ve npm.

```bash
git clone https://github.com/holijoyofficial/HoliJoy.git holijoy
cd holijoy
npm install
cp .env.example .env.local   # sonra değerleri doldur (Mert/Doruk'a sor)
npm run dev
```

http://localhost:3000 adresini aç; otomatik olarak http://localhost:3000/tr adresine yönlendirilirsin.

| Komut | Ne yapar |
|---|---|
| `npm run dev` | Geliştirme sunucusunu başlatır (değişiklikler anında görünür) |
| `npm run build` | Canlı ortam derlemesi (büyük değişiklikleri push'lamadan önce çalıştır) |
| `npm run start` | Canlı derlemeyi çalıştırır |
| `npm run lint` | Kod kontrolü (ESLint) |

## Proje yapısı

```
messages/            arayüz metinleri: tr.json (varsayılan), en.json, ru.json — metinler koda gömülmez
src/
  app/[locale]/      sayfalar; her rota /tr, /en veya /ru altında
  components/        React bileşenleri (components/ui = shadcn)
  config/app.ts      skor ağırlıkları ve limitler — değiştirilecek tek yer
  i18n/              next-intl yönlendirme ve navigasyon yardımcıları
  lib/supabase/      Supabase istemcileri (tarayıcı, sunucu, proxy)
  proxy.ts           dil yönlendirmesi + Supabase oturum yenileme (Next 16'da "proxy" = eski middleware)
docs/                ürün ve teknik spec
```

Yeni sayfa eklemek: `src/app/[locale]/<ingilizce-rota>/page.tsx` dosyasını oluştur, metinlerini `messages/tr.json`, `messages/en.json` ve `messages/ru.json` dosyalarının hepsine yaz ve linklerde `next/link` yerine `@/i18n/navigation` içindeki `Link`'i kullan (böylece dil korunur).

## Ortam değişkenleri

Bkz. [`.env.example`](.env.example). Yerelde `.env.local` dosyasına (git'e girmez), Vercel'de **Project → Settings → Environment Variables** bölümüne yazılır. Gerçek anahtarları asla commit'leme; gizli bir değerin başına asla `NEXT_PUBLIC_` koyma.

## Yayına alma (Vercel)

`main` dalına yapılan her push otomatik olarak canlıya çıkar; diğer dallar ve pull request'ler kendi önizleme (preview) adresini alır. Sitenin alt kısmında canlıdaki commit yazar (`Canlı sürüm: abc1234 · <commit mesajı>`); push'unun yayına çıkıp çıkmadığını buradan kontrol edebilirsin.

### Tek seferlik kurulum (HoliJoy hesaplarıyla)

1. **GitHub:** repo HoliJoy GitHub hesabında: [holijoyofficial/HoliJoy](https://github.com/holijoyofficial/HoliJoy). Ekibi davet et (Settings → Collaborators).
2. **Supabase:** HoliJoy Google hesabıyla giriş yap → New project → adı `holijoy`, bölge **Frankfurt (eu-central-1)**; veritabanı şifresini otomatik oluştur ve ekibin şifre yöneticisine kaydet. Sonra Project Settings → API: **Project URL** ve **publishable (anon) key** değerlerini kopyala.
3. **Vercel (Hobby, ücretsiz):** HoliJoy GitHub hesabıyla kaydol → Add New → Project → repoyu içe aktar. Framework otomatik algılanır. Yayınlamadan önce `.env.example` içindeki iki Supabase değişkenini Environment Variables'a ekle. Deploy.
4. Canlı adresi (`https://<proje>.vercel.app`) ekiple paylaş.

> **Vercel Hobby uyarıları:** Hobby planı ticari olmayan kullanım içindir (MVP önizlemesi için uygun; ödeme almaya başlamadan önce Pro'ya geçilmeli, bkz. [docs/08](docs/08-roadmap.md)). Hobby'de **private** repoda yalnızca Vercel hesap sahibinin commit'leri otomatik yayına çıkabilir ve bir GitHub *organizasyonuna* ait repolar içe aktarılamayabilir. Ekip arkadaşlarının push'ları yayına çıkmıyorsa ya repoyu public yapın (kodda gizli bilgi yok) ya da Vercel Pro'ya geçin. Kurulum sırasında Vercel'in güncel dokümanlarını kontrol edin.

> **`*.vercel.app` bazı Türk internet sağlayıcılarında engelli:** ev internetinde `holijoy.vercel.app` açılmıyor ama mobil veride açılıyorsa sorun bizde değil, sağlayıcı alan adını engelliyor. Çözüm: kendi alan adımızı (domain) Vercel'e bağlamak. O zamana kadar mobil veri ya da Cloudflare WARP (ücretsiz) ile açılabilir.
