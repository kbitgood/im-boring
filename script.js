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
   Idea Modal Functions
   ======================== */

// Modal element references
let ideaModal = null;
let modalText = null;

/**
 * Initialize modal element references
 */
function initModal() {
    if (!ideaModal) {
        ideaModal = document.getElementById('idea-modal');
    }
    if (!modalText) {
        modalText = document.getElementById('modal-text');
    }
}

/**
 * Open the idea modal with the given text
 * @param {string} text - The full idea text to display
 */
function openIdeaModal(text) {
    initModal();
    if (ideaModal && modalText) {
        modalText.textContent = text;
        ideaModal.classList.remove('hidden');
        // Focus the close button for accessibility
        const closeBtn = ideaModal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.focus();
        }
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Close the idea modal
 */
function closeIdeaModal() {
    initModal();
    if (ideaModal) {
        ideaModal.classList.add('hidden');
        // Restore body scroll
        document.body.style.overflow = '';
    }
}

/**
 * Handle click on a history card
 * @param {string} text - The full idea text
 */
function handleHistoryCardClick(text) {
    playBleepSound();
    openIdeaModal(text);
}

/* ========================
   History Persistence (localStorage)
   ======================== */

// localStorage key for history
const HISTORY_STORAGE_KEY = 'im-boring-history';

// Maximum number of ideas to store and display
const MAX_HISTORY_SIZE = 15;

// In-memory history array
let ideasHistory = [];

// Rate limit constants
const RATE_LIMIT = 10;
const RATE_LIMIT_WINDOW_MS = 4 * 60 * 60 * 1000; // 4 hours in milliseconds
const CRASH_THRESHOLD = 20; // Presses after limit before crash
const RATE_LIMIT_STORAGE_KEY = 'im-boring-rate-limit';

// Rate limit state
let periodPresses = 0;
let periodStartTime = null; // Timestamp when the current period started
let pressesAfterLimit = 0;
let countdownInterval = null; // Interval for updating the countdown timer

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

/* ========================
   Daily Limit Functions
   ======================== */

/**
 * Get current timestamp in milliseconds
 */
function getCurrentTime() {
    return Date.now();
}

/**
 * Check if the current rate limit period has expired
 * @returns {boolean} True if the period has expired (4+ hours since start)
 */
function isPeriodExpired() {
    if (!periodStartTime) return true;
    return (getCurrentTime() - periodStartTime) >= RATE_LIMIT_WINDOW_MS;
}

/**
 * Get time remaining until the period resets
 * @returns {number} Milliseconds remaining, or 0 if period expired
 */
function getTimeRemaining() {
    if (!periodStartTime) return 0;
    const elapsed = getCurrentTime() - periodStartTime;
    const remaining = RATE_LIMIT_WINDOW_MS - elapsed;
    return Math.max(0, remaining);
}

/**
 * Format milliseconds into a human-readable countdown string
 * @param {number} ms - Milliseconds to format
 * @returns {string} Formatted string like "3h 45m 12s"
 */
function formatTimeRemaining(ms) {
    if (ms <= 0) return 'now';
    
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor(ms / (1000 * 60 * 60));
    
    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);
    
    return parts.join(' ');
}

/**
 * Load rate limit data from localStorage
 */
function loadRateLimit() {
    try {
        const stored = localStorage.getItem(RATE_LIMIT_STORAGE_KEY);
        if (stored) {
            const data = JSON.parse(stored);
            
            // Check if the period has expired
            const periodStart = data.periodStartTime || 0;
            const elapsed = getCurrentTime() - periodStart;
            
            if (elapsed >= RATE_LIMIT_WINDOW_MS) {
                // Period expired, reset everything
                periodPresses = 0;
                pressesAfterLimit = 0;
                periodStartTime = null;
                saveRateLimit();
            } else {
                // Still in the same period
                periodPresses = data.presses || 0;
                pressesAfterLimit = data.pressesAfterLimit || 0;
                periodStartTime = periodStart;
            }
        } else {
            periodStartTime = null;
        }
    } catch (error) {
        console.warn('Could not load rate limit:', error.message);
        periodPresses = 0;
        pressesAfterLimit = 0;
        periodStartTime = null;
    }
}

/**
 * Save rate limit data to localStorage
 */
function saveRateLimit() {
    try {
        localStorage.setItem(RATE_LIMIT_STORAGE_KEY, JSON.stringify({
            periodStartTime: periodStartTime,
            presses: periodPresses,
            pressesAfterLimit: pressesAfterLimit
        }));
    } catch (error) {
        console.warn('Could not save rate limit:', error.message);
    }
}

/**
 * Update the limit counter display
 */
function updateLimitCounter() {
    const counterEl = document.getElementById('limit-counter');
    const remainingEl = document.getElementById('presses-remaining');
    const counterTextEl = counterEl?.querySelector('.limit-counter-text');
    
    if (!counterEl || !remainingEl) return;
    
    const remaining = Math.max(0, RATE_LIMIT - periodPresses);
    remainingEl.textContent = remaining;
    
    // Update styling based on remaining presses
    counterEl.classList.remove('warning', 'danger');
    if (remaining <= 3 && remaining > 0) {
        counterEl.classList.add('warning');
    } else if (remaining === 0) {
        counterEl.classList.add('danger');
    }
    
    // Update countdown timer display
    updateCountdownDisplay();
}

/**
 * Update the countdown timer display
 */
function updateCountdownDisplay() {
    const timerEl = document.getElementById('countdown-timer');
    const counterTextEl = document.querySelector('.limit-counter-text');
    
    if (!timerEl) return;
    
    const remaining = getTimeRemaining();
    const pressesRemaining = Math.max(0, RATE_LIMIT - periodPresses);
    
    if (pressesRemaining === 0 && remaining > 0) {
        // Show countdown when limit is reached
        timerEl.textContent = `Resets in ${formatTimeRemaining(remaining)}`;
        timerEl.classList.remove('hidden');
        startCountdownTimer();
    } else if (pressesRemaining > 0 && periodStartTime && remaining > 0) {
        // Show subtle countdown even when presses remain
        timerEl.textContent = `Resets in ${formatTimeRemaining(remaining)}`;
        timerEl.classList.remove('hidden');
        startCountdownTimer();
    } else {
        timerEl.classList.add('hidden');
        stopCountdownTimer();
    }
}

/**
 * Start the countdown timer interval
 */
function startCountdownTimer() {
    if (countdownInterval) return; // Already running
    
    countdownInterval = setInterval(() => {
        const remaining = getTimeRemaining();
        const timerEl = document.getElementById('countdown-timer');
        
        if (remaining <= 0) {
            // Period expired, reset and refresh
            stopCountdownTimer();
            loadRateLimit();
            updateLimitCounter();
            
            // Hide limit message if it was showing
            const messageEl = document.getElementById('limit-message');
            if (messageEl) {
                messageEl.classList.add('hidden');
            }
            return;
        }
        
        if (timerEl) {
            timerEl.textContent = `Resets in ${formatTimeRemaining(remaining)}`;
        }
    }, 1000);
}

/**
 * Stop the countdown timer interval
 */
function stopCountdownTimer() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }
}

/**
 * Show the limit reached message
 */
function showLimitMessage() {
    const messageEl = document.getElementById('limit-message');
    const resultContainer = document.getElementById('result-container');
    
    if (messageEl) {
        messageEl.classList.remove('hidden');
    }
    if (resultContainer) {
        resultContainer.classList.add('hidden');
        resultContainer.classList.remove('visible');
    }
}

/**
 * Check if rate limit has been reached
 */
function isLimitReached() {
    // First check if period expired
    if (isPeriodExpired()) {
        // Reset for new period
        periodPresses = 0;
        pressesAfterLimit = 0;
        periodStartTime = null;
        saveRateLimit();
        
        // Hide the limit message if showing
        const messageEl = document.getElementById('limit-message');
        if (messageEl) {
            messageEl.classList.add('hidden');
        }
        
        updateLimitCounter();
        return false;
    }
    return periodPresses >= RATE_LIMIT;
}

/**
 * Increment the press counter
 * Returns true if still within limit, false if limit reached
 */
function incrementPress() {
    // Start a new period if needed
    if (!periodStartTime) {
        periodStartTime = getCurrentTime();
    }
    
    periodPresses++;
    saveRateLimit();
    updateLimitCounter();
    return periodPresses <= RATE_LIMIT;
}

/**
 * Handle presses after the limit
 */
function handlePostLimitPress() {
    pressesAfterLimit++;
    saveRateLimit();
    
    // Add screen shake effect as they get closer to crash
    if (pressesAfterLimit >= CRASH_THRESHOLD - 5) {
        document.body.classList.add('screen-shake');
        setTimeout(() => document.body.classList.remove('screen-shake'), 200);
    }
    
    // Trigger crash at threshold
    if (pressesAfterLimit >= CRASH_THRESHOLD) {
        triggerCrash();
        return true;
    }
    
    // Play an error sound
    playErrorSound();
    
    // Update the limit message with increasingly desperate pleas
    updateLimitMessageDesperation();
    
    return false;
}

/**
 * Play an error/warning sound
 */
function playErrorSound() {
    const ctx = initAudio();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.setValueAtTime(100, ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.2);
}

/**
 * Update the limit message with increasing desperation
 */
function updateLimitMessageDesperation() {
    const messageEl = document.getElementById('limit-message');
    if (!messageEl) return;
    
    const titleEl = messageEl.querySelector('.limit-message-title');
    const textEl = messageEl.querySelector('.limit-message-text');
    
    const messages = [
        { title: "Still here?", text: "The button won't make you less bored. The IDEAS will! Pick one! Any one! Go build a blanket fort! NOW!" },
        { title: "Seriously?!", text: "You're pressing a button instead of doing fun things. This is peak irony. GO. DO. SOMETHING. WEIRD." },
        { title: "STOP.", text: "The button is becoming concerned. It's just a button. It has no more wisdom to give. YOU have the power. USE IT." },
        { title: "WARNING!", text: "Excessive button pressing detected. System stability compromised. Please touch grass before catastrophic failure." },
        { title: "CRITICAL!", text: "DANGER DANGER! Button overload imminent! The system cannot handle this much indecision! ABORT! DO AN ACTIVITY!" },
        { title: "SYSTEM FAILING", text: "Y̸O̷U̴ ̵W̶E̵R̷E̶ ̵W̷A̸R̵N̴E̸D̶.̵.̷.̶" }
    ];
    
    const index = Math.min(pressesAfterLimit - 1, messages.length - 1);
    const msg = messages[index];
    
    if (titleEl) titleEl.textContent = msg.title;
    if (textEl) textEl.textContent = msg.text;
    
    // Make the message shake more as they press more
    if (pressesAfterLimit >= 3) {
        messageEl.style.animation = 'screenShake 0.1s infinite';
    }
}

/**
 * Trigger the retro crash effect
 */
function triggerCrash() {
    // Play a crash sound
    playCrashSound();
    
    // Create the crash overlay
    const overlay = document.createElement('div');
    overlay.className = 'crash-overlay';
    overlay.innerHTML = `
        <div class="crash-static"></div>
        <div class="crash-content">
            <div class="crash-skull">💀</div>
            <div class="crash-glitch">SYSTEM CRASH</div>
            <div class="crash-error-code">
                ERROR 0xB0R3D0M<br>
                FATAL EXCEPTION: ButtonOverflow<br>
                CAUSE: User refused to do anything fun
            </div>
            <div class="crash-message">
                The boredom has consumed the machine.<br>
                You pressed the button ${RATE_LIMIT + CRASH_THRESHOLD} times<br>
                instead of doing literally anything else.<br><br>
                This is what happens when you seek infinite ideas<br>
                but take zero action.<br><br>
                The button is dead. You killed it.<br>
                Are you happy now?
            </div>
            <div class="crash-restart" onclick="location.reload()">
                [ PRESS ANY KEY TO REBOOT AND REFLECT ON YOUR CHOICES ]
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Add keyboard listener to reload
    const reloadHandler = () => {
        location.reload();
    };
    document.addEventListener('keydown', reloadHandler, { once: true });
}

/**
 * Play a dramatic crash sound
 */
function playCrashSound() {
    const ctx = initAudio();
    
    // Descending chaos
    for (let i = 0; i < 10; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'square';
        osc.frequency.setValueAtTime(800 - (i * 70), ctx.currentTime + (i * 0.05));
        
        gain.gain.setValueAtTime(0.15, ctx.currentTime + (i * 0.05));
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + (i * 0.05) + 0.1);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(ctx.currentTime + (i * 0.05));
        osc.stop(ctx.currentTime + (i * 0.05) + 0.15);
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
    // Render ideas (history is stored newest-first, so we iterate normally)
    history.forEach((idea) => {
        addToHistory(idea, false); // false = don't save again
    });
}

/**
 * Add an idea to the history gallery
 * Creates a new card and inserts it at the beginning (most recent first)
 * Stores and displays up to MAX_HISTORY_SIZE ideas
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
        
        // Remove oldest displayed card if we're at the limit
        const displayedCards = historyGallery.querySelectorAll('.history-card');
        if (displayedCards.length >= MAX_HISTORY_SIZE) {
            // Remove the last (oldest) card
            historyGallery.removeChild(displayedCards[displayedCards.length - 1]);
        }
    }
    
    // Create the history card element
    const card = document.createElement('div');
    card.className = 'history-card';
    card.setAttribute('role', 'listitem');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', 'Click to view full idea');
    
    // Create the text paragraph
    const textElement = document.createElement('p');
    textElement.className = 'history-card-text';
    textElement.textContent = text;
    
    // Assemble the card
    card.appendChild(textElement);
    
    // Add click handler to open modal
    card.addEventListener('click', () => handleHistoryCardClick(text));
    
    // Add keyboard handler for accessibility
    card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleHistoryCardClick(text);
        }
    });
    
    // Insert at the beginning (most recent first)
    historyGallery.insertBefore(card, historyGallery.firstChild);
}

/* ========================
   Idea Packs System
   ======================== */

// Base URL for fetching ideas - works both on GitHub Pages and locally
const IDEAS_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? './ideas/'
    : '/im-boring/ideas/';

// localStorage key prefix for idea packs
const PACK_STORAGE_PREFIX = 'im-boring-idea-pack-';

// Minimum ideas threshold before fetching more
const MIN_IDEAS_THRESHOLD = 500;

// In-memory cache of loaded packs
let loadedPacks = {};

// Flag to prevent concurrent fetches
let isFetchingIdeas = false;

// Flag to track if initial packs have been loaded
let packsInitialized = false;

/**
 * Show the ideas loading indicator
 */
function showIdeasLoader() {
    const loader = document.getElementById('ideas-loader');
    if (loader) {
        loader.classList.remove('hidden');
    }
}

/**
 * Hide the ideas loading indicator
 */
function hideIdeasLoader() {
    const loader = document.getElementById('ideas-loader');
    if (loader) {
        loader.classList.add('hidden');
    }
}

/**
 * Clear old localStorage keys from previous architecture
 * Called once on migration to new pack system
 */
function migrateOldStorage() {
    const oldKeys = [
        'im-boring-remote-ideas',
        'im-boring-downloaded-packs',
        'im-boring-daily-limit'
    ];
    
    oldKeys.forEach(key => {
        try {
            if (localStorage.getItem(key) !== null) {
                localStorage.removeItem(key);
                console.log(`Migrated: removed old key ${key}`);
            }
        } catch (error) {
            console.warn(`Could not remove old key ${key}:`, error.message);
        }
    });
}

/**
 * Load all idea packs from localStorage into memory
 * Scans for keys matching the pack prefix pattern
 */
function loadAllPacks() {
    loadedPacks = {};
    
    try {
        // Scan localStorage for pack keys
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(PACK_STORAGE_PREFIX)) {
                const packId = key.replace(PACK_STORAGE_PREFIX, '');
                const stored = localStorage.getItem(key);
                if (stored) {
                    const ideas = JSON.parse(stored);
                    if (Array.isArray(ideas) && ideas.length > 0) {
                        loadedPacks[packId] = ideas;
                    } else if (Array.isArray(ideas) && ideas.length === 0) {
                        // Pack is empty, remove it
                        localStorage.removeItem(key);
                    }
                }
            }
        }
    } catch (error) {
        console.warn('Error loading packs from localStorage:', error.message);
    }
    
    console.log(`Loaded ${Object.keys(loadedPacks).length} packs from localStorage`);
}

/**
 * Save a single pack to localStorage
 * If pack is empty, removes the key entirely
 * @param {string} packId - The pack ID (e.g., "pack-001")
 */
function savePack(packId) {
    const key = PACK_STORAGE_PREFIX + packId;
    
    try {
        const ideas = loadedPacks[packId];
        
        if (!ideas || ideas.length === 0) {
            // Pack is empty, remove from storage and memory
            localStorage.removeItem(key);
            delete loadedPacks[packId];
            console.log(`Pack ${packId} exhausted and removed`);
        } else {
            localStorage.setItem(key, JSON.stringify(ideas));
        }
    } catch (error) {
        console.warn(`Could not save pack ${packId}:`, error.message);
    }
}

/**
 * Get total count of remaining ideas across all packs
 * @returns {number} Total remaining ideas
 */
function getTotalIdeasCount() {
    let total = 0;
    for (const packId in loadedPacks) {
        total += loadedPacks[packId].length;
    }
    return total;
}

/**
 * Get list of pack IDs currently loaded (non-empty)
 * @returns {string[]} Array of pack IDs
 */
function getLoadedPackIds() {
    return Object.keys(loadedPacks).filter(id => loadedPacks[id] && loadedPacks[id].length > 0);
}

/**
 * Get a random idea from the loaded packs
 * Removes the idea from its pack permanently
 * @returns {string|null} A random idea, or null if no ideas available
 */
function getRandomIdea() {
    const packIds = getLoadedPackIds();
    
    if (packIds.length === 0) {
        console.warn('No ideas available in any pack');
        return null;
    }
    
    // Pick a random pack
    const randomPackIndex = Math.floor(Math.random() * packIds.length);
    const packId = packIds[randomPackIndex];
    const pack = loadedPacks[packId];
    
    // Pick a random idea from that pack
    const randomIdeaIndex = Math.floor(Math.random() * pack.length);
    const idea = pack[randomIdeaIndex];
    
    // Remove the idea from the pack
    pack.splice(randomIdeaIndex, 1);
    
    // Save the updated pack
    savePack(packId);
    
    // Check if we need to fetch more ideas
    const totalRemaining = getTotalIdeasCount();
    if (totalRemaining < MIN_IDEAS_THRESHOLD) {
        fetchMoreIdeas();
    }
    
    return idea;
}

/**
 * Fetch the ideas index from the remote server
 * @returns {Promise<{version: number, packs: string[]}|null>} The index or null on failure
 */
async function fetchIdeasIndex() {
    try {
        const response = await fetch(IDEAS_BASE_URL + 'index.json', {
            cache: 'no-store' // Always get fresh index
        });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.warn('Could not fetch ideas index:', error.message);
        return null;
    }
}

/**
 * Fetch a specific idea pack from the server
 * @param {string} packFile - The pack filename (e.g., "pack-001.json")
 * @returns {Promise<{id: string, name: string, ideas: string[]}|null>} The pack or null on failure
 */
async function fetchIdeaPack(packFile) {
    try {
        const response = await fetch(IDEAS_BASE_URL + packFile, {
            cache: 'no-store'
        });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.warn(`Could not fetch idea pack ${packFile}:`, error.message);
        return null;
    }
}

/**
 * Fetch more ideas when running low
 * Priority:
 * 1. Download packs that aren't loaded at all (not in loadedPacks)
 * 2. If all packs are partially used, refresh the one with fewest remaining ideas
 */
async function fetchMoreIdeas() {
    // Prevent concurrent fetches
    if (isFetchingIdeas) {
        return;
    }
    
    isFetchingIdeas = true;
    showIdeasLoader();
    
    try {
        // Fetch the index to see what packs are available
        const index = await fetchIdeasIndex();
        if (!index || !index.packs || !Array.isArray(index.packs)) {
            console.log('No remote ideas index found or invalid format');
            return;
        }
        
        // Get list of currently loaded pack IDs
        const loadedPackIds = Object.keys(loadedPacks);
        
        // Find packs that aren't loaded at all (available to download fresh)
        const availablePacks = index.packs.filter(packFile => {
            const packId = packFile.replace('.json', '');
            return !loadedPackIds.includes(packId);
        });
        
        let selectedPackFile;
        let isRefresh = false;
        
        if (availablePacks.length > 0) {
            // Pick a random available pack to download
            const randomIndex = Math.floor(Math.random() * availablePacks.length);
            selectedPackFile = availablePacks[randomIndex];
            console.log(`Downloading new pack: ${selectedPackFile}`);
        } else {
            // All packs are partially used - find the one with fewest remaining ideas to refresh
            let smallestPackId = null;
            let smallestCount = Infinity;
            
            for (const packId in loadedPacks) {
                const count = loadedPacks[packId].length;
                if (count < smallestCount) {
                    smallestCount = count;
                    smallestPackId = packId;
                }
            }
            
            if (smallestPackId) {
                selectedPackFile = smallestPackId + '.json';
                isRefresh = true;
                console.log(`Refreshing pack ${smallestPackId} (had ${smallestCount} ideas remaining)`);
            } else {
                console.log('No packs available to download or refresh');
                return;
            }
        }
        
        // Download the selected pack
        const pack = await fetchIdeaPack(selectedPackFile);
        if (pack && pack.ideas && Array.isArray(pack.ideas)) {
            const packId = pack.id || selectedPackFile.replace('.json', '');
            
            // Add pack to memory (replaces if refreshing)
            loadedPacks[packId] = [...pack.ideas];
            
            // Save to localStorage
            savePack(packId);
            
            const action = isRefresh ? 'Refreshed' : 'Downloaded';
            console.log(`${action} pack "${pack.name || packId}" with ${pack.ideas.length} ideas! Total: ${getTotalIdeasCount()}`);
        }
        
    } catch (error) {
        console.error('Error fetching ideas:', error);
    } finally {
        isFetchingIdeas = false;
        hideIdeasLoader();
    }
}

/**
 * Initialize the idea packs system
 * Loads existing packs from localStorage or fetches starter pack
 */
async function initializeIdeaPacks() {
    if (packsInitialized) {
        return;
    }
    
    // Migrate old storage format if needed
    migrateOldStorage();
    
    // Load existing packs from localStorage
    loadAllPacks();
    
    // If no packs loaded, fetch the starter pack (pack-000)
    if (Object.keys(loadedPacks).length === 0) {
        console.log('No packs found, fetching starter pack...');
        showIdeasLoader();
        
        try {
            const starterPack = await fetchIdeaPack('pack-000.json');
            if (starterPack && starterPack.ideas && Array.isArray(starterPack.ideas)) {
                const packId = starterPack.id || 'pack-000';
                loadedPacks[packId] = [...starterPack.ideas];
                savePack(packId);
                console.log(`Loaded starter pack with ${starterPack.ideas.length} ideas`);
            }
        } catch (error) {
            console.error('Failed to load starter pack:', error);
        } finally {
            hideIdeasLoader();
        }
    }
    
    // Check if we need more ideas
    const totalIdeas = getTotalIdeasCount();
    console.log(`Total ideas available: ${totalIdeas}`);
    
    if (totalIdeas < MIN_IDEAS_THRESHOLD) {
        fetchMoreIdeas();
    }
    
    packsInitialized = true;
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
            return getRandomIdea();
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
        return getRandomIdea();
    } finally {
        hideMascot();
        isGenerating = false;
    }
}

/**
 * Handle the main button click - generate and display an idea
 */
async function handleBoringButtonClick() {
    // Check if limit already reached
    if (isLimitReached()) {
        // Handle post-limit presses
        handlePostLimitPress();
        return;
    }
    
    // Play a sound on click
    playRandomSound();
    
    // Increment the press counter
    incrementPress();
    
    // Check if this press hit the limit
    if (isLimitReached()) {
        showLimitMessage();
        return;
    }
    
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
    
    // Set up modal event listeners
    const ideaModalEl = document.getElementById('idea-modal');
    if (ideaModalEl) {
        // Close button click
        const closeBtn = ideaModalEl.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeIdeaModal);
        }
        
        // Backdrop click to close
        const backdrop = ideaModalEl.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.addEventListener('click', closeIdeaModal);
        }
        
        // Escape key to close
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && !ideaModalEl.classList.contains('hidden')) {
                closeIdeaModal();
            }
        });
    }
    
    // Load rate limit from localStorage
    loadRateLimit();
    updateLimitCounter();
    
    // If limit was already reached, show the message
    if (isLimitReached()) {
        showLimitMessage();
    }
    
    // Load and render history from localStorage
    renderHistory();
    
    // Initialize idea packs system
    initializeIdeaPacks();
});
