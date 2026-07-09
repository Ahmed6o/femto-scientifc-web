# Femto-Scientific Clone
## React + Vite Website Clone

A modern, full-featured clone of [femto-scientific.com](https://femto-scientific.com/) built with React and Vite.

## 🚀 Quick Start

### Prerequisites
- Node.js v18+ installed

### Installation
```bash
cd femto-clone
npm install
npm run dev
```

The app will open at **http://localhost:3000**

## 📁 Project Structure

```
femto-clone/
├── public/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx      # Main navigation with mega dropdown
│   │   ├── Footer.jsx      # Site footer with newsletter
│   │   ├── HeroSlider.jsx  # Animated hero carousel
│   │   └── ProductCard.jsx # Product display card
│   ├── data/
│   │   └── products.js     # All products, categories, brands data
│   ├── pages/
│   │   ├── Home.jsx        # Homepage with all sections
│   │   ├── Products.jsx    # Products listing with filters
│   │   ├── ProductDetail.jsx # Individual product page
│   │   ├── About.jsx       # About Us page
│   │   └── Contact.jsx     # Contact form + map
│   ├── styles/
│   │   └── global.css      # Global design system
│   ├── App.jsx             # Main app with routing
│   └── main.jsx            # React entry point
├── index.html
├── package.json
└── vite.config.js
```

## 🎨 Design System

| Color | Value |
|-------|-------|
| Primary Blue | `#4e97fd` |
| Primary Dark | `#1a5db5` |
| Accent Orange | `#e4573d` |
| Dark Navy | `#0a2244` |

**Fonts:** Poppins (headings) + Roboto (body)

## 📦 Features

- ✅ Responsive design (Mobile, Tablet, Desktop)
- ✅ Animated hero slider with 3 slides
- ✅ Products listing with category/brand/search filters
- ✅ Product detail pages with specs table
- ✅ Mega dropdown navigation menu
- ✅ Animated statistics counter
- ✅ Contact form with validation
- ✅ Smooth scroll-to-top button
- ✅ Google Maps embed

## 🛠️ Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite 5
- **Routing:** React Router DOM v6
- **Icons:** Font Awesome 6
- **Fonts:** Google Fonts (Poppins, Roboto)
