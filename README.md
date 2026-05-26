# Victoria's Secret Romania — E-commerce Clone

A front-end e-commerce storefront inspired by Victoria's Secret, built for the Romanian market. Multi-page application with product browsing, cart, wishlist, authentication, and checkout flows.

## Tech Stack

| Tool | Purpose |
|------|---------|
| Vite | Build tool & dev server |
| TypeScript | Type-safe JavaScript |
| Tailwind CSS | Utility-first styling |
| Vanilla TS | No framework — pure components |

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install dependencies

```bash
npm install
```

### Run in development

```bash
npm run dev
```

Opens automatically at `http://localhost:5173`

### Type check

```bash
npm run type-check
```

### Build for production

```bash
npm run build
```

Output goes to the `dist/` folder.

### Preview production build

```bash
npm run preview
```

## Project Structure

```
├── src/
│   ├── api/              # API layer (products, etc.)
│   ├── components/
│   │   ├── features/     # Cart, ProductCard, ProductModal, etc.
│   │   └── ui/           # Reusable UI — Toast, SizeButton, CartBadge
│   ├── constants/        # Routes, navigation, config
│   ├── hooks/            # useCart, useModal, useSearch, useToast
│   ├── layouts/          # Header, SearchOverlay, NewsletterModal
│   ├── lib/              # Storage, validation
│   ├── pages/            # Page entry points (home, cart, category)
│   ├── services/         # cartService, searchService, newsletterService
│   ├── store/            # cartStore
│   ├── styles/           # base.css, tokens.css, components.css
│   └── types/            # Shared TypeScript types
├── assets/
│   ├── image/            # Hero/background images
│   └── icon/             # Product images by category
├── data/
│   └── products.json     # Product data
├── js/                   # Legacy JS services (auth, cart, wishlist)
├── style/                # Global stylesheet
└── *.html                # One HTML file per page/route
```

## Pages

| File | Route |
|------|-------|
| `index.html` | Home |
| `sutiene.html` | Bras |
| `chiloti.html` | Underwear |
| `lenjerie.html` | Lingerie |
| `pijama.html` | Pyjamas |
| `haine-sport.html` | Sport |
| `vs-beauty.html` | Beauty |
| `accesorii.html` | Accessories |
| `swim.html` | Swimwear |
| `pink.html` | PINK |
| `nou.html` | New arrivals |
| `vs-now.html` | VS Now |
| `cos-de-cumparaturi.html` | Cart |
| `login.html` | Login |
| `inregistrare.html` | Register |

## Branch Strategy

```
main       ← production-ready code
└── develop ← active development, merge features here
      └── feature/your-feature-name
```

## License

This project is a front-end clone built for educational purposes only. Victoria's Secret is a trademark of its respective owners.
