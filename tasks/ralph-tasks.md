# Ralph Tasks: I'm Boring Website

A retro-arcade website with a big red button that generates boredom-busting ideas using Chrome's built-in AI.

---

## Task Dependency Graph

```
P0-1 (HTML Structure)
├── P0-2 (Synthwave Theme CSS)
│   ├── P0-3 (Animated Starfield)
│   └── P0-4 (Button Styling)
│       └── P0-5 (Retro Sounds)
│           └── P0-6 (Loading Mascot)
│               └── P0-7 (Chrome AI Integration)
│                   └── P0-8 (Fallback Ideas)
│                       └── P0-9 (Result Card)
│                           └── P0-10 (History Gallery)
│                               └── P0-11 (LocalStorage Persistence)
│                                   └── P0-12 (Polish & Accessibility)
```

---

## Tasks

### P0-1: Create Base HTML Structure

Set up the foundational HTML file with all required containers and meta tags.

**What to do:**
- Create index.html with HTML5 doctype and semantic structure
- Add viewport meta tag for mobile responsiveness
- Link Google Fonts "Press Start 2P" pixel font
- Create main container with centered layout
- Add button container with the big red button element
- Add hidden container for result card
- Add hidden container for loading mascot
- Add section for history gallery
- Set page title to "I'm Boring"

**Files to create:**
- index.html

**Acceptance criteria:**
- index.html opens in browser without errors
- All containers exist with appropriate IDs/classes
- Google Fonts link is present
- Viewport meta tag enables responsive scaling
- Button element has "I'm Boring" text
- Verify in browser - page structure is visible

**Depends on:** Nothing

---

### P0-2: Style Synthwave Theme and Layout

Create the base CSS with synthwave color palette and responsive layout.

**What to do:**
- Create style.css and link it in index.html
- Define CSS custom properties for all synthwave colors
- Set dark gradient background on body
- Apply "Press Start 2P" font to headings and button
- Create centered flexbox layout for main content
- Add mobile-first responsive styles
- Style the page title/header

**Files to create:**
- style.css

**Files to modify:**
- index.html (add stylesheet link)

**Acceptance criteria:**
- CSS custom properties defined: --neon-pink, --cyan, --purple, --dark-bg
- Background is dark gradient (#0a0a0a to #1a1a2e)
- Content is centered horizontally and vertically
- "Press Start 2P" font loads and displays
- Layout works on mobile (320px) and desktop (1200px)
- Verify in browser - synthwave colors visible, centered layout works

**Depends on:** P0-1

---

### P0-3: Create Animated Pixel Starfield Background

Add an animated starfield effect behind all content.

**What to do:**
- Create CSS-based animated stars using pseudo-elements or multiple box-shadows
- Implement 2-3 layers of stars at different sizes/speeds for parallax effect
- Use CSS animations for twinkling or drifting movement
- Ensure stars don't interfere with content readability (low opacity/behind content)
- Use hardware-accelerated properties (transform, opacity)

**Files to modify:**
- style.css

**Acceptance criteria:**
- Multiple layers of animated stars visible
- Stars twinkle or drift smoothly
- Animation runs at 60fps without jank
- Stars are behind main content (z-index)
- Content remains readable
- Verify in browser - starfield animates smoothly

**Depends on:** P0-2

---

### P0-4: Build Big Red Button with Pulsing Glow

Style the main button with retro arcade aesthetics and pulsing neon glow animation.

**What to do:**
- Style button as large red circle/rounded rectangle
- Add continuous pulsing box-shadow glow animation (pink/purple neon)
- Create hover state with enhanced glow
- Create active/pressed state with inward press effect
- Ensure minimum 48px touch target for mobile
- Use CSS @keyframes for smooth pulse animation
- Add cursor pointer and remove default button styles

**Files to modify:**
- style.css

**Acceptance criteria:**
- Button is large, red, and prominent
- Glow pulses continuously with smooth animation
- Hover increases glow intensity
- Click shows press-down feedback
- Button is at least 48px in smallest dimension
- Verify in browser - glow animation pulses, hover/active states work

**Depends on:** P0-2

---

### P0-5: Implement Retro Game Sounds

Create Web Audio API sound generator for retro 8-bit sound effects.

**What to do:**
- Create script.js and link it in index.html
- Initialize AudioContext on first user interaction
- Create sound generator functions for different retro sounds:
  - Coin/pickup sound (short rising chirp)
  - Power-up sound (ascending arpeggio)
  - 8-bit bleep (short square wave)
  - Level-up fanfare (quick melody)
  - Bonus sound (descending sweep)
- Create function to play random sound from collection
- Hook up button click to play random sound

**Files to create:**
- script.js

**Files to modify:**
- index.html (add script link)

**Acceptance criteria:**
- At least 5 different retro sound variations
- Each sound is short (<1 second)
- Random sound plays on each button click
- No errors when AudioContext is created
- Sounds have 8-bit/chiptune character
- Verify in browser - clicking button plays different retro sounds

**Depends on:** P0-4

---

### P0-6: Create Animated Loading Mascot

Build a simple pixel-art style animated mascot that displays during loading.

**What to do:**
- Create CSS-based pixel mascot (simple character using box-shadows or div grid)
- Alternative: Create simple SVG mascot inline
- Add bouncing or dancing CSS animation
- Create JavaScript functions to show/hide mascot
- Mascot should be centered and prominent when visible
- Keep mascot hidden by default

**Files to modify:**
- index.html (add mascot container with pixel art)
- style.css (add mascot styles and animation)
- script.js (add show/hide mascot functions)

**Acceptance criteria:**
- Mascot is pixel-art style (blocky/retro look)
- Bouncing or dancing animation loops smoothly
- showMascot() function displays the mascot
- hideMascot() function hides it
- Mascot is hidden on page load
- Verify in browser - mascot appears and animates when triggered

**Depends on:** P0-5

---

### P0-7: Integrate Chrome Built-in AI

Connect to Chrome's experimental Prompt API for generating weird/wacky ideas.

**What to do:**
- Detect if Chrome AI is available (window.ai or ai.languageModel)
- Create async function to generate idea using Prompt API
- Craft prompt requesting weird, wacky, quirky boredom-busting activity
- Request 2-3 sentence response length
- Handle API errors gracefully
- Create isAIAvailable() check function
- Show mascot during generation, hide when complete

**Files to modify:**
- script.js

**Acceptance criteria:**
- isAIAvailable() returns true when Chrome AI present
- generateIdea() calls Chrome AI with appropriate prompt
- Response is 2-3 sentences of weird/wacky suggestion
- Errors are caught and handled (don't crash)
- Mascot shows during generation
- Verify in browser (Chrome with AI) - generates unique ideas on button click

**Depends on:** P0-6

---

### P0-8: Implement Fallback Idea System

Create comprehensive fallback with 100+ preset weird/wacky ideas.

**What to do:**
- Create array of 100+ weird, wacky, quirky boredom-busting ideas
- Each idea should be 2-3 sentences
- Ideas should match tone: absurd, unexpected, playful
- Implement shuffle algorithm to avoid repeats until all shown
- Track which ideas have been shown
- Modify generateIdea() to use fallback when AI unavailable
- Reset shown tracking when all ideas exhausted

**Files to modify:**
- script.js

**Acceptance criteria:**
- At least 100 preset ideas in array
- Ideas are genuinely weird/wacky/quirky in tone
- No duplicate ideas until all 100+ are shown
- Fallback activates when Chrome AI unavailable
- Each idea is 2-3 sentences
- Verify in browser (non-Chrome) - fallback ideas display correctly

**Depends on:** P0-7

---

### P0-9: Build Animated Result Card

Create the animated card component that displays generated ideas.

**What to do:**
- Add result card HTML structure (container, text area)
- Style card with neon border/glow matching theme
- Create slide-in animation from bottom with fade
- Ensure readable font size on all devices
- Create showResult(text) function to display idea with animation
- Card should be hidden initially
- Add appropriate padding and max-width for readability

**Files to modify:**
- index.html (add result card structure)
- style.css (add card styles and animation)
- script.js (add showResult function, integrate with generateIdea)

**Acceptance criteria:**
- Card has neon glow border matching theme
- Slide-in animation from bottom is smooth
- Text is readable on mobile and desktop
- showResult(text) displays the idea in the card
- Card hidden until idea generated
- Verify in browser - card animates in smoothly with idea text

**Depends on:** P0-8

---

### P0-10: Implement History Gallery

Create the grid layout for displaying all previous ideas.

**What to do:**
- Add history section HTML structure below main content
- Style responsive grid (1 col mobile, 2 col tablet, 3 col desktop)
- Create smaller card style for history items
- Create addToHistory(text) function to add idea to gallery
- Most recent ideas should appear first
- Make gallery scrollable if many items
- Apply consistent styling with result card

**Files to modify:**
- index.html (add history section structure)
- style.css (add history grid and card styles)
- script.js (add addToHistory function, call after each idea)

**Acceptance criteria:**
- Grid shows 1 column on mobile, 2 on tablet, 3 on desktop
- Each history card matches theme styling
- Most recent idea appears first in gallery
- addToHistory(text) creates and inserts card
- Gallery scrolls if content exceeds viewport
- Verify in browser - multiple ideas create proper grid layout

**Depends on:** P0-9

---

### P0-11: Persist History to localStorage

Save and restore idea history across browser sessions.

**What to do:**
- Create saveHistory() function to persist ideas array to localStorage
- Create loadHistory() function to restore from localStorage on page load
- Call saveHistory() after each new idea
- Call loadHistory() on DOMContentLoaded
- Render loaded history to gallery on page load
- Limit stored history to 50 most recent ideas
- Handle localStorage errors gracefully (quota, disabled)

**Files to modify:**
- script.js

**Acceptance criteria:**
- Ideas persist after page reload
- loadHistory() restores previous session's ideas
- saveHistory() runs after each new idea
- Maximum 50 ideas stored (oldest removed)
- No errors if localStorage unavailable
- Verify in browser - ideas survive page reload

**Depends on:** P0-10

---

### P0-12: Add Final Polish and Accessibility

Ensure the site is accessible, performant, and polished.

**What to do:**
- Add proper focus states for keyboard navigation
- Add ARIA labels to button and interactive elements
- Implement @media (prefers-reduced-motion) to disable animations
- Verify color contrast meets WCAG AA
- Ensure button works with Enter and Space keys
- Add a simple favicon (data URI or emoji)
- Add smooth transitions where missing
- Test and fix any remaining issues

**Files to modify:**
- index.html (favicon, ARIA labels)
- style.css (focus states, reduced motion, contrast fixes)
- script.js (keyboard event handling if needed)

**Acceptance criteria:**
- Tab navigation works through all interactive elements
- Focus states are clearly visible
- ARIA labels present on button and cards
- Animations disabled when prefers-reduced-motion set
- Button activates with Enter and Space keys
- Favicon displays in browser tab
- Verify in browser - keyboard navigation works, accessible

**Depends on:** P0-11

---
