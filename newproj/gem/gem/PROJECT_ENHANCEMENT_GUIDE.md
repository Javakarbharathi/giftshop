# 📱 Mobile PWA App, Clean Minimalist UI & Free Hosting Architecture Guide

---

## 1. 📱 Native Mobile App (PWA) & Responsive Experience
The web application is fully configured as an installable Progressive Web App (PWA) with native mobile ergonomics:
* **Web App Manifest ([`public/manifest.json`](file:///C:/Users/javak/newproj/gem/giftshop_frontend/public/manifest.json))**: Standalone display mode, dark theme bar (`#0F172A`), splash screen support, and app icon definitions.
* **Service Worker ([`public/sw.js`](file:///C:/Users/javak/newproj/gem/giftshop_frontend/public/sw.js))**: Caches static shell assets for instant load times and offline readiness.
* **Native Mobile Bottom Navigation ([`src/MobileBottomNav.jsx`](file:///C:/Users/javak/newproj/gem/giftshop_frontend/src/MobileBottomNav.jsx))**:
  * Fixed at the bottom on all mobile devices with `env(safe-area-inset-bottom)` support.
  * 5 Primary Tabs: **Home**, **Shop**, **Studio (Center Highlight)**, **Cart (Live Badge)**, and **Account**.
* **Zero Clutter on Mobile**: Header navigation collapses into a clean top branding bar on phones, moving primary thumb actions to the bottom navigation bar.

---

## 2. 🎨 Clean, Restrained & High-Class Minimalist Styling ([`src/index.css`](file:///C:/Users/javak/newproj/gem/giftshop_frontend/src/index.css))
* **Palette**: Restrained, architectural colors avoiding flashy rainbow saturation:
  * **Obsidian Slate** (`#0F172A`): Primary headings and high-class action buttons.
  * **Porcelain Canvas** (`#FAFBFD`): Clean background with calm fluid silk canvas waves.
  * **Hairline Borders** (`#E2E8F0`): Subtle 1px dividers giving clean card definition.
  * **Artisan Terracotta / Amber** (`#EA580C`): Warm accent used strictly for focal points.

---

## 3. 🌐 Free Hosting & Cloud Deployment Guide

### Option A: Frontend on Vercel / Netlify (100% Free)
1. Push this repository to GitHub.
2. Go to [Vercel](https://vercel.com) or [Netlify](https://netlify.com) and click **"New Project"**.
3. Select the `giftshop_frontend` directory.
4. Framework preset: **Vite**.
5. Build Command: `npm run build`, Output Directory: `dist`.
6. Click **Deploy**. Vercel will provide a free `https://your-giftshop.vercel.app` domain with automatic SSL and PWA support!

### Option B: Backend on Render / Railway / PythonAnywhere (100% Free)
1. In `giftshop_backend`, ensure `whitenoise` or Gunicorn is configured in `requirements.txt`.
2. Connect the GitHub repo to [Render](https://render.com) as a **Free Web Service**.
3. Build Command: `pip install -r requirements.txt && python manage.py migrate`.
4. Start Command: `gunicorn giftshop_backend.wsgi:application`.
5. Update `giftshop_frontend/src/api.js` base URL to your Render API domain (`https://your-backend.onrender.com`).
