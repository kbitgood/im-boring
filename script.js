/**
 * I'm Boring - Retro Game Sounds & Loading Mascot
 * Web Audio API sound generator for 8-bit chiptune effects
 * Plus loading mascot show/hide functionality
 */

// Audio context - initialized on first user interaction
let audioContext = null;

// Loading container element reference
let loadingContainer = null;

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

// DOM Ready - Set up button click handler
document.addEventListener('DOMContentLoaded', () => {
    const boringButton = document.getElementById('boring-button');
    
    if (boringButton) {
        boringButton.addEventListener('click', () => {
            playRandomSound();
        });
    }
});
