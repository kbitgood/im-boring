# Project: I'm Boring

A retro-arcade website with a big red button that generates boredom-busting ideas using AI.

## Deployment

This project is deployed using GitHub Pages. To deploy:

```bash
npm run deploy
```

This uses the `gh-pages` package to publish the site to the `gh-pages` branch.

**Important:** Always use `npm run deploy` for deployment. Do NOT use Cloudflare Wrangler or other deployment tools.

## Project Structure

```
im-boring/
├── index.html          # Main page
├── style.css           # Retro styling, animations
├── script.js           # Button logic, AI, sounds, history
├── PLAN.md             # Project specification
├── AGENTS.md           # This file
├── scripts/
│   ├── ralph.sh        # Ralph automation script
│   └── ralph/
│       ├── progress.txt        # Progress log
│       ├── completed-tasks.txt # Completed task IDs
│       └── archive/            # Archived task files
└── tasks/
    ├── prd-im-boring.md        # Product requirements
    └── ralph-tasks.md          # Task breakdown
```

## Tech Stack

- Vanilla HTML/CSS/JS (no build step)
- Web Audio API for sounds
- Chrome Built-in AI (Prompt API) with fallback

## Design System

### Colors (Synthwave/Vaporwave)
- Neon Pink: `#ff00ff`, `#ff71ce`
- Cyan: `#00ffff`, `#01cdfe`
- Purple: `#b967ff`, `#8b00ff`
- Dark BG: `#0a0a0a`, `#1a1a2e`

### Fonts
- Pixel font: "Press Start 2P" from Google Fonts

## Development Notes

- No external dependencies required
- All sounds generated via Web Audio API
- Chrome AI has fallback to preset idea list
