# Cyber Docs

Interactive documentation hub for the Cybersecurity team, built with Astro.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Open [http://localhost:4321](http://localhost:4321) to view the site locally.

## 📁 Project Structure

```
cyber-docs/
├── src/
│   ├── pages/
│   │   ├── index.astro              # Portal landing page
│   │   └── sentinel/                # Microsoft Sentinel docs
│   │       ├── index.astro
│   │       ├── getting-started.astro
│   │       ├── data-connectors.astro
│   │       ├── kql-queries.astro
│   │       ├── playbooks.astro
│   │       └── quiz.astro
│   ├── layouts/
│   │   ├── PortalLayout.astro       # Landing page layout
│   │   └── DocsLayout.astro         # Documentation layout with sidebar
│   └── components/
│       ├── SimulatedCLI.astro       # Interactive CLI simulator
│       ├── Quiz.astro               # Knowledge check quizzes
│       ├── ClickableCard.astro      # Navigation cards
│       ├── Callout.astro            # Info/warning/tip boxes
│       └── ToolCard.astro           # Tool cards for portal
├── scripts/
│   └── ai-update.ts                 # AI-assisted content updates
├── public/
│   └── favicon.svg
└── .github/
    └── workflows/
        └── deploy.yml               # GitHub Pages deployment
```

## 🌐 URLs

Once deployed:
- **Portal**: `https://mcflyatcc.github.io/cyber-docs/`
- **Sentinel**: `https://mcflyatcc.github.io/cyber-docs/sentinel/`

## 🛠 Adding a New Tool

1. Create a new folder: `src/pages/newtool/`
2. Add pages following the Sentinel pattern
3. Update `DocsLayout.astro` to add navigation for the new tool
4. Add a card to `src/pages/index.astro`

## 🤖 AI-Assisted Updates

```bash
# Set your API key
export ANTHROPIC_API_KEY=your-key-here

# Analyze a file for potential updates
npm run ai-update src/pages/sentinel/kql-queries.astro
```

## 🚢 Deployment

Push to `main` and GitHub Actions will automatically deploy to GitHub Pages.

**Manual setup:**
1. Go to Settings → Pages
2. Set Source to "GitHub Actions"
3. Push any commit to trigger deployment

## 📚 Tech Stack

- [Astro](https://astro.build/) - Static site generator
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Pagefind](https://pagefind.app/) - Search
- GitHub Pages - Hosting
