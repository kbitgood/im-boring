# I'm Boring

A retro-arcade website with a big red button that generates weird and wacky boredom-busting ideas.

**[Try it live](https://kbitgood.github.io/im-boring/)**

## About

Press the button. Get a weird idea. Cure your boredom. It's that simple.

"I'm Boring" features a synthwave/vaporwave aesthetic with animated pixel starfields, 8-bit game sounds, and a cute pixel robot mascot. When you press the button, you'll receive quirky, unexpected activity suggestions like staging a soap opera with your houseplants or writing a villain origin story for your printer.

## Features

- **Big Red Button** - Pulsing neon glow, satisfying click sounds
- **AI-Powered Ideas** - Uses Chrome's Built-in AI when available
- **3000+ Preset Ideas** - Curated fallback ideas for all browsers
- **Retro Game Sounds** - Web Audio API generated 8-bit sounds
- **Animated Mascot** - Bouncing pixel robot during loading
- **History Gallery** - See and revisit all your past ideas
- **Daily Limit** - 10 ideas per 4-hour window (to encourage actually doing things)
- **Crash Easter Egg** - Keep pressing after the limit for a surprise
- **PWA Support** - Install on mobile as an app

## Tech Stack

- Vanilla HTML/CSS/JS (no build step)
- Web Audio API for sound generation
- Chrome Built-in AI (Prompt API) with fallback
- localStorage for history persistence
- GitHub Pages deployment

## Design

### Color Palette (Synthwave/Vaporwave)

| Color | Hex |
|-------|-----|
| Neon Pink | `#ff00ff`, `#ff71ce` |
| Cyan | `#00ffff`, `#01cdfe` |
| Purple | `#b967ff`, `#8b00ff` |
| Dark BG | `#0a0a0a`, `#1a1a2e` |

### Typography

- **Pixel Font**: "Press Start 2P" from Google Fonts

## Project Structure

```
im-boring/
├── index.html          # Main page
├── style.css           # Retro styling, animations
├── script.js           # Button logic, AI, sounds, history
├── manifest.json       # PWA manifest
├── icon.svg            # Favicon
├── icon-192.png        # PWA icon
├── icon-512.png        # PWA icon
├── apple-touch-icon.png
├── ideas/
│   ├── index.json      # Pack registry
│   └── pack-*.json     # Idea packs (3000+ ideas)
└── scripts/
    └── generate-pack.sh
```

## Development

No build step required. Just open `index.html` in a browser or serve with any static server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .
```

## Deployment

This project is deployed using GitHub Pages:

```bash
npm run deploy
```

This uses the `gh-pages` package to publish to the `gh-pages` branch.

## How It Works

### Idea Generation

1. **Chrome AI** - If Chrome's Built-in AI (Prompt API) is available, it generates unique ideas on the fly
2. **Fallback** - If AI is unavailable, ideas are pulled from 30+ idea packs containing 3000+ curated suggestions
3. **No Repeats** - Used ideas are removed from the local pool until packs are refreshed

### Rate Limiting

To encourage actually doing activities instead of endlessly pressing the button:
- 10 ideas per 4-hour window
- Countdown timer shows when limit resets
- Escalating warnings if you keep pressing after limit
- Retro "crash" effect after 20 presses past the limit

### Sounds

All sounds are generated programmatically using the Web Audio API:
- Coin pickup
- Power-up arpeggio
- 8-bit bleeps
- Level-up fanfare
- Bonus sweep
- Zap laser
- Warp wobble

## Accessibility

- Keyboard navigation support
- ARIA labels on interactive elements
- `prefers-reduced-motion` support
- High contrast mode support
- Proper focus states

## Browser Support

- **Chrome 127+**: Full support including Built-in AI
- **All modern browsers**: Full support with fallback ideas
- **Mobile**: Responsive design, touch-friendly

## License

MIT

## Credits

Created with boredom and a desire to cure it.
