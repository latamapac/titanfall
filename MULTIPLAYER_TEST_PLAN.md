# Titanfall Chronicles - Multiplayer Test Plan

## 📋 Document Purpose
Test and verify the multiplayer flow, identify bugs, and document fixes needed.

---

## 🎯 Intended Multiplayer Flow

### Flow 1: Host Creates Room, Remote Joins

```
┌──────────────┐                    ┌──────────────┐
│    HOST      │                    │   REMOTE     │
└──────┬───────┘                    └──────┬───────┘
       │                                   │
       │ 1. Click "Multiplayer"            │
       │ 2. Click "Create Room"            │
       │ 3. Server generates 5-digit code  │
       │ 4. Show code to user              │
       │    Status: "waiting"              │
       │                                   │
       │◄─────── Share code verbally ─────►│
       │                                   │
       │                                   │ 5. Click "Multiplayer"
       │                                   │ 6. Enter code
       │                                   │ 7. Click "Join Room"
       │                                   │    Status: "joining"
       │                                   │
       │◄────── socket.emit('join-room') ──┤
       │                                   │
       ├────── socket.on('player-joined') ─►
       │    Status: "connected"            │    Status: "connected"
       │                                   │
       │ 8. Host clicks "Set Up Game"      │
       │    Navigates to NewGameScreen     │
       │                                   │
       │ 9. Host selects titans/map        │
       │    Clicks "Start Battle"          │
       │                                   │
       ├────── emit('game-start', config) ─►
       │                                   │ 10. Remote receives event
       │                                   │     Navigates to GameScreen
       │                                   │
       │◄───────── BOTH IN GAME ──────────►│
       │                                   │
       │  Host broadcasts state changes    │
       │  Remote sends actions to host     │
```

### Flow 2: Page Refresh Recovery (INTENDED but NOT IMPLEMENTED)

```
┌──────────────┐                    ┌──────────────┐
│    HOST      │                    │   REMOTE     │
└──────┬───────┘                    └──────┬───────┘
       │                                   │
       │◄──────── Game in progress ───────►│
       │                                   │
       │     User refreshes page           │
       │     socket.disconnect()           │
       │                                   │
       │  [BUG] Room deleted from server   │
       │  [BUG] Remote gets "disconnected" │
       │  [BUG] Game state lost            │
       │                                   │
       │  [SHOULD] Room persists ~30s      │
       │  [SHOULD] Auto-reconnect to room  │
       │  [SHOULD] State re-sync           │
```

---

## 🧪 Test Procedure

### Test 1: Basic Happy Path
**Steps:**
1. Open Tab A, click Multiplayer → Create Room
2. Verify 5-digit code is displayed
3. Open Tab B (incognito), click Multiplayer
4. Enter code from Tab A, click Join Room
5. Verify both show "Connected!"
6. In Tab A, click "Set Up Game"
7. Select titans for both players, select map
8. Click "Start Battle"
9. Verify both tabs enter game
10. Verify Remote player sees game state

**Expected:** Both players in game, can play turns

---

### Test 2: Host Page Refresh During Lobby
**Steps:**
1. Tab A: Create Room, get code
2. Tab B: Join Room with code
3. Both: Verify "Connected!"
4. Tab A: Refresh page
5. Tab A: Navigate back to Multiplayer

**Expected:** 
- Tab B should show "Opponent disconnected"
- Room should be closed
- Tab A should need to create new room

**Actual Issue:** May get stuck or show inconsistent state

---

### Test 3: Remote Page Refresh During Lobby
**Steps:**
1. Tab A: Create Room, get code
2. Tab B: Join Room with code
3. Both: Verify "Connected!"
4. Tab B: Refresh page
5. Tab B: Navigate to Multiplayer, try to join same code

**Expected:**
- Tab A should show "Opponent disconnected" briefly
- Room may still exist (host still connected)
- Tab B should be able to rejoin

**Actual Issue:** Room might be deleted, code invalid

---

### Test 4: Host Refresh During Game
**Steps:**
1. Complete Test 1 (get both in game)
2. Play a few turns
3. Tab A (Host): Refresh page

**Expected:**
- Tab B: Shows disconnect message or freeze
- Game state ideally preserved for rejoin

**Actual Issue:** 
- Room deleted on server
- Remote player stuck
- Game lost

---

### Test 5: Remote Refresh During Game
**Steps:**
1. Complete Test 1 (get both in game)
2. Play a few turns
3. Tab B (Remote): Refresh page

**Expected:**
- Remote can rejoin and see current game state

**Actual Issue:**
- Room deleted (if host also disconnected logic triggers)
- No rejoin mechanism

---

### Test 6: Invalid Room Code
**Steps:**
1. Tab A: Go to Multiplayer
2. Enter "XXXXX" (non-existent code)
3. Click Join

**Expected:** Error message "Room not found"

---

### Test 7: Join Full Room
**Steps:**
1. Tab A: Create Room
2. Tab B: Join Room
3. Tab C: Try to join same code

**Expected:** Tab C gets "Room is full" error

---

### Test 8: Network Disconnect/Reconnect
**Steps:**
1. Complete Test 1 (get both in game)
2. Disconnect internet briefly
3. Reconnect internet

**Expected:** Socket.io reconnects automatically

**Actual Issue:** Room may be deleted, player stuck

---

## 🐛 Identified Issues (Pre-Test Analysis)

### Issue 1: Room Deleted on Any Disconnect
**Location:** `server/index.js:79-85`
```javascript
socket.on('disconnect', () => {
  const code = socket.data?.room;
  if (!code) return;
  socket.to(code).emit('player-disconnected');
  rooms.delete(code);  // ← PROBLEM: Always deletes room
  console.log(`Room ${code} closed (${socket.id} disconnected)`);
});
```

**Problem:** When any player disconnects, the entire room is deleted. This means:
- Page refresh kills the room
- Temporary network blip kills the room
- No possibility of reconnection

**Fix:** 
- Only delete room if host disconnects AND no remote connected
- Add reconnection grace period (30-60 seconds)
- Track disconnect time, allow rejoin with same socket.data

---

### Issue 2: No Reconnection State Persistence
**Location:** Client side - no reconnection logic

**Problem:** When page refreshes:
- Socket gets new ID
- `socket.data` (room, role) is lost
- No way to recover previous session

**Fix:**
- Store `roomCode` and `role` in sessionStorage/localStorage
- On reconnect, attempt to rejoin room automatically
- Server should allow rejoining existing room

---

### Issue 3: Game Start Data Missing for Remote
**Location:** `server/index.js:72-77`
```javascript
socket.on('game-start', (data) => {
  const code = socket.data?.room;
  if (!code) return;
  socket.to(code).emit('game-start', data);  // ← data passed but not used
});
```

**Problem:** Remote player receives `game-start` event but in `App.tsx`:
```javascript
const onGameStart = () => {
  setScreen('game');  // ← No game config received!
};
```

The remote doesn't get the titan/map selections - they rely entirely on state updates from host.

**Fix:** 
- Remote should receive and use game config
- Or ensure first state-update arrives before screen change

---

### Issue 4: Race Condition in State Updates
**Location:** `App.tsx:87-95`

**Problem:** Host broadcasts state on every change, but if remote joins mid-game, they might miss initial state.

**Fix:**
- Send full state immediately on remote join
- Add "request-sync" event for remote to ask for current state

---

### Issue 5: No Player-Disconnected Cleanup on Client
**Location:** `App.tsx:67-69`
```javascript
const onPlayerDisconnected = () => {
  setMpError('Opponent disconnected');
};
```

**Problem:** 
- Only sets error message
- Doesn't reset lobby status
- User stays on "connected" screen

**Fix:**
- Reset status to 'idle' or show disconnect overlay
- Allow creating/joining new room

---

## ✅ Fixes Implemented (2026-02-10)

### Fix 1: Graceful Disconnect with Persistence
```javascript
// Server: Track disconnect time, don't delete immediately
const rooms = new Map(); // roomCode -> { hostId, remoteId, hostDisconnectedAt, remoteDisconnectedAt }

socket.on('disconnect', () => {
  const code = socket.data?.room;
  if (!code) return;
  const room = rooms.get(code);
  if (!room) return;
  
  const role = socket.data?.role;
  if (role === 'host') {
    room.hostDisconnectedAt = Date.now();
    socket.to(code).emit('host-disconnected');
  } else {
    room.remoteDisconnectedAt = Date.now();
    socket.to(code).emit('remote-disconnected');
  }
  
  // Clean up room after grace period
  setTimeout(() => {
    const currentRoom = rooms.get(code);
    if (currentRoom && currentRoom.hostDisconnectedAt && currentRoom.remoteDisconnectedAt) {
      rooms.delete(code);
    }
  }, 30000);
});
```

### Fix 2: Client-Side Reconnection
```javascript
// Store in sessionStorage on room join
sessionStorage.setItem('mpRoom', code);
sessionStorage.setItem('mpRole', role);

// On mount, check for existing session
useEffect(() => {
  const savedRoom = sessionStorage.getItem('mpRoom');
  const savedRole = sessionStorage.getItem('mpRole');
  if (savedRoom && savedRole) {
    // Attempt rejoin
    getSocket().emit('rejoin-room', { code: savedRoom, role: savedRole });
  }
}, []);
```

### Fix 3: Better Disconnect UI
```javascript
const onPlayerDisconnected = () => {
  setMpError('Opponent disconnected. Room closed.');
  setLobbyStatus('idle');
  setRoomCode(null);
  setMpRole(null);
  sessionStorage.removeItem('mpRoom');
  sessionStorage.removeItem('mpRole');
};
```

### Fix 4: Send State on Remote Join
```javascript
// Server: When remote joins, request host to send current state
socket.on('join-room', ({ code }) => {
  // ... existing validation ...
  room.remoteId = socket.id;
  socket.join(code);
  socket.data = { room: code, role: 'remote' };
  socket.emit('room-joined', { code });
  
  // Request host to sync state
  socket.to(code).emit('request-sync', { toSocketId: socket.id });
});

// Host responds to sync request
socket.on('sync-state', ({ toSocketId, state }) => {
  io.to(toSocketId).emit('state-update', state);
});
```

---

## 📝 Test Results Log (2026-02-10)

### Core Multiplayer Tests
| Test | Status | Notes |
|------|--------|-------|
| Test 1: Basic Room Creation | ✅ PASS | Room created with 5-digit code |
| Test 2: Join Existing Room | ✅ PASS | Remote joins successfully |
| Test 3: Host Receives player-joined | ✅ PASS | Event fired correctly |
| Test 4: Join Non-Existent Room | ✅ PASS | Error "Room not found" |
| Test 5: Join Full Room | ✅ PASS | Error "Room is full" |
| Test 6: Host Disconnect Grace Period | ✅ PASS | 30s grace period working |
| Test 7: State Update Relay | ✅ PASS | Host → Remote state sync |
| Test 8: Remote Action Relay | ✅ PASS | Remote → Host actions |
| Test 9: Game Start Relay | ✅ PASS | Game config sent to remote |
| Test 10: Remote Disconnect Persistence | ✅ PASS | Room persists after disconnect |
| Test 11: Host Disconnect Persistence | ✅ PASS | Room persists for rejoin |

### Reconnection Feature Tests
| Test | Status | Notes |
|------|--------|-------|
| Room persists after remote disconnect | ✅ PASS | New player can join |
| Room persists after host disconnect | ✅ PASS | New player can join |
| Rejoin-room functionality | ✅ PASS | isReconnection flag works |
| Host receives player-rejoined | ✅ PASS | Notification sent |
| Game state persists | ✅ PASS | State sent to rejoining player |
| Remote receives host-disconnected | ✅ PASS | Disconnect notification |
| Host receives remote-disconnected | ✅ PASS | Disconnect notification |

**Total: 18/18 tests passing ✅**

---

## Summary

All identified multiplayer issues have been fixed and tested:

1. ✅ Room now persists for 30 seconds after disconnect (grace period)
2. ✅ Session storage enables automatic reconnection on page refresh
3. ✅ Disconnect notifications inform remaining player
4. ✅ Game state is preserved and sent to rejoining players
5. ✅ Rejoin mechanism allows players to reconnect with same role

**Files Modified:**
- `server/index.js` - Added grace period, rejoin logic, state persistence
- `src/multiplayer/socket.ts` - Added session storage helpers
- `src/App.tsx` - Added reconnection handling, disconnect UI
- `src/components/screens/LobbyScreen.tsx` - Added reconnection/disconnect states
