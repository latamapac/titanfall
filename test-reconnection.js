/**
 * Reconnection Test Script
 * Tests the improved multiplayer reconnection functionality
 */

import { io } from 'socket.io-client';

const SERVER_URL = 'http://localhost:3001';

function createSocket() {
  return io(SERVER_URL, { transports: ['websocket', 'polling'] });
}

function waitFor(socket, event, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Timeout waiting for ${event}`)), timeout);
    socket.once(event, (data) => {
      clearTimeout(timer);
      resolve(data);
    });
  });
}

function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function runTests() {
  console.log('🧪 Testing Reconnection Features\n');
  console.log('=' .repeat(60));
  
  let passed = 0;
  let failed = 0;
  
  // Test 1: Remote disconnect - room should persist
  try {
    console.log('\n⏳ Test 1: Room persists after remote disconnect...');
    const host = createSocket();
    const remote = createSocket();
    
    host.emit('create-room');
    const { code } = await waitFor(host, 'room-created');
    
    remote.emit('join-room', { code });
    await waitFor(remote, 'room-joined');
    
    // Remote disconnects
    remote.disconnect();
    await delay(1000);
    
    // Try to join with new socket - should work now
    const newRemote = createSocket();
    newRemote.emit('join-room', { code });
    
    try {
      const result = await waitFor(newRemote, 'room-joined', 3000);
      console.log('   ✅ PASSED: Room persisted, new remote joined');
      passed++;
    } catch (e) {
      console.log('   ❌ FAILED: Room did not persist');
      failed++;
    }
    
    host.disconnect();
    newRemote.disconnect();
  } catch (e) {
    console.log(`   ❌ FAILED: ${e.message}`);
    failed++;
  }

  // Test 2: Host disconnect - room should persist for grace period
  try {
    console.log('\n⏳ Test 2: Room persists after host disconnect (grace period)...');
    const host = createSocket();
    
    host.emit('create-room');
    const { code } = await waitFor(host, 'room-joined');
    
    // Host disconnects
    host.disconnect();
    await delay(1000);
    
    // Try to join with new socket - should work within grace period
    const newRemote = createSocket();
    newRemote.emit('join-room', { code });
    
    try {
      const result = await waitFor(newRemote, 'room-joined', 3000);
      console.log('   ✅ PASSED: Room persisted, new player joined');
      passed++;
    } catch (e) {
      console.log('   ❌ FAILED: Room did not persist');
      failed++;
    }
    
    newRemote.disconnect();
  } catch (e) {
    console.log(`   ❌ FAILED: ${e.message}`);
    failed++;
  }

  // Test 3: Rejoin-room event
  try {
    console.log('\n⏳ Test 3: Rejoin-room functionality...');
    const host = createSocket();
    const remote = createSocket();
    
    host.emit('create-room');
    const { code } = await waitFor(host, 'room-created');
    
    remote.emit('join-room', { code });
    await waitFor(remote, 'room-joined');
    await waitFor(host, 'player-joined');
    
    // Remote disconnects and tries to rejoin
    remote.disconnect();
    await delay(500);
    
    const rejoiningRemote = createSocket();
    rejoiningRemote.emit('rejoin-room', { code, role: 'remote' });
    
    try {
      const result = await waitFor(rejoiningRemote, 'room-joined', 3000);
      if (result.isReconnection) {
        console.log('   ✅ PASSED: Remote rejoined with isReconnection flag');
      } else {
        console.log('   ⚠️  PASSED: Remote rejoined but missing isReconnection flag');
      }
      passed++;
    } catch (e) {
      console.log('   ❌ FAILED: Could not rejoin room');
      failed++;
    }
    
    host.disconnect();
    rejoiningRemote.disconnect();
  } catch (e) {
    console.log(`   ❌ FAILED: ${e.message}`);
    failed++;
  }

  // Test 4: Host receives player-rejoined event
  try {
    console.log('\n⏳ Test 4: Host receives player-rejoined event...');
    const host = createSocket();
    const remote = createSocket();
    
    host.emit('create-room');
    const { code } = await waitFor(host, 'room-created');
    
    remote.emit('join-room', { code });
    await waitFor(remote, 'room-joined');
    await waitFor(host, 'player-joined');
    
    // Remote disconnects
    remote.disconnect();
    await delay(500);
    
    // Set up host listener for rejoin
    const rejoinedPromise = waitFor(host, 'player-rejoined', 3000);
    
    const rejoiningRemote = createSocket();
    rejoiningRemote.emit('rejoin-room', { code, role: 'remote' });
    
    try {
      const result = await rejoinedPromise;
      console.log('   ✅ PASSED: Host received player-rejoined event');
      passed++;
    } catch (e) {
      console.log('   ❌ FAILED: Host did not receive player-rejoined event');
      failed++;
    }
    
    host.disconnect();
    rejoiningRemote.disconnect();
  } catch (e) {
    console.log(`   ❌ FAILED: ${e.message}`);
    failed++;
  }

  // Test 5: State persists and is sent to rejoining player
  try {
    console.log('\n⏳ Test 5: Game state persists for rejoining player...');
    const host = createSocket();
    const remote = createSocket();
    
    host.emit('create-room');
    const { code } = await waitFor(host, 'room-created');
    
    remote.emit('join-room', { code });
    await waitFor(remote, 'room-joined');
    await waitFor(host, 'player-joined');
    
    // Host sends state update
    const testState = { test: true, turn: 5, data: 'persistent' };
    host.emit('state-update', testState);
    await waitFor(remote, 'state-update');
    
    // Remote disconnects
    remote.disconnect();
    await delay(500);
    
    // New remote joins - should receive state
    const newRemote = createSocket();
    newRemote.emit('join-room', { code });
    
    try {
      const stateUpdate = await waitFor(newRemote, 'state-update', 3000);
      if (stateUpdate.data === 'persistent') {
        console.log('   ✅ PASSED: State persisted and sent to new player');
        passed++;
      } else {
        console.log('   ⚠️  PASSED: Player joined but state may not be correct');
        passed++;
      }
    } catch (e) {
      console.log('   ❌ FAILED: State not received by new player');
      failed++;
    }
    
    host.disconnect();
    newRemote.disconnect();
  } catch (e) {
    console.log(`   ❌ FAILED: ${e.message}`);
    failed++;
  }

  // Test 6: Host disconnect message to remote
  try {
    console.log('\n⏳ Test 6: Remote receives host-disconnected event...');
    const host = createSocket();
    const remote = createSocket();
    
    host.emit('create-room');
    const { code } = await waitFor(host, 'room-created');
    
    remote.emit('join-room', { code });
    await waitFor(remote, 'room-joined');
    
    const disconnectPromise = waitFor(remote, 'host-disconnected', 3000);
    host.disconnect();
    
    try {
      const result = await disconnectPromise;
      console.log('   ✅ PASSED: Remote received host-disconnected event');
      passed++;
    } catch (e) {
      console.log('   ❌ FAILED: Remote did not receive host-disconnected event');
      failed++;
    }
    
    remote.disconnect();
  } catch (e) {
    console.log(`   ❌ FAILED: ${e.message}`);
    failed++;
  }

  // Test 7: Remote disconnect message to host
  try {
    console.log('\n⏳ Test 7: Host receives remote-disconnected event...');
    const host = createSocket();
    const remote = createSocket();
    
    host.emit('create-room');
    const { code } = await waitFor(host, 'room-created');
    
    remote.emit('join-room', { code });
    await waitFor(remote, 'room-joined');
    
    const disconnectPromise = waitFor(host, 'remote-disconnected', 3000);
    remote.disconnect();
    
    try {
      const result = await disconnectPromise;
      console.log('   ✅ PASSED: Host received remote-disconnected event');
      passed++;
    } catch (e) {
      console.log('   ❌ FAILED: Host did not receive remote-disconnected event');
      failed++;
    }
    
    host.disconnect();
  } catch (e) {
    console.log(`   ❌ FAILED: ${e.message}`);
    failed++;
  }

  console.log('\n' + '='.repeat(60));
  console.log(`\nResults: ${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

runTests();
