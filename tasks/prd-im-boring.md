# PRD: I'm Boring - Boredom Buster Website

## Introduction

"I'm Boring" is a fun, retro-arcade styled website featuring a big red button that generates weird and wacky boredom-busting ideas using AI. When users feel bored, they press the button to receive quirky, unexpected activity suggestions. The site features a synthwave/vaporwave aesthetic with animated pixel backgrounds, retro game sounds, and a playful animated mascot during loading states.

## Goals

- Provide instant, entertaining boredom relief with one button press
- Generate weird and wacky activity suggestions via Chrome's built-in AI
- Create an engaging retro-arcade visual experience
- Work seamlessly on mobile and desktop devices
- Persist idea history across sessions for users to revisit suggestions
- Gracefully fallback to 100+ preset ideas when AI is unavailable

## User Stories

### US-001: Create base HTML structure
**Description:** As a developer, I need the foundational HTML structure so all components have proper containers.

**Acceptance Criteria:**
- [ ] index.html with semantic HTML5 structure
- [ ] Container for the main button
- [ ] Container for the result card (hidden initially)
- [ ] Container for history gallery section
- [ ] Container for loading mascot (hidden initially)
- [ ] Proper meta tags for mobile responsiveness
- [ ] Google Fonts link for "Press Start 2P" pixel font

---

### US-002: Style the synthwave theme and layout
**Description:** As a user, I want a visually striking retro-arcade interface so the experience feels fun and nostalgic.

**Acceptance Criteria:**
- [ ] CSS custom properties for synthwave colors (pink, cyan, purple, dark bg)
- [ ] Dark background with proper contrast
- [ ] Centered layout that works on all screen sizes
- [ ] "Press Start 2P" font applied to headings and button
- [ ] Mobile-first responsive design
- [ ] Verify in browser - colors match synthwave palette

---

### US-003: Create animated pixel star background
**Description:** As a user, I want an animated starfield background so the site feels dynamic and arcade-like.

**Acceptance Criteria:**
- [ ] Multiple layers of animated stars/pixels
- [ ] Stars move or twinkle with CSS animations
- [ ] Performance optimized (no janky scrolling)
- [ ] Background doesn't interfere with content readability
- [ ] Verify in browser - animation runs smoothly

---

### US-004: Build the big red button with pulsing glow
**Description:** As a user, I want a large, attention-grabbing button so I know exactly where to click.

**Acceptance Criteria:**
- [ ] Large red circular/rounded button
- [ ] "I'm Boring" text on the button
- [ ] Continuous pulsing neon glow animation (pink/purple)
- [ ] Hover state with enhanced glow
- [ ] Click/active state with press-down effect
- [ ] Touch-friendly size (min 48px touch target)
- [ ] Verify in browser - glow animation pulses smoothly

---

### US-005: Implement retro game sounds
**Description:** As a user, I want fun 8-bit sounds when pressing the button so the interaction feels rewarding.

**Acceptance Criteria:**
- [ ] Web Audio API sound generation (no external files)
- [ ] At least 5 different retro sound variations
- [ ] Random sound selection on each button press
- [ ] Sound types: coin, power-up, 8-bit bleeps, level-up
- [ ] Sounds are short and punchy (<1 second)
- [ ] Verify in browser - sounds play on button click

---

### US-006: Create animated loading mascot
**Description:** As a user, I want to see a fun animated character while waiting so I know the site is working.

**Acceptance Criteria:**
- [ ] Simple pixel-art style mascot (CSS or inline SVG)
- [ ] Bouncing or dancing animation during loading
- [ ] Mascot appears when AI request starts
- [ ] Mascot hides when idea is ready
- [ ] Works without external image files
- [ ] Verify in browser - mascot animates during loading

---

### US-007: Integrate Chrome Built-in AI (Prompt API)
**Description:** As a user, I want AI-generated weird and wacky suggestions so each idea feels unique and surprising.

**Acceptance Criteria:**
- [ ] Detect if Chrome AI (window.ai) is available
- [ ] Create appropriate prompt for weird/wacky boredom ideas
- [ ] Request generates 2-3 sentence response
- [ ] Handle API errors gracefully
- [ ] Ideas are genuinely quirky and unexpected
- [ ] Verify in browser (Chrome with AI enabled) - generates unique ideas

---

### US-008: Implement fallback idea system
**Description:** As a user on an unsupported browser, I still want fun ideas so the site works everywhere.

**Acceptance Criteria:**
- [ ] Array of 100+ preset weird/wacky ideas
- [ ] Random selection from preset list
- [ ] No duplicate ideas until all are shown
- [ ] Fallback activates automatically when AI unavailable
- [ ] Ideas match the weird/wacky tone
- [ ] Verify in browser (non-Chrome) - fallback ideas display

---

### US-009: Build animated result card
**Description:** As a user, I want to see my idea appear with a fun animation so revealing it feels exciting.

**Acceptance Criteria:**
- [ ] Card slides in from bottom with fade effect
- [ ] Card styled with neon border/glow matching theme
- [ ] Displays the generated idea text
- [ ] Readable font size on all devices
- [ ] Card appears after loading completes
- [ ] Verify in browser - card animates in smoothly

---

### US-010: Implement history gallery
**Description:** As a user, I want to see all my previous ideas so I can revisit ones I liked.

**Acceptance Criteria:**
- [ ] Grid layout below main button
- [ ] Each past idea shown as a smaller card
- [ ] Most recent ideas appear first
- [ ] Cards styled consistently with result card
- [ ] Scrollable on mobile if many ideas
- [ ] Responsive grid (1-3 columns based on screen)
- [ ] Verify in browser - history displays correctly

---

### US-011: Persist history to localStorage
**Description:** As a returning user, I want my previous ideas saved so I don't lose suggestions I liked.

**Acceptance Criteria:**
- [ ] Save ideas array to localStorage on each new idea
- [ ] Load history from localStorage on page load
- [ ] Handle localStorage errors gracefully
- [ ] Limit stored history to reasonable size (e.g., 50 ideas)
- [ ] Verify in browser - ideas persist after page reload

---

### US-012: Add final polish and accessibility
**Description:** As a user, I want the site to be accessible and polished so everyone can enjoy it.

**Acceptance Criteria:**
- [ ] Proper focus states for keyboard navigation
- [ ] ARIA labels on interactive elements
- [ ] Reduced motion support (@media prefers-reduced-motion)
- [ ] Color contrast meets WCAG AA for text
- [ ] Button works with Enter/Space keys
- [ ] Page title and favicon set
- [ ] Verify in browser - tab navigation works

## Functional Requirements

- FR-1: Single HTML page with all content
- FR-2: Big red button triggers idea generation on click
- FR-3: Button displays pulsing neon glow animation continuously
- FR-4: Random retro game sound plays on each button press
- FR-5: Animated mascot displays during AI request
- FR-6: Chrome AI generates weird/wacky 2-3 sentence ideas
- FR-7: Fallback to 100+ preset ideas if AI unavailable
- FR-8: Result appears in animated slide-in card
- FR-9: All ideas stored in history gallery below button
- FR-10: History persists to localStorage across sessions
- FR-11: Responsive design works on mobile and desktop
- FR-12: Animated pixel starfield background

## Non-Goals

- No user accounts or authentication
- No sharing to social media
- No favoriting or categorizing ideas
- No settings or customization options
- No backend server required
- No analytics or tracking
- No multi-language support

## Design Considerations

### Color Palette (Synthwave/Vaporwave)
- Primary Pink: `#ff00ff`, `#ff71ce`
- Cyan Accent: `#00ffff`, `#01cdfe`
- Purple Glow: `#b967ff`, `#8b00ff`
- Dark Background: `#0a0a0a`, `#1a1a2e`

### Typography
- Headings/Button: "Press Start 2P" (Google Fonts)
- Body/Ideas: System sans-serif for readability

### Responsive Breakpoints
- Mobile: < 640px (single column)
- Tablet: 640-1024px (2 column history)
- Desktop: > 1024px (3 column history)

## Technical Considerations

- **No build step**: Vanilla HTML, CSS, JS only
- **No dependencies**: All functionality built-in
- **Web Audio API**: All sounds generated programmatically
- **Chrome AI**: Uses experimental `window.ai` Prompt API
- **localStorage**: Simple JSON storage for history
- **CSS animations**: Hardware-accelerated transforms preferred

## Success Metrics

- Button click to idea display < 3 seconds (with AI)
- Button click to idea display < 100ms (fallback)
- Site loads in < 2 seconds on 3G
- Works on all modern browsers (with graceful degradation)
- Smooth 60fps animations on mid-range devices

## Open Questions

- Should the mascot have a name or personality?
- Should we add a "copy idea" button to cards?
- What should happen if localStorage is full?
