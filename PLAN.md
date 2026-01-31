# "I'm Boring" Website Plan

A fun retro-arcade website with a big red button that generates weird and wacky boredom-busting ideas using AI.

## Tech Stack

- **Vanilla HTML/CSS/JS** - Simple, no build step required

## Core Features

### 1. Big Red Button
- Large, prominent button with "I'm Boring" text
- Pulsing neon glow animation (idle state)
- Click triggers sound + AI request

### 2. AI-Powered Ideas
- **Primary**: Chrome Built-in AI (Prompt API) for generating weird/wacky suggestions
- **Fallback**: Preset list of funny ideas for unsupported browsers
- Ideas should be quirky, absurd, and unexpected

### 3. Retro Game Sounds
- Multiple random 8-bit style sounds on button press
- Generated via Web Audio API (no external files needed)
- Sound types: coin sounds, power-ups, 8-bit bleeps

### 4. Animated Result Card
- Idea slides in with smooth animation after button press
- Styled to match retro theme

### 5. History Gallery
- Card gallery displayed below the main button
- Shows all previous suggestions from the session
- Scrollable grid of past idea cards

## Visual Design

### Color Palette: Synthwave/Vaporwave
- Neon pink (`#ff00ff`, `#ff71ce`)
- Cyan (`#00ffff`, `#01cdfe`)
- Purple (`#b967ff`, `#8b00ff`)
- Dark backgrounds (`#0a0a0a`, `#1a1a2e`)

### Retro/Arcade Elements
- Pixel fonts (Google Fonts: Press Start 2P or similar)
- Animated pixel star background (moving stars/particles)
- CRT-inspired styling
- Glowing neon effects

### Button Styling
- Large, rounded red button
- Pulsing glow effect (pink/purple neon)
- Satisfying press animation on click

## File Structure

```
im-boring/
├── index.html      # Main page structure
├── style.css       # Retro styling, animations
├── script.js       # Button logic, AI integration, sounds, history
└── PLAN.md         # This file
```

## Implementation Steps

1. **HTML Structure**
   - Create semantic layout
   - Button element with proper accessibility
   - Result card container (hidden initially)
   - History section with grid container

2. **CSS Styling**
   - Import pixel font
   - Set up synthwave color variables
   - Style button with pulsing glow keyframes
   - Create animated starfield background
   - Design result card with slide-in animation
   - Style history gallery grid

3. **Animated Background**
   - CSS or Canvas-based moving pixel stars
   - Subtle parallax effect
   - Performance-optimized

4. **Web Audio Sounds**
   - Create sound generator functions
   - Multiple retro sound variations
   - Random selection on each click

5. **Chrome AI Integration**
   - Detect Prompt API availability
   - Create prompt for weird/wacky ideas
   - Handle streaming response
   - Implement fallback for unsupported browsers

6. **Result Card Animation**
   - Slide-in from bottom or side
   - Fade + scale effect
   - Auto-dismiss or manual close

7. **History Management**
   - Store ideas in array
   - Render cards to gallery
   - Session-based (no persistence)

## Browser Compatibility Notes

- Chrome Built-in AI requires Chrome 127+ with experimental flags enabled
- Fallback ensures site works in all modern browsers
- Web Audio API has broad support

## Future Enhancements (Out of Scope)

- Save favorites to localStorage
- Share to social media
- Category filters for ideas
- Dark/light mode toggle
