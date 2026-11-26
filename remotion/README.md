# Trekking Buddha — Promo Videos & Banners (Remotion)

Video and social-banner kit for Trekking Buddha, built with [Remotion](https://remotion.dev) (React → MP4/PNG).
It stars the same **walking Buddha** as the website: a monk in a saffron robe with a backpack and trekking pole, walking through the Himalayas from night to summit sunrise.
The original logo is used **unchanged**. Photos are Trekking Buddha's own.

## Compositions
| ID | Size | What |
|---|---|---|
| `PromoReel` | 1080×1920, 20 s | Instagram Reel / Story / YouTube Short |
| `PromoLandscape` | 1920×1080, 20 s | YouTube / website / Facebook video |
| `FacebookCover` | 1640×624 | Facebook page cover |
| `YouTubeBanner` | 2560×1440 | Channel art (text kept inside the 1546×423 safe area) |
| `InstagramPost` | 1080×1350 | Winter 2026–27 departures post |
| `WebsiteHero` | 1920×1080 | Hero/OG image |

Video storyboard: logo intro over night mountains → the Buddha walks the ridge with an altitude counter → trek photos (Sandakphu, Mardi Himal, ABC, EBC) → departure dates → summit sunrise with WhatsApp CTA.

Ready-made banner images are in [`renders/`](renders/). Video files are not included for now; render them with `npm run render:reel` if you need them later.

## Use
```bash
npm install
npm run dev            # Remotion Studio: preview and tweak
npm run render:all     # renders everything into out/
```
Edit text, dates and treks in `src/Promo.tsx` and `src/Banners.tsx`. Fonts (Fraunces, Inter) are bundled in `public/fonts`, so renders work offline.

## Structure
```
src/Monk.tsx        the walking Buddha character (walk cycle driven by `phase`)
src/Mountains.tsx   parallax Himalaya scene with night → sunrise palette
src/Promo.tsx       the 5-scene promo video
src/Banners.tsx     social banners
src/Root.tsx        composition registry
public/             logo, photos, fonts
```
