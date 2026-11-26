# Trekking Buddha — Modern Redesign (demo)

A modern redesign proposal for [trekkingbuddha.com](https://trekkingbuddha.com/), in two parts:

1. **Website** (repo root): plain HTML/CSS/JS, no build step.
2. **[`remotion/`](remotion/)**: promo videos and social banners built with Remotion. Ready renders are in [`remotion/renders/`](remotion/renders/).

All photos, trek posters and the logo belong to Trekking Buddha and come from the current site. The logo is used **unchanged**.

## The signature feature: the Buddha walks the mountains as you scroll
- A monk in a saffron robe with a backpack and trekking pole, styled after the logo, walks along a **mountain-ridge progress bar** under the navigation as you scroll the page.
- In the pinned **Journey** section, he walks a parallax Himalayan scene from night to summit sunrise, with prayer flags, an altitude counter (1,800 → 5,364 m) and the brand story in 5 steps.
- His legs move only while you scroll and settle when you stop.

## Website sections
Hero · Journey · Stats · Next departures (winter 2026–27, book on WhatsApp) · Treks 2027 with Nepal/India filter · Why us · Founder story · Quote · Story-Trails gallery by year with lightbox · Enquiry form → WhatsApp · Footer · Floating WhatsApp button.
Mobile-first, respects reduced-motion settings, and uses optimised WebP images (~3 MB in total).

## Run the website locally
```bash
python3 -m http.server 8080
```
Then open http://localhost:8080

## Publish with GitHub Pages
Settings → Pages → Source: *Deploy from a branch* → `main` / `(root)`. The site will be live at `https://<user>.github.io/demowebsite1/`.

## Videos and banners
```bash
cd remotion
npm install
npm run dev          # preview in Remotion Studio
npm run render:all   # render MP4s and PNGs into out/
```
