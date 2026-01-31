#!/bin/bash

# Generate Ideas Pack Script
# Uses OpenCode with Claude Opus 4.5 to generate creative boredom-busting ideas
# Supports parallel execution with file locking
#
# Usage:
#   ./scripts/generate-pack.sh              # Generate one pack
#   ./scripts/generate-pack.sh --parallel 4 # Run 4 parallel generators
#
# Requirements:
#   - opencode CLI installed and authenticated
#   - Node.js installed

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
IDEAS_DIR="$SCRIPT_DIR/../ideas"
PACK_SIZE=200
BATCH_SIZE=50

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_batch() {
    echo -e "${CYAN}[BATCH]${NC} $1"
}

# Find the next available pack number
find_next_pack_number() {
    local max_num=0
    local files
    files=$(ls "$IDEAS_DIR"/pack-*.json "$IDEAS_DIR"/pack-*.lock 2>/dev/null || true)
    
    for f in $files; do
        if [[ -f "$f" ]]; then
            # Extract number from filename
            num=$(basename "$f" | sed -E 's/pack-([0-9]+)\..*/\1/' | sed 's/^0*//')
            if [[ -n "$num" && "$num" -gt "$max_num" ]]; then
                max_num=$num
            fi
        fi
    done
    echo $((max_num + 1))
}

# Try to acquire a lock for a pack number
acquire_lock() {
    local pack_num=$1
    local pack_num_padded=$(printf "%03d" "$pack_num")
    local lock_file="$IDEAS_DIR/pack-${pack_num_padded}.lock"
    local pack_file="$IDEAS_DIR/pack-${pack_num_padded}.json"
    
    # Check if pack already exists
    if [[ -f "$pack_file" ]]; then
        return 1
    fi
    
    # Try to create lock file atomically
    if (set -o noclobber; echo "$$:$(date +%s)" > "$lock_file") 2>/dev/null; then
        # We got the lock
        echo "$lock_file"
        return 0
    else
        return 1
    fi
}

# Release a lock
release_lock() {
    local lock_file=$1
    if [[ -f "$lock_file" ]]; then
        rm -f "$lock_file"
    fi
}

# Get sample ideas from existing packs for the prompt
get_sample_ideas() {
    node -e "
        const fs = require('fs');
        const path = require('path');
        const ideasDir = '$IDEAS_DIR';
        
        let allIdeas = [];
        const files = fs.readdirSync(ideasDir).filter(f => f.match(/pack-\d+\.json/));
        
        for (const file of files) {
            try {
                const pack = JSON.parse(fs.readFileSync(path.join(ideasDir, file), 'utf8'));
                if (pack.ideas && Array.isArray(pack.ideas)) {
                    allIdeas.push(...pack.ideas);
                }
            } catch (e) {}
        }
        
        // Shuffle and take 30 samples
        const shuffled = allIdeas.sort(() => Math.random() - 0.5);
        const samples = shuffled.slice(0, 30);
        
        samples.forEach(idea => console.log('- ' + idea));
    " 2>/dev/null
}

# Generate a batch of ideas using OpenCode
generate_batch() {
    local batch_num=$1
    local existing_ideas_file=$2
    local pack_num_padded=$3
    local sample_ideas="$4"
    
    local existing_count=0
    if [[ -f "$existing_ideas_file" ]]; then
        existing_count=$(node -e "console.log(JSON.parse(require('fs').readFileSync('$existing_ideas_file', 'utf8')).length)" 2>/dev/null || echo "0")
    fi
    
    local remaining=$((PACK_SIZE - existing_count))
    local to_generate=$BATCH_SIZE
    if [[ $remaining -lt $BATCH_SIZE ]]; then
        to_generate=$remaining
    fi
    
    if [[ $to_generate -le 0 ]]; then
        return 0
    fi
    
    log_batch "Pack $pack_num_padded | Batch $batch_num | Generating $to_generate ideas ($existing_count/$PACK_SIZE complete)..."
    
    # Get recently generated ideas to avoid duplicates
    local recent_ideas=""
    if [[ -f "$existing_ideas_file" ]]; then
        recent_ideas=$(node -e "
            const fs = require('fs');
            const ideas = JSON.parse(fs.readFileSync('$existing_ideas_file', 'utf8'));
            ideas.slice(-15).forEach(idea => console.log('- ' + idea.substring(0, 120) + '...'));
        " 2>/dev/null)
    fi
    
    # Create the prompt
    local prompt="You are generating boredom-busting ideas for a fun website called 'I'm Boring'.

Generate EXACTLY $to_generate unique, weird, wacky, quirky, and hilarious boredom-busting activity ideas.

STYLE GUIDELINES:
- Each idea should be absurd, whimsical, and make people laugh
- Ideas should be things someone could actually do (even if silly)
- Mix of: mock ceremonies, fake documentaries, imaginary scenarios, anthropomorphizing objects, dramatic everyday activities
- Be specific and detailed - not generic
- Include funny details, dramatic flair, and unexpected twists
- Vary the format: some short and punchy, some with more elaborate setups
- Be MAXIMALLY CREATIVE - push the boundaries of absurdity

EXAMPLE IDEAS (match this style and creativity level):
$sample_ideas

$(if [[ -n "$recent_ideas" ]]; then
    echo "RECENTLY GENERATED (DO NOT REPEAT OR CREATE SIMILAR):"
    echo "$recent_ideas"
fi)

CRITICAL RULES:
1. Output ONLY a valid JSON array of strings
2. Start with [ and end with ]
3. No markdown code blocks, no explanation, no numbering
4. Each idea must be completely unique
5. Generate EXACTLY $to_generate ideas
6. Be wildly creative and surprising

JSON array of $to_generate ideas:"

    # Call OpenCode
    local result_file=$(mktemp)
    
    # Note: We pass the prompt directly as the message
    if ! opencode run --model github-copilot/claude-opus-4.5 "$prompt" > "$result_file" 2>&1; then
        log_error "OpenCode command failed"
        cat "$result_file" >&2
        rm -f "$result_file"
        return 1
    fi
    
    # Extract JSON array from result
    local json_result
    json_result=$(node -e "
        const fs = require('fs');
        const input = fs.readFileSync('$result_file', 'utf8');
        
        // Remove markdown code blocks if present
        let cleaned = input.replace(/\`\`\`json\s*/gi, '').replace(/\`\`\`\s*/g, '');
        
        // Find JSON array in the output
        const match = cleaned.match(/\[[\s\S]*\]/);
        if (match) {
            try {
                const arr = JSON.parse(match[0]);
                if (Array.isArray(arr) && arr.length > 0 && typeof arr[0] === 'string') {
                    console.log(JSON.stringify(arr));
                    process.exit(0);
                }
            } catch (e) {
                // Try to fix common JSON issues
                let fixed = match[0]
                    .replace(/,\s*\]/g, ']')  // Remove trailing commas
                    .replace(/\n/g, ' ');     // Remove newlines in strings
                try {
                    const arr = JSON.parse(fixed);
                    if (Array.isArray(arr) && arr.length > 0) {
                        console.log(JSON.stringify(arr));
                        process.exit(0);
                    }
                } catch (e2) {}
            }
        }
        process.exit(1);
    " 2>/dev/null)
    
    rm -f "$result_file"
    
    if [[ -z "$json_result" ]]; then
        log_error "Failed to parse JSON from OpenCode response"
        return 1
    fi
    
    # Merge with existing ideas
    local added_count
    added_count=$(node -e "
        const fs = require('fs');
        const newIdeas = $json_result;
        let existing = [];
        try {
            existing = JSON.parse(fs.readFileSync('$existing_ideas_file', 'utf8'));
        } catch (e) {}
        
        // Deduplicate
        const existingSet = new Set(existing.map(i => i.toLowerCase().trim()));
        const uniqueNew = newIdeas.filter(i => !existingSet.has(i.toLowerCase().trim()));
        
        const merged = [...existing, ...uniqueNew];
        fs.writeFileSync('$existing_ideas_file', JSON.stringify(merged, null, 2));
        console.log(uniqueNew.length);
    " 2>/dev/null)
    
    log_success "Added $added_count unique ideas"
    
    return 0
}

# Generate a single pack
generate_pack() {
    log_info "Starting idea pack generation..."
    
    # Find and lock a pack number
    local pack_num
    local lock_file=""
    local attempts=0
    local max_attempts=100
    
    while [[ -z "$lock_file" && $attempts -lt $max_attempts ]]; do
        pack_num=$(find_next_pack_number)
        lock_file=$(acquire_lock "$pack_num") || lock_file=""
        
        if [[ -z "$lock_file" ]]; then
            ((attempts++))
            sleep 0.$((RANDOM % 10))
        fi
    done
    
    if [[ -z "$lock_file" ]]; then
        log_error "Could not acquire lock after $max_attempts attempts"
        exit 1
    fi
    
    local pack_num_padded=$(printf "%03d" "$pack_num")
    local pack_file="$IDEAS_DIR/pack-${pack_num_padded}.json"
    local temp_ideas_file="$IDEAS_DIR/.pack-${pack_num_padded}-ideas.tmp"
    
    log_success "Acquired lock for pack-$pack_num_padded"
    
    # Cleanup on exit
    cleanup() {
        release_lock "$lock_file"
        rm -f "$temp_ideas_file"
    }
    trap cleanup EXIT
    
    # Get sample ideas for the prompt
    log_info "Collecting sample ideas from existing packs..."
    local sample_ideas
    sample_ideas=$(get_sample_ideas)
    
    if [[ -z "$sample_ideas" ]]; then
        log_error "No sample ideas found. Make sure there are existing packs in $IDEAS_DIR"
        exit 1
    fi
    
    # Initialize temp file with empty array
    echo "[]" > "$temp_ideas_file"
    
    # Generate batches until we have enough
    local batch_num=1
    local current_count=0
    local max_retries=3
    local consecutive_failures=0
    
    while [[ $current_count -lt $PACK_SIZE ]]; do
        local retry=0
        local batch_success=false
        
        while [[ $retry -lt $max_retries && "$batch_success" == "false" ]]; do
            if generate_batch "$batch_num" "$temp_ideas_file" "$pack_num_padded" "$sample_ideas"; then
                batch_success=true
                consecutive_failures=0
            else
                ((retry++))
                log_warn "Batch $batch_num failed, retry $retry/$max_retries..."
                sleep $((retry * 2))
            fi
        done
        
        if [[ "$batch_success" == "false" ]]; then
            ((consecutive_failures++))
            if [[ $consecutive_failures -ge 3 ]]; then
                log_error "Too many consecutive failures, aborting"
                exit 1
            fi
            log_warn "Skipping batch $batch_num after failures, continuing..."
        fi
        
        current_count=$(node -e "console.log(JSON.parse(require('fs').readFileSync('$temp_ideas_file', 'utf8')).length)" 2>/dev/null || echo "0")
        ((batch_num++))
        
        # Small delay between batches
        sleep 1
    done
    
    # Create final pack file
    log_info "Creating final pack file..."
    
    # Determine pack name
    local pack_names=("Chaos Collection" "Absurdity Archive" "Whimsy Warehouse" "Nonsense Nexus" "Quirk Quarters" "Madness Manor" "Peculiar Portfolio" "Zany Zone" "Oddity Outlet" "Bizarre Bazaar" "Folly Factory" "Wacky Wonderland" "Silly Stockpile" "Goofy Gallery" "Kooky Kompendium")
    local name_index=$((pack_num % ${#pack_names[@]}))
    local pack_name="${pack_names[$name_index]} ${pack_num}"
    
    node -e "
        const fs = require('fs');
        const ideas = JSON.parse(fs.readFileSync('$temp_ideas_file', 'utf8'));
        const pack = {
            id: 'pack-$pack_num_padded',
            name: '$pack_name',
            ideas: ideas.slice(0, $PACK_SIZE)
        };
        fs.writeFileSync('$pack_file', JSON.stringify(pack, null, 2));
        console.log('Created pack with ' + pack.ideas.length + ' ideas');
    "
    
    # Update index.json atomically
    log_info "Updating index.json..."
    local index_lock="$IDEAS_DIR/.index.lock"
    while ! (set -o noclobber; echo "$$" > "$index_lock") 2>/dev/null; do
        sleep 0.1
    done
    
    node -e "
        const fs = require('fs');
        const indexPath = '$IDEAS_DIR/index.json';
        const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
        const packFile = 'pack-$pack_num_padded.json';
        if (!index.packs.includes(packFile)) {
            index.packs.push(packFile);
            index.packs.sort();
            fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
            console.log('Added ' + packFile + ' to index');
        }
    "
    
    rm -f "$index_lock"
    
    # Cleanup temp file
    rm -f "$temp_ideas_file"
    
    log_success "Successfully created pack-$pack_num_padded.json with $PACK_SIZE ideas!"
}

# Run multiple generators in parallel
run_parallel() {
    local num_parallel=$1
    log_info "Starting $num_parallel parallel pack generators..."
    
    local pids=()
    for ((i=1; i<=num_parallel; i++)); do
        (
            log_info "Starting generator $i..."
            generate_pack
        ) &
        pids+=($!)
        sleep 1  # Stagger starts slightly
    done
    
    # Wait for all to complete
    local failed=0
    for pid in "${pids[@]}"; do
        if ! wait "$pid"; then
            ((failed++))
        fi
    done
    
    if [[ $failed -gt 0 ]]; then
        log_warn "$failed generators failed"
    else
        log_success "All $num_parallel generators completed successfully!"
    fi
}

# Main
main() {
    # Parse arguments
    local parallel=0
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --parallel|-p)
                parallel=$2
                shift 2
                ;;
            --help|-h)
                echo "Usage: $0 [options]"
                echo ""
                echo "Options:"
                echo "  --parallel, -p <n>   Run n generators in parallel"
                echo "  --help, -h           Show this help"
                exit 0
                ;;
            *)
                log_error "Unknown option: $1"
                exit 1
                ;;
        esac
    done
    
    if [[ $parallel -gt 0 ]]; then
        run_parallel "$parallel"
    else
        generate_pack
    fi
}

main "$@"
