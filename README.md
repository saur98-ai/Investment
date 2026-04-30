# Akshay Maheshwari — Investment Advisor Website

A premium, scroll-driven multi-page website for an investment advisor.

## 📂 File Structure

```
akshay_site/
├── index.html           ← Home (hero, services, testimonials, CTA)
├── about.html           ← About the advisor
├── sip.html             ← SIP & Mutual Funds (FLAGSHIP — 7-scene scroll story)
├── stock.html           ← Stock Market (4 scenes)
├── insurance.html       ← Insurance (3 scenes)
├── tax.html             ← Tax Planning (3 scenes)
├── retirement.html      ← Retirement Planning (4 scenes)
├── calculators.html     ← SIP/Lumpsum/Goal/SWP calculators
├── testimonials.html    ← Client testimonials
├── contact.html         ← Contact form + info
├── css/
│   └── styles.css       ← All shared styles
└── js/
    └── main.js          ← All shared JavaScript
```

## 🚀 How to Use

1. Just open `index.html` in any modern browser — no server needed.
2. Or upload the entire `akshay_site/` folder to any web host (GoDaddy, Hostinger, Bluehost, Netlify, GitHub Pages, etc.).

## ✏️ What to Customize Before Going Live

Search and replace these placeholders across all HTML files:

| Placeholder | Replace With |
|---|---|
| `+91 XXXXX XXXXX` | Your real phone number |
| `wa.me/91XXXXXXXXXX` | Your WhatsApp link (e.g. `wa.me/919876543210`) |
| `tel:+91XXXXXXXXXX` | Your real phone for click-to-call |
| `yourmail@gmail.com` | Your email |
| `#` (in Instagram/LinkedIn links) | Your real social URLs |

Quick way using terminal/VS Code: `Find & Replace in All Files`.

## 🎨 Design System

- **Fonts:** Cormorant Garamond (display) + Outfit (body)
- **Colors:** Deep navy (`#070D18`) base + gold (`#C9A84C`) accents
- **Vibe:** Premium · classy · informational · scroll-driven

## ✨ Features

- ✅ 5 service pages with golden silhouette scroll stories
- ✅ Sticky timeline rail (left side, on story pages)
- ✅ Wealth counter (top-right, on SIP page)
- ✅ Animated stat counters
- ✅ Parallax silhouettes
- ✅ Floating gold particles
- ✅ Sequential SVG build animations
- ✅ Fully responsive (desktop + mobile)
- ✅ WhatsApp floating button
- ✅ Working calculators (SIP, Lumpsum, Goal, SWP)
- ✅ Contact form (frontend; needs backend integration to actually send)

## 📧 To Make the Contact Form Work

Right now, the form is frontend-only. To actually receive submissions, integrate one of:
- **Formspree** (easiest — just change form `action`)
- **Web3Forms**
- **EmailJS**
- Custom backend (PHP/Node/Python)

## 💡 Tech Notes

- No frameworks required — pure HTML/CSS/JS
- Loads Google Fonts from CDN
- All animations are CSS-driven for smoothness
- Scroll story uses Intersection Observer pattern in plain JS

---

© 2025 — Built with care for Akshay Maheshwari
