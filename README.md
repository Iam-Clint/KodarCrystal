# Crystal.dev — Prompt to App Builder

> Describe your idea in plain English. Crystal.dev turns it into a complete app — pages, UI, branding, and code structure — instantly.

![Crystal.dev landing page](https://id-preview--ad5410f4-6ef6-4e45-95cc-6cbf874608d6.lovable.app)

---

## What is Crystal.dev?

Crystal.dev is an Africa-first prompt-to-app builder targeting developers, entrepreneurs, and creators across Nigeria and beyond who want to go from idea to shipped product without the friction of starting from scratch.

Type what you want to build. Crystal.dev handles the rest — architecture, UI, component structure, and a live preview — so you can focus on iterating, not scaffolding.

Built as a direct alternative to Lovable, Bolt.new, and v0.dev, with differentiators designed specifically for the African market:

- **Naira pricing** — no dollar conversion surprises
- **African business templates** — food delivery, fintech, logistics, edtech, and more
- **Local payment integrations** — Paystack, Flutterwave out of the box
- **Low-bandwidth optimized** — performance-first architecture

---

## Features

### Builder
- **Build mode** — full app generation from a natural language prompt
- **Plan mode** — lightweight discussion of architecture before committing credits (no generation cost)
- **Effort selector** — Low / Medium / High / Max, with transparent credit cost shown before generating
- File tree + code viewer alongside the live preview

### Dashboard
- Project management — create, rename, duplicate, delete
- Real-time activity feed
- AI suggestions widget
- Usage and credit tracking

### Settings
- Profile — name, avatar, email, GitHub connection
- Usage & Access — credit balance (platform vs cloud split), weekly usage breakdown, default effort level, cost warning toggles
- API Keys — manage tokens
- Connectors — GitHub, Vercel, Supabase, Stripe, and more
- Billing

### Other
- Community showcase — browse and remix public projects
- Docs — full documentation
- Changelog — release notes
- Pricing — Free, Pro, and Team plans (Naira-denominated)
- Custom 404, Terms, and Privacy pages

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React (Vite) |
| Routing | TanStack Router |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| UI Components | shadcn/ui |
| Icons | Lucide React |
| Typography | Fraunces (display) · Geist (body) · JetBrains Mono (code) |
| Hosting | Vercel |

> **Status:** Frontend/UI only. No backend, no real AI generation, no database. All data is mocked locally. Backend integration is planned for a future phase.

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
git clone https://github.com/crystaldev/crystal.git
cd crystal
npm install
npm run dev
```

App runs at `http://localhost:5173`

### Building for production

```bash
npm run build
npm run preview
```

---


## Roadmap

- [ ] Real AI generation backend (Claude API)
- [ ] Supabase auth + database (user profiles, projects, usage)
- [ ] Paystack billing integration (Naira pricing)
- [ ] Team/workspace support — invite members, roles, shared projects
- [ ] One-click deploy to Vercel/Netlify from the builder
- [ ] Export to React, Flutter, Figma, HTML/CSS
- [ ] African business template library
- [ ] Mobile app (React Native)

---

## Contributing

Crystal.dev is currently in early development. Contributions, issues, and feature requests are welcome.

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## License

MIT License — see [LICENSE](./LICENSE) for details.

---

## Built by

**Clinton Adedoja Andreas** — [@IamClint01](https://github.com/Iam-Clint) · [LinkedIn](https://linkedin.com/in/clinton-adedoja) · [Portfolio](https://clintonadedoja.netlify.app)

> *"Every great product started as a prompt."*
