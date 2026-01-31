/**
 * I'm Boring - Retro Game Sounds, Loading Mascot & Chrome AI
 * Web Audio API sound generator for 8-bit chiptune effects
 * Plus loading mascot show/hide and Chrome Built-in AI integration
 */

// Audio context - initialized on first user interaction
let audioContext = null;

// Loading container element reference
let loadingContainer = null;

// Result container element reference
let resultContainer = null;
let resultText = null;

// Chrome AI session reference
let aiSession = null;

// Flag to prevent multiple simultaneous requests
let isGenerating = false;

/**
 * Initialize the AudioContext on first user interaction
 * (Required by browsers to prevent autoplay)
 */
function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    // Resume if suspended (can happen on some browsers)
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    return audioContext;
}

/**
 * Create an oscillator with square wave for that classic 8-bit sound
 */
function createSquareOscillator(ctx, frequency) {
    const osc = ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    return osc;
}

/**
 * Create a gain node for volume envelope
 */
function createGain(ctx, initialGain = 0.3) {
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(initialGain, ctx.currentTime);
    return gain;
}

/**
 * Sound 1: Coin/Pickup Sound
 * Short rising chirp - classic coin collect sound
 * Duration: ~0.15s
 */
function playCoinSound() {
    const ctx = initAudio();
    const osc = createSquareOscillator(ctx, 987.77); // B5
    const gain = createGain(ctx, 0.3);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    const now = ctx.currentTime;
    
    // Quick pitch rise
    osc.frequency.setValueAtTime(987.77, now); // B5
    osc.frequency.setValueAtTime(1318.51, now + 0.075); // E6
    
    // Quick fade out
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    
    osc.start(now);
    osc.stop(now + 0.15);
}

/**
 * Sound 2: Power-Up Sound
 * Ascending arpeggio - classic power-up jingle
 * Duration: ~0.4s
 */
function playPowerUpSound() {
    const ctx = initAudio();
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25]; // C4, E4, G4, C5, E5
    const noteDuration = 0.08;
    
    notes.forEach((freq, i) => {
        const osc = createSquareOscillator(ctx, freq);
        const gain = createGain(ctx, 0.25);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        const startTime = ctx.currentTime + (i * noteDuration);
        
        gain.gain.setValueAtTime(0.25, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + noteDuration);
        
        osc.start(startTime);
        osc.stop(startTime + noteDuration);
    });
}

/**
 * Sound 3: 8-bit Bleep
 * Short square wave beep - simple confirmation sound
 * Duration: ~0.1s
 */
function playBleepSound() {
    const ctx = initAudio();
    const osc = createSquareOscillator(ctx, 880); // A5
    const gain = createGain(ctx, 0.25);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    const now = ctx.currentTime;
    
    // Simple beep with quick decay
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    
    osc.start(now);
    osc.stop(now + 0.1);
}

/**
 * Sound 4: Level-Up Fanfare
 * Quick triumphant melody - celebration sound
 * Duration: ~0.5s
 */
function playLevelUpSound() {
    const ctx = initAudio();
    // C major arpeggio with octave jump
    const melody = [
        { freq: 523.25, time: 0, duration: 0.1 },      // C5
        { freq: 659.25, time: 0.1, duration: 0.1 },    // E5
        { freq: 783.99, time: 0.2, duration: 0.1 },    // G5
        { freq: 1046.50, time: 0.3, duration: 0.2 },   // C6 (hold longer)
    ];
    
    melody.forEach(note => {
        const osc = createSquareOscillator(ctx, note.freq);
        const gain = createGain(ctx, 0.25);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        const startTime = ctx.currentTime + note.time;
        
        gain.gain.setValueAtTime(0.25, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + note.duration);
        
        osc.start(startTime);
        osc.stop(startTime + note.duration);
    });
}

/**
 * Sound 5: Bonus Sound
 * Descending sweep - wobbly bonus effect
 * Duration: ~0.3s
 */
function playBonusSound() {
    const ctx = initAudio();
    const osc = createSquareOscillator(ctx, 1200);
    const gain = createGain(ctx, 0.3);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    const now = ctx.currentTime;
    
    // Descending pitch sweep
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.3);
    
    // Volume envelope
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    
    osc.start(now);
    osc.stop(now + 0.3);
}

/**
 * Sound 6: Zap Sound
 * Quick high-to-low zap - laser/select sound
 * Duration: ~0.15s
 */
function playZapSound() {
    const ctx = initAudio();
    const osc = createSquareOscillator(ctx, 1500);
    const gain = createGain(ctx, 0.2);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    const now = ctx.currentTime;
    
    // Quick descending zap
    osc.frequency.setValueAtTime(1500, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.15);
    
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    
    osc.start(now);
    osc.stop(now + 0.15);
}

/**
 * Sound 7: Warp Sound
 * Rising wobble - teleport/warp effect
 * Duration: ~0.25s
 */
function playWarpSound() {
    const ctx = initAudio();
    const osc = createSquareOscillator(ctx, 100);
    const gain = createGain(ctx, 0.25);
    
    // Add vibrato with LFO
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(30, ctx.currentTime);
    lfoGain.gain.setValueAtTime(50, ctx.currentTime);
    
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    const now = ctx.currentTime;
    
    // Rising pitch with wobble
    osc.frequency.setValueAtTime(100, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.25);
    
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
    
    lfo.start(now);
    osc.start(now);
    lfo.stop(now + 0.25);
    osc.stop(now + 0.25);
}

// Collection of all sound functions
const retroSounds = [
    playCoinSound,
    playPowerUpSound,
    playBleepSound,
    playLevelUpSound,
    playBonusSound,
    playZapSound,
    playWarpSound
];

/**
 * Play a random retro sound from the collection
 */
function playRandomSound() {
    const randomIndex = Math.floor(Math.random() * retroSounds.length);
    retroSounds[randomIndex]();
}

/* ========================
   Loading Mascot Functions
   ======================== */

/**
 * Show the loading mascot
 * Displays the animated pixel mascot in the loading container
 */
function showMascot() {
    if (!loadingContainer) {
        loadingContainer = document.getElementById('loading-container');
    }
    if (loadingContainer) {
        loadingContainer.classList.remove('hidden');
    }
}

/**
 * Hide the loading mascot
 * Hides the loading container with the mascot
 */
function hideMascot() {
    if (!loadingContainer) {
        loadingContainer = document.getElementById('loading-container');
    }
    if (loadingContainer) {
        loadingContainer.classList.add('hidden');
    }
}

/* ========================
   Result Display Functions
   ======================== */

// History gallery element reference
let historyGallery = null;

/**
 * Show the result container with the generated idea
 * Displays the idea with a smooth slide-in animation from bottom
 * @param {string} idea - The idea text to display
 */
function showResult(idea) {
    if (!resultContainer) {
        resultContainer = document.getElementById('result-container');
    }
    if (!resultText) {
        resultText = document.getElementById('result-text');
    }
    if (resultContainer && resultText) {
        resultText.textContent = idea;
        // Remove hidden class first to make element visible but transparent
        resultContainer.classList.remove('hidden');
        // Force a reflow to ensure the initial state is rendered
        // before adding the visible class for animation
        resultContainer.offsetHeight;
        // Add visible class to trigger slide-in animation
        resultContainer.classList.add('visible');
    }
}

/**
 * Hide the result container with fade-out animation
 */
function hideResult() {
    if (!resultContainer) {
        resultContainer = document.getElementById('result-container');
    }
    if (resultContainer) {
        // Remove visible class to trigger fade-out
        resultContainer.classList.remove('visible');
        // Add hidden class after animation completes
        // Use a shorter delay since we want it hidden during loading
        setTimeout(() => {
            if (!resultContainer.classList.contains('visible')) {
                resultContainer.classList.add('hidden');
            }
        }, 400); // Match the CSS transition duration
    }
}

/* ========================
   History Gallery Functions
   ======================== */

/* ========================
   History Persistence (localStorage)
   ======================== */

// localStorage key for history
const HISTORY_STORAGE_KEY = 'im-boring-history';

// Maximum number of ideas to store
const MAX_HISTORY_SIZE = 50;

// In-memory history array
let ideasHistory = [];

/**
 * Save history to localStorage
 * Limits to MAX_HISTORY_SIZE most recent ideas
 * Handles errors gracefully (quota exceeded, localStorage disabled)
 */
function saveHistory() {
    try {
        // Limit to MAX_HISTORY_SIZE most recent ideas
        const historyToSave = ideasHistory.slice(0, MAX_HISTORY_SIZE);
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(historyToSave));
    } catch (error) {
        // Handle quota exceeded or localStorage disabled
        console.warn('Could not save history to localStorage:', error.message);
    }
}

/**
 * Load history from localStorage
 * Returns array of ideas or empty array if none found
 * Handles errors gracefully (localStorage disabled, invalid JSON)
 * @returns {string[]} Array of idea strings
 */
function loadHistory() {
    try {
        const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            // Validate it's an array
            if (Array.isArray(parsed)) {
                ideasHistory = parsed.slice(0, MAX_HISTORY_SIZE);
                return ideasHistory;
            }
        }
    } catch (error) {
        // Handle localStorage disabled or corrupted data
        console.warn('Could not load history from localStorage:', error.message);
    }
    ideasHistory = [];
    return [];
}

/**
 * Render loaded history to the gallery
 * Called on page load to restore previous session's ideas
 */
function renderHistory() {
    const history = loadHistory();
    // Render in reverse order so newest appears first
    // (history is stored newest-first, so we iterate normally)
    history.forEach((idea) => {
        addToHistory(idea, false); // false = don't save again
    });
}

/**
 * Add an idea to the history gallery
 * Creates a new card and inserts it at the beginning (most recent first)
 * @param {string} text - The idea text to add to history
 * @param {boolean} shouldSave - Whether to save to localStorage (default: true)
 */
function addToHistory(text, shouldSave = true) {
    if (!historyGallery) {
        historyGallery = document.getElementById('history-gallery');
    }
    if (!historyGallery || !text) {
        return;
    }
    
    // Add to in-memory history array (newest first)
    if (shouldSave) {
        ideasHistory.unshift(text);
        // Limit to MAX_HISTORY_SIZE
        if (ideasHistory.length > MAX_HISTORY_SIZE) {
            ideasHistory = ideasHistory.slice(0, MAX_HISTORY_SIZE);
        }
        // Persist to localStorage
        saveHistory();
    }
    
    // Create the history card element
    const card = document.createElement('div');
    card.className = 'history-card';
    card.setAttribute('role', 'listitem');
    
    // Create the text paragraph
    const textElement = document.createElement('p');
    textElement.className = 'history-card-text';
    textElement.textContent = text;
    
    // Assemble the card
    card.appendChild(textElement);
    
    // Insert at the beginning (most recent first)
    historyGallery.insertBefore(card, historyGallery.firstChild);
}

/* ========================
   Fallback Ideas System
   ======================== */

/**
 * Array of 100+ weird, wacky, quirky boredom-busting ideas
 * Used when Chrome AI is not available
 */
const FALLBACK_IDEAS = [
    "Stage a dramatic soap opera with your houseplants as the cast. Give them names, backstories, and at least one scandalous love triangle. Bonus points if you do different voices for each plant.",
    
    "Create a museum exhibit of the most boring items in your home. Write pretentious art descriptions for each piece like 'This paperclip represents the existential weight of modern office culture.'",
    
    "Become a nature documentary narrator for your pets. Follow them around in a hushed British accent describing their every mundane action as if it were a survival mission in the wild.",
    
    "Host a fashion show featuring outfits made entirely from things in your kitchen. Strut down your hallway runway wearing a garbage bag gown and colander hat. Work it!",
    
    "Write a strongly-worded complaint letter to gravity for all the times it has wronged you. List specific incidents like dropped phones and stubbed toes. Demand compensation.",
    
    "Practice your Oscar acceptance speech in the mirror using increasingly ridiculous categories. Start with Best Actor and work your way to 'Best Performance While Making a Sandwich.'",
    
    "Create an elaborate trap for your future self to find later. Hide cryptic notes, draw fake treasure maps, and leave yourself utterly confused in three months.",
    
    "Interview your reflection as if they're a celebrity. Ask hard-hitting questions about their skincare routine and their controversial stance on whether water is wet.",
    
    "Start a one-person flash mob in your living room. Choose the most dramatic song you can find and commit fully to the choreography, even if you're making it up as you go.",
    
    "Write a epic poem about the last meal you ate. Use grandiose language like 'And lo, the humble sandwich didst satisfy mine hunger most righteously.'",
    
    "Reorganize your bookshelf by color, then by how much you think each book weighs without actually weighing them. Trust your instincts. They're probably wrong.",
    
    "Create a secret handshake with yourself involving at least seven distinct moves. Practice until you can do it smoothly, then never tell anyone about it.",
    
    "Host a TED Talk for an audience of stuffed animals or objects. Present on a topic you know absolutely nothing about and present it with unearned confidence.",
    
    "Draw a detailed map of an imaginary country, complete with bizarre landmarks like 'The Valley of Lost Socks' and 'Mount Never-Reply-To-Emails.'",
    
    "Learn to say 'Where is the bathroom?' in the most obscure languages you can find. Prepare for a very specific type of international emergency.",
    
    "Compose a theme song for yourself and hum it dramatically every time you enter a room. Gradually increase the production value over the day.",
    
    "Build a tiny fort and pretend you're a giant. Carefully interact with tiny furniture. Have tiny snacks. Live your best giant life.",
    
    "Create a fake radio show where you're the host, caller, and musical guest. Interview yourself with hard-hitting questions about your breakfast choices.",
    
    "Design a new flag for your bedroom. Write a constitution for your personal territory. Declare independence from the living room.",
    
    "Practice walking in slow motion like you're in an action movie. Add your own explosion sound effects. Duck for cover behind the couch.",
    
    "Write a negative Yelp review for a place in your imagination. Rate the service at the 'Restaurant at the End of Your Hallway.' Two stars, the ambiance was lacking.",
    
    "Create a new holiday and fully celebrate it right now. Write traditions, sing songs you invent on the spot, and eat ceremonial snacks.",
    
    "Pretend you're a time traveler from the past discovering modern objects for the first time. Document your amazement at the magic glowing rectangle (your phone).",
    
    "Stack everything stackable in your home into one precarious tower. Name it. Take a photo for posterity. Accept that it will fall.",
    
    "Write a villain origin story for your most annoying household appliance. That printer didn't choose evil, evil chose it.",
    
    "Host a cooking show where you narrate making the simplest possible meal with maximum dramatic flair. 'Today, we dare to boil... water.'",
    
    "Create personas for your fingers and put on a tiny finger puppet show. Give each finger a distinct personality and tragic backstory.",
    
    "Redecorate a single room using only items from other rooms. Don't question why there's now a toilet brush in the living room. It's called art.",
    
    "Make up a conspiracy theory about something mundane like staplers or clouds. Create an evidence board with string connecting random things.",
    
    "Teach an invisible audience how to do something you're not actually good at. Confidence is key. You're the expert now.",
    
    "Create a fake podcast episode where you interview an imaginary celebrity about their imaginary new project. Really dig deep into those fictional details.",
    
    "Practice your evil laugh until it's truly unsettling. Try variations: maniacal, diabolical, and the 'just stole the last cookie' chuckle.",
    
    "Write fan mail to an inanimate object that has served you well. Thank your favorite mug for years of loyal beverage containment.",
    
    "Create an interpretive dance representing your WiFi connection's journey through peaks and outages. Feel the buffering.",
    
    "Design new constellations in the textured patterns on your ceiling. Name them things like 'The Great Procrastinator' and 'Slightly Concerned Dog.'",
    
    "Rehearse different ways to say 'hello' and 'goodbye' using only your eyebrows. Become a master of the eyebrow greeting.",
    
    "Write a breakup letter to a bad habit you want to quit. Be dramatic about it. 'It's not me, it's you, late-night snacking.'",
    
    "Create a new sport using only items within arm's reach. Write comprehensive rules. Declare yourself champion.",
    
    "Practice accepting imaginary awards with increasing levels of surprise, from 'mild delight' to 'full ugly crying.'",
    
    "Host an auction for yourself where you bid on imaginary experiences. 'Do I hear fifty imagination dollars for a nap?'",
    
    "Write a haiku about each room in your home, capturing its true essence. 'Bathroom: porcelain throne, steam rises like morning dreams, toilet paper low.'",
    
    "Create a scavenger hunt for yourself that you'll forget about. Future you will be either confused or delighted.",
    
    "Practice your 'I totally knew that already' face in the mirror. Perfect the knowing nod. Master the thoughtful 'mmhmm.'",
    
    "Write a formal apology letter to someone you wronged in a dream. Be specific about the dream crimes you committed.",
    
    "Choreograph a fight scene with yourself using only dramatic poses and slow motion. Film it. Never show anyone.",
    
    "Create a fake language and write a translation dictionary. Teach it to no one. Keep the knowledge to yourself.",
    
    "Fold all your clothes in a completely new way and pretend it's a revolutionary technique you invented. Name it after yourself.",
    
    "Rate your household items like a snobby critic. 'This fork has potential, but lacks the sophistication of a true utensil.'",
    
    "Write the beginning of a novel you'll never finish. Make the first sentence ridiculously dramatic and then just stop.",
    
    "Practice greeting yourself in the mirror as if you're meeting a long-lost twin. Make it emotional. Embrace yourself.",
    
    "Create a newspaper headline for the most mundane thing that happened today. 'LOCAL PERSON FINDS MATCHING SOCKS: EXPERTS BAFFLED.'",
    
    "Build a tiny obstacle course for a small object and cheer it on as it 'competes.' The marble is a champion athlete.",
    
    "Write a review of your own life so far, three and a half stars. 'Promising early seasons but the plot got weird around season 25.'",
    
    "Create a fancy restaurant menu for the leftovers in your fridge. 'Deconstructed yesterday's pasta with artisanal cold sauce.'",
    
    "Practice your royal wave until it's elegant and restrained. Wave at passing cars from your window like visiting royalty.",
    
    "Write a motivational speech for your houseplants about photosynthesis. Really believe in their ability to convert sunlight.",
    
    "Create a detailed schedule for doing absolutely nothing. Block out time for staring at walls. Pencil in some sighing.",
    
    "Invent a new word and use it casually in conversation until someone asks what it means. Explain it like it's obvious.",
    
    "Design a logo for yourself as if you were a brand. What's your tagline? 'Adequate since birth' works fine.",
    
    "Create a time capsule of today's garbage. Future archaeologists will be fascinated by these snack wrappers.",
    
    "Practice walking into rooms with different energies: confident, mysterious, concerned, or like you forgot why you're there.",
    
    "Write a stern letter to yourself from your pet's perspective about all the ways you've disappointed them.",
    
    "Create a podcast where you review different spots to sit in your home. 'The couch cushion review, episode 47.'",
    
    "Organize your junk drawer by emotional significance. That random battery? Very meaningful. Keep it forever.",
    
    "Practice signing autographs for when you inevitably become famous for something weird.",
    
    "Create a voicemail greeting for each room in your house as if they're different offices in a bizarre corporation.",
    
    "Attempt to communicate with your reflection using only blinks. Develop a blink-based morse code. Blink twice for snacks.",
    
    "Write a strongly-worded open letter to future you about the state of the apartment. Demand improvement.",
    
    "Create a nature documentary about the dust bunnies under your bed. Their society is complex and fascinating.",
    
    "Practice your 'I'm totally listening' face while daydreaming about absolutely anything else.",
    
    "Build an elaborate backstory for the person who owned your home before you. They were definitely interesting.",
    
    "Create award categories for your days of the week. Tuesday is up for 'Most Underappreciated.' Wednesday is robbed.",
    
    "Practice ninja moves in slow motion while maintaining direct eye contact with an object. Establish dominance.",
    
    "Write detailed instructions for something simple as if for an alien. 'First, locate the bread. It fears you.'",
    
    "Rate your dreams from the past week like a film critic. 'The one with the talking fish showed real promise.'",
    
    "Create a fake product infomercial for something you already own. Act out the 'before' struggle dramatically.",
    
    "Practice entering rooms like different movie genres: horror, romance, action, or indie film where nothing happens.",
    
    "Write a thank you note to past you for a decision that worked out well. Acknowledge your own wisdom.",
    
    "Create an absurd exercise routine using only movements you invent on the spot. The 'confused flamingo' is core work.",
    
    "Host a poetry slam in your bathroom. The acoustics are excellent and the audience is captive.",
    
    "Design a board game about your daily routine. Add drama with cards like 'WiFi dies' and 'surprise nap attack.'",
    
    "Practice your 'just casually noticed something interesting' look for when you need to avoid awkward conversations.",
    
    "Create a documentary-style opening narration for your own day. 'In a world... where the alarm didn't go off...'",
    
    "Write a contract between yourself and your bed about appropriate napping hours. Both parties must sign.",
    
    "Arrange your snacks by how betrayed you'd feel if they disappeared. Create a snack betrayal hierarchy.",
    
    "Practice juggling with increasingly inappropriate items. Start with socks, graduate to more ambitious choices.",
    
    "Create a secret society with one member: you. Design handshakes, symbols, and mysterious rituals.",
    
    "Write a formal complaint to your brain about intrusive thoughts. Demand a refund on that cringy memory from 2015.",
    
    "Build a pillow fort and establish it as an independent nation. Create a flag and declare snack time a national holiday.",
    
    "Practice walking in completely straight lines as if there's a balance beam only you can see.",
    
    "Create a workout routine based entirely on avoiding responsibilities. Procrastination is cardio.",
    
    "Write an epic quest narrative about finding your phone charger. The hero's journey, but for charging cables.",
    
    "Rate clouds by how much they look like things. Today's cloud gets a 7/10, solid dinosaur vibes.",
    
    "Create a ranking system for your thoughts and only allow premium thoughts after 6 PM.",
    
    "Practice your 'I'm having a completely normal day' face in the mirror. Really sell the normalcy.",
    
    "Write a cease and desist letter to your alarm clock for repeated disturbances of peace.",
    
    "Create elaborate theories about where all your missing socks have gone. The sock dimension is real.",
    
    "Host a debate with yourself about a topic you have no opinion on. Argue both sides passionately.",
    
    "Practice your dramatic reveal face for when you eventually share a mildly interesting fact.",
    
    "Create a rating system for shadows in your home. That one in the corner is particularly moody.",
    
    "Write a resignation letter from being an adult for the day. Effective immediately.",
    
    "Design a superhero alter ego based entirely on your most useless skill. 'The Procrastinator' saves the day... eventually.",
    
    "Host a press conference about the breaking news of what you had for lunch. Take no questions.",
    
    "Create a training montage sequence for getting off the couch. Include dramatic music in your head.",
    
    "Practice saying 'no' in a mirror until it sounds natural. You're still going to say yes to things.",
    
    "Write a letter of recommendation for your favorite snack to get a job at other people's houses.",
    
    "Create an interpretive dance about your WiFi signal. Really capture the intermittent connection.",
    
    "Develop a rating scale for naps from 'power nap' to 'accidentally slept through dinner.'",
    
    "Write a peace treaty between yourself and mornings. Negotiate reasonable wake-up terms.",
    
    "Create a fake true crime documentary about who keeps leaving the lights on in your house.",
    
    "Practice your 'sophisticated person enjoying art' look while staring at random wall textures."
];

// Tracking for shown ideas to avoid repeats
let shownIdeaIndices = [];
let shuffledIndices = [];

/**
 * Fisher-Yates shuffle algorithm to randomize array
 * @param {Array} array - Array to shuffle
 * @returns {Array} New shuffled array
 */
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Get the next fallback idea without repeating until all shown
 * @returns {string} A random fallback idea
 */
function getNextFallbackIdea() {
    // If we've shown all ideas or haven't started, reshuffle
    if (shuffledIndices.length === 0) {
        // Create array of indices [0, 1, 2, ..., n-1]
        const indices = FALLBACK_IDEAS.map((_, i) => i);
        shuffledIndices = shuffleArray(indices);
        shownIdeaIndices = [];
    }
    
    // Get the next index from shuffled array
    const nextIndex = shuffledIndices.pop();
    shownIdeaIndices.push(nextIndex);
    
    return FALLBACK_IDEAS[nextIndex];
}

/* ========================
   Chrome Built-in AI
   ======================== */

/**
 * Check if Chrome Built-in AI (Prompt API) is available
 * Checks for both the new ai.languageModel API and legacy window.ai
 * @returns {boolean} True if Chrome AI is available
 */
function isAIAvailable() {
    // Check for the new Chrome AI API (ai.languageModel)
    if (typeof self !== 'undefined' && self.ai && self.ai.languageModel) {
        return true;
    }
    // Check for legacy window.ai API
    if (typeof window !== 'undefined' && window.ai && window.ai.languageModel) {
        return true;
    }
    return false;
}

/**
 * Get the AI language model API reference
 * @returns {object|null} The languageModel API or null if not available
 */
function getAILanguageModel() {
    if (typeof self !== 'undefined' && self.ai && self.ai.languageModel) {
        return self.ai.languageModel;
    }
    if (typeof window !== 'undefined' && window.ai && window.ai.languageModel) {
        return window.ai.languageModel;
    }
    return null;
}

/**
 * The prompt for generating weird/wacky boredom-busting ideas
 */
const IDEA_PROMPT = `You are a quirky, creative assistant that suggests weird and wacky boredom-busting activities. 
Generate ONE unique, unusual, and fun activity idea that someone could do right now to cure their boredom.
The activity should be:
- Weird, quirky, or unconventional (not typical suggestions like "read a book")
- Safe and legal
- Doable with common household items or no items at all
- Fun and entertaining

Respond with ONLY the activity suggestion in 2-3 sentences. Be playful and creative! No preamble, no explanations, just the weird activity idea.`;

/**
 * Generate a boredom-busting idea using Chrome Built-in AI
 * Falls back to preset ideas if AI is unavailable
 * @returns {Promise<string>} The generated idea
 */
async function generateIdea() {
    // Check if already generating
    if (isGenerating) {
        return null;
    }
    
    isGenerating = true;
    showMascot();
    hideResult();
    
    try {
        const languageModel = getAILanguageModel();
        
        if (!languageModel) {
            // AI not available, use fallback
            return getNextFallbackIdea();
        }
        
        // Create a session if we don't have one, or use existing
        if (!aiSession) {
            aiSession = await languageModel.create({
                systemPrompt: IDEA_PROMPT
            });
        }
        
        // Generate the idea with a simple prompt
        const response = await aiSession.prompt('Give me a weird boredom-busting activity!');
        
        return response;
    } catch (error) {
        console.error('Chrome AI error:', error);
        // AI failed, use fallback instead
        return getNextFallbackIdea();
    } finally {
        hideMascot();
        isGenerating = false;
    }
}

/**
 * Handle the main button click - generate and display an idea
 */
async function handleBoringButtonClick() {
    // Play a sound on click
    playRandomSound();
    
    // Generate idea (uses AI or fallback automatically)
    const idea = await generateIdea();
    
    if (idea) {
        // Success - show the idea
        showResult(idea);
        // Add to history gallery
        addToHistory(idea);
        // Play a success sound
        playLevelUpSound();
    }
}

// DOM Ready - Set up button click handler and load history
document.addEventListener('DOMContentLoaded', () => {
    const boringButton = document.getElementById('boring-button');
    
    if (boringButton) {
        // Click handler for mouse/touch
        boringButton.addEventListener('click', handleBoringButtonClick);
        
        // Keyboard handler for accessibility (Enter and Space keys)
        // Note: Native buttons already support Enter/Space, but this ensures
        // consistent behavior and allows for additional accessibility features
        boringButton.addEventListener('keydown', (event) => {
            // Handle Enter and Space keys explicitly
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault(); // Prevent default scroll on Space
                handleBoringButtonClick();
            }
        });
    }
    
    // Load and render history from localStorage
    renderHistory();
});
