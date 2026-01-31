# Idea Packs Architecture Refactor

## Overview

Refactor the ideas system so that:
- All ideas come from downloadable packs (no hardcoded base ideas)
- Ideas are permanently removed when used
- Empty packs can be re-downloaded
- Storage is efficient with each pack as its own localStorage key

## Data Structures

### localStorage Keys

**`im-boring-idea-pack-{id}`** (one key per pack)
```javascript
["idea1", "idea2", ...]  // Just the remaining ideas array
```

**`im-boring-history`** (unchanged format, reduced size)
```javascript
["idea text 1", "idea text 2", ...]  // Max 15 items
```

### In-Memory Cache

```javascript
let loadedPacks = {
  "pack-000": ["idea1", "idea2", ...],
  "pack-001": ["idea50", ...],
};
```

## Logic Flows

### On Page Load

```
1. Scan localStorage for keys matching "im-boring-idea-pack-*"
2. Load each into loadedPacks in-memory object
3. If no packs found → fetch pack-000.json (starter pack)
4. Check total remaining ideas across all packs
5. If < 500 → trigger fetchMoreIdeas()
```

### getRandomIdea()

```
1. Get list of non-empty pack keys from loadedPacks
2. Pick random pack
3. Pick random index from that pack's array
4. Remove idea from array (splice)
5. If pack now empty:
   → Delete from loadedPacks
   → Delete localStorage key entirely
6. Else:
   → Save updated array to localStorage
7. If total remaining < 500 → trigger fetchMoreIdeas()
8. Return idea
```

### fetchMoreIdeas()

```
1. Fetch index.json to get all available pack filenames
2. Get list of currently loaded pack IDs
3. Find packs NOT in loadedPacks (available to download):
   → If any: pick random one, download, add to storage
4. Else (all packs partially loaded):
   → Find pack with fewest remaining ideas
   → Re-download and replace (refresh to full ~200)
5. Save new pack to localStorage + loadedPacks
```

## Task Breakdown

- [ ] 1. Create pack-000.json - Move base ideas to file
- [ ] 2. Update index.json - Add pack-000 to the list  
- [ ] 3. Remove old code - Clean out deprecated arrays/functions
- [ ] 4. Add pack loading - `loadAllPacks()` scans localStorage
- [ ] 5. Add pack saving - `savePack(packId)` saves single pack
- [ ] 6. Add idea selection - `getRandomIdea()` with removal logic
- [ ] 7. Update fetch logic - New pack selection/refresh logic
- [ ] 8. Update history - Reduce MAX_HISTORY_SIZE to 15
- [ ] 9. Add migration - Clear old localStorage keys
- [ ] 10. Test edge cases

## Migration Strategy

On first load with new code:
1. Check for old localStorage keys:
   - `im-boring-remote-ideas`
   - `im-boring-downloaded-packs`
   - `im-boring-daily-limit` (old daily limit)
2. If found, delete them
3. Initialize fresh with pack-000

## Edge Cases

1. **No ideas available**: All packs empty, fetch in progress
   - Show loading state, wait for fetch to complete

2. **All packs partially used, none available to download**:
   - Find pack with fewest remaining ideas
   - Re-download to refresh it to full size

3. **localStorage quota exceeded**:
   - Graceful degradation, log warning
   - Continue with in-memory ideas

4. **Network failure during fetch**:
   - Keep using existing ideas
   - Retry on next idea request if still low

## File Changes Summary

| File | Changes |
|------|---------|
| `/ideas/pack-000.json` | NEW - Contains former base ideas |
| `/ideas/index.json` | Add pack-000 to packs list |
| `script.js` | Major refactor of ideas system |
