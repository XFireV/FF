// --- Game Data ---
document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const mapArea = document.getElementById('map-area');
  const mapInnerContent = document.getElementById('map-inner-content');
  const gameMapCanvas = document.getElementById('game-map');
  const ctx = gameMapCanvas.getContext('2d');
  const battleArea = document.getElementById('battle-area');
  const monsterNameEl = document.getElementById('monster-name');
  const monsterHpEl = document.getElementById('monster-hp');
  const playerHpEl = document.getElementById('player-hp');
  const battleLogEl = document.getElementById('battle-log');
  const attackButton = document.getElementById('attack-button');
  const fleeButton = document.getElementById('flee-button');
  const resetButton = document.getElementById('reset-game-button');

  // Resource gathering elements
  const resourceGatheringArea = document.getElementById('resource-gathering-area');
  const gatheringTitle = document.getElementById('gathering-title');
  const currentResourceName = document.getElementById('current-resource-name');
  const resourceHp = document.getElementById('resource-hp');
  const currentTool = document.getElementById('current-tool');
  const resourceGatheringCanvas = document.getElementById('resource-gathering-canvas');
  const resourceCtx = resourceGatheringCanvas.getContext('2d');
  const gatheringLog = document.getElementById('gathering-log');
  const stopGatheringButton = document.getElementById('stop-gathering-button');

  // Castle conquest elements
  const castleConquestArea = document.getElementById('castle-conquest-area');
  const castleNameEl = document.getElementById('castle-name');
  const castleOwnerEl = document.getElementById('castle-owner');
  const conquestProgressEl = document.getElementById('conquest-progress');
  const conquestTimeEl = document.getElementById('conquest-time');
  const castleLogEl = document.getElementById('castle-log');
  const startConquestButton = document.getElementById('start-conquest-button');
  const stopConquestButton = document.getElementById('stop-conquest-button');
  const leaveCastleButton = document.getElementById('leave-castle-button');

  // Name and class modals
  const nameModal = document.getElementById('name-modal');
  const playerNameInput = document.getElementById('player-name-input');
  const startGameButton = document.getElementById('start-game-button');
  const classModal = document.getElementById('class-modal');
  const classOptions = document.querySelectorAll('.class-option');
  const selectClassButton = document.getElementById('select-class-button');
  const cancelClassButton = document.getElementById('cancel-class-button');
  const chooseClassButton = document.getElementById('choose-class-button');
  const classSelectionArea = document.getElementById('class-selection-area');

  // Global events
  const globalEventsBanner = document.getElementById('global-events-banner');
  const eventText = document.getElementById('event-text');
  const closeEventButton = document.getElementById('close-event-button');

  // Player stats elements
  const playerNameDisplay = document.getElementById('player-name-display');
  const playerHpText = document.getElementById('player-hp-text');
  const playerHpFill = document.getElementById('player-hp-fill');
  const playerLevel = document.getElementById('player-level');
  const playerXp = document.getElementById('player-xp');
  const playerXpNeeded = document.getElementById('player-xp-needed');
  const playerGold = document.getElementById('player-gold');

  // --- Game State ---
  let gameState = {
    player: {
      name: '',
      class: '',
      level: 1,
      hp: 100,
      maxHp: 100,
      xp: 0,
      xpNeeded: 100,
      gold: 0,
      x: 400,
      y: 300,
      attack: [10, 20],
      defense: 5
    },
    currentScreen: 'map',
    currentMonster: null,
    currentResource: null,
    currentCastle: null,
    gatheringInterval: null,
    conquestInterval: null,
    globalEvents: []
  };

  // --- Game Classes ---
  const gameClasses = {
    warrior: {
      name: 'Warrior',
      maxHp: 120,
      attack: [15, 25],
      defense: 8
    },
    mage: {
      name: 'Mage',
      maxHp: 80,
      attack: [20, 30],
      defense: 4
    },
    rogue: {
      name: 'Rogue',
      maxHp: 100,
      attack: [12, 22],
      defense: 6
    }
  };

  // --- Monsters ---
  const monsters = [
    { name: 'Goblin', hp: 50, maxHp: 50, attack: [8, 15], xp: 25, gold: 10 },
    { name: 'Orc', hp: 80, maxHp: 80, attack: [12, 20], xp: 40, gold: 20 },
    { name: 'Troll', hp: 120, maxHp: 120, attack: [15, 25], xp: 60, gold: 35 },
    { name: 'Dragon', hp: 200, maxHp: 200, attack: [25, 40], xp: 100, gold: 75 }
  ];

  // --- Resources ---
  const resources = [
    { name: 'Iron Ore', hp: 100, maxHp: 100, tool: 'Pickaxe', reward: 'Iron', amount: [3, 8] },
    { name: 'Oak Tree', hp: 150, maxHp: 150, tool: 'Axe', reward: 'Wood', amount: [5, 12] },
    { name: 'Gold Vein', hp: 200, maxHp: 200, tool: 'Pickaxe', reward: 'Gold', amount: [10, 25] },
    { name: 'Magic Crystal', hp: 80, maxHp: 80, tool: 'Staff', reward: 'Mana Crystal', amount: [1, 3] }
  ];

  // --- Castles ---
  const castles = [
    { name: 'Abandoned Fort', owner: 'None', conquestTime: 30, reward: 100 },
    { name: 'Bandit Stronghold', owner: 'Bandits', conquestTime: 60, reward: 250 },
    { name: 'Ancient Citadel', owner: 'Dark Lord', conquestTime: 120, reward: 500 }
  ];

  // --- Utility Functions ---
  function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function rollDamage(attackRange) {
    return random(attackRange[0], attackRange[1]);
  }

  function updatePlayerStats() {
    playerNameDisplay.textContent = gameState.player.name;
    playerHpText.textContent = `${gameState.player.hp}/${gameState.player.maxHp}`;
    playerHpFill.style.width = `${(gameState.player.hp / gameState.player.maxHp) * 100}%`;
    playerLevel.textContent = gameState.player.level;
    playerXp.textContent = gameState.player.xp;
    playerXpNeeded.textContent = gameState.player.xpNeeded;
    playerGold.textContent = gameState.player.gold;
  }

  function gainXp(amount) {
    gameState.player.xp += amount;
    if (gameState.player.xp >= gameState.player.xpNeeded) {
      levelUp();
    }
    updatePlayerStats();
  }

  function levelUp() {
    gameState.player.level++;
    gameState.player.xp -= gameState.player.xpNeeded;
    gameState.player.xpNeeded = Math.floor(gameState.player.xpNeeded * 1.5);
    
    // Increase stats
    const hpIncrease = random(8, 15);
    gameState.player.maxHp += hpIncrease;
    gameState.player.hp += hpIncrease;
    
    showGlobalEvent(`🎉 Level Up! You are now level ${gameState.player.level}! (+${hpIncrease} HP)`);
  }

  function showGlobalEvent(message) {
    eventText.textContent = message;
    globalEventsBanner.classList.remove('hidden');
    setTimeout(() => {
      globalEventsBanner.classList.add('hidden');
    }, 5000);
  }

  // --- Screen Management ---
  function showScreen(screen) {
    // Hide all screens
    mapArea.classList.add('hidden');
    battleArea.classList.add('hidden');
    resourceGatheringArea.classList.add('hidden');
    castleConquestArea.classList.add('hidden');

    // Show selected screen
    switch(screen) {
      case 'map':
        mapArea.classList.remove('hidden');
        gameState.currentScreen = 'map';
        drawMap();
        break;
      case 'battle':
        battleArea.classList.remove('hidden');
        gameState.currentScreen = 'battle';
        break;
      case 'gathering':
        resourceGatheringArea.classList.remove('hidden');
        gameState.currentScreen = 'gathering';
        break;
      case 'castle':
        castleConquestArea.classList.remove('hidden');
        gameState.currentScreen = 'castle';
        break;
    }
  }

  // --- Map System ---
  function drawMap() {
    ctx.clearRect(0, 0, gameMapCanvas.width, gameMapCanvas.height);
    
    // Draw background
    ctx.fillStyle = '#4a7c59';
    ctx.fillRect(0, 0, gameMapCanvas.width, gameMapCanvas.height);
    
    // Draw grid
    ctx.strokeStyle = '#3a5f47';
    ctx.lineWidth = 1;
    for (let x = 0; x < gameMapCanvas.width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, gameMapCanvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < gameMapCanvas.height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(gameMapCanvas.width, y);
      ctx.stroke();
    }
    
    // Draw monsters
    ctx.fillStyle = '#8b0000';
    for (let i = 0; i < 5; i++) {
      const x = random(50, gameMapCanvas.width - 50);
      const y = random(50, gameMapCanvas.height - 50);
      ctx.fillRect(x - 10, y - 10, 20, 20);
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Arial';
      ctx.fillText('M', x - 6, y + 4);
      ctx.fillStyle = '#8b0000';
    }
    
    // Draw resources
    ctx.fillStyle = '#8b4513';
    for (let i = 0; i < 4; i++) {
      const x = random(50, gameMapCanvas.width - 50);
      const y = random(50, gameMapCanvas.height - 50);
      ctx.fillRect(x - 8, y - 8, 16, 16);
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Arial';
      ctx.fillText('R', x - 6, y + 4);
      ctx.fillStyle = '#8b4513';
    }
    
    // Draw castles
    ctx.fillStyle = '#696969';
    for (let i = 0; i < 3; i++) {
      const x = random(100, gameMapCanvas.width - 100);
      const y = random(100, gameMapCanvas.height - 100);
      ctx.fillRect(x - 15, y - 15, 30, 30);
      ctx.fillStyle = '#ffffff';
      ctx.font = '14px Arial';
      ctx.fillText('C', x - 7, y + 5);
      ctx.fillStyle = '#696969';
    }
    
    // Draw player
    ctx.fillStyle = '#0066cc';
    ctx.fillRect(gameState.player.x - 8, gameState.player.y - 8, 16, 16);
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.fillText('P', gameState.player.x - 6, gameState.player.y + 4);
  }

  // --- Battle System ---
  function startBattle(monster) {
    gameState.currentMonster = { ...monster };
    monsterNameEl.textContent = monster.name;
    updateMonsterHp();
    updatePlayerHp();
    battleLogEl.innerHTML = `<p>A wild ${monster.name} appears!</p>`;
    showScreen('battle');
  }

  function updateMonsterHp() {
    const monster = gameState.currentMonster;
    monsterHpEl.textContent = `${monster.hp}/${monster.maxHp}`;
    const monsterHpFill = document.getElementById('monster-hp-fill');
    monsterHpFill.style.width = `${(monster.hp / monster.maxHp) * 100}%`;
  }

  function updatePlayerHp() {
    playerHpEl.textContent = `${gameState.player.hp}/${gameState.player.maxHp}`;
  }

  function addBattleLog(message) {
    const p = document.createElement('p');
    p.textContent = message;
    battleLogEl.appendChild(p);
    battleLogEl.scrollTop = battleLogEl.scrollHeight;
  }

  function playerAttack() {
    const damage = rollDamage(gameState.player.attack);
    gameState.currentMonster.hp = Math.max(0, gameState.currentMonster.hp - damage);
    addBattleLog(`You deal ${damage} damage to the ${gameState.currentMonster.name}!`);
    updateMonsterHp();
    
    if (gameState.currentMonster.hp <= 0) {
      // Monster defeated
      const xpGain = gameState.currentMonster.xp;
      const goldGain = gameState.currentMonster.gold;
      gameState.player.gold += goldGain;
      addBattleLog(`${gameState.currentMonster.name} defeated! You gain ${xpGain} XP and ${goldGain} gold!`);
      gainXp(xpGain);
      setTimeout(() => showScreen('map'), 2000);
      return;
    }
    
    // Monster attacks back
    setTimeout(monsterAttack, 1000);
  }

  function monsterAttack() {
    const damage = Math.max(1, rollDamage(gameState.currentMonster.attack) - gameState.player.defense);
    gameState.player.hp = Math.max(0, gameState.player.hp - damage);
    addBattleLog(`The ${gameState.currentMonster.name} deals ${damage} damage to you!`);
    updatePlayerHp();
    updatePlayerStats();
    
    if (gameState.player.hp <= 0) {
      addBattleLog('You have been defeated! Game Over!');
      setTimeout(() => {
        alert('Game Over! Click Reset to play again.');
      }, 1000);
    }
  }

  function fleeBattle() {
    if (Math.random() < 0.7) {
      addBattleLog('You successfully fled from battle!');
      setTimeout(() => showScreen('map'), 1000);
    } else {
      addBattleLog('You failed to flee!');
      setTimeout(monsterAttack, 1000);
    }
  }

  // --- Resource Gathering System ---
  function startResourceGathering(resource) {
    gameState.currentResource = { ...resource };
    gatheringTitle.textContent = `Gathering ${resource.name}`;
    currentResourceName.textContent = resource.name;
    currentTool.textContent = resource.tool;
    updateResourceHp();
    gatheringLog.innerHTML = `<p>You begin gathering ${resource.name} with your ${resource.tool}...</p>`;
    showScreen('gathering');
    
    drawResourceGathering();
    
    gameState.gatheringInterval = setInterval(() => {
      const damage = random(10, 20);
      gameState.currentResource.hp = Math.max(0, gameState.currentResource.hp - damage);
      updateResourceHp();
      addGatheringLog(`You gather some ${gameState.currentResource.name}...`);
      
      if (gameState.currentResource.hp <= 0) {
        const rewardAmount = random(...gameState.currentResource.amount);
        addGatheringLog(`Resource depleted! You collected ${rewardAmount} ${gameState.currentResource.reward}!`);
        
        if (gameState.currentResource.reward === 'Gold') {
          gameState.player.gold += rewardAmount;
          updatePlayerStats();
        }
        
        clearInterval(gameState.gatheringInterval);
        setTimeout(() => showScreen('map'), 2000);
      }
    }, 1500);
  }

  function updateResourceHp() {
    const resource = gameState.currentResource;
    resourceHp.textContent = `${resource.hp}/${resource.maxHp}`;
    const resourceHpFill = document.getElementById('resource-hp-fill');
    resourceHpFill.style.width = `${(resource.hp / resource.maxHp) * 100}%`;
  }

  function addGatheringLog(message) {
    const p = document.createElement('p');
    p.textContent = message;
    gatheringLog.appendChild(p);
    gatheringLog.scrollTop = gatheringLog.scrollHeight;
  }

  function drawResourceGathering() {
    resourceCtx.clearRect(0, 0, resourceGatheringCanvas.width, resourceGatheringCanvas.height);
    
    // Draw resource
    resourceCtx.fillStyle = '#8b4513';
    resourceCtx.fillRect(150, 100, 100, 100);
    resourceCtx.fillStyle = '#ffffff';
    resourceCtx.font = '16px Arial';
    resourceCtx.fillText(gameState.currentResource.name, 160, 160);
    
    // Draw tool animation
    const time = Date.now() / 500;
    const toolX = 100 + Math.sin(time) * 20;
    const toolY = 120 + Math.cos(time) * 10;
    
    resourceCtx.fillStyle = '#654321';
    resourceCtx.fillRect(toolX, toolY, 40, 10);
  }

  function stopResourceGathering() {
    if (gameState.gatheringInterval) {
      clearInterval(gameState.gatheringInterval);
      gameState.gatheringInterval = null;
    }
    showScreen('map');
  }

  // --- Castle Conquest System ---
  function startCastleConquest(castle) {
    gameState.currentCastle = { ...castle, progress: 0, timeElapsed: 0 };
    castleNameEl.textContent = castle.name;
    castleOwnerEl.textContent = castle.owner;
    updateConquestProgress();
    castleLogEl.innerHTML = `<p>You approach ${castle.name}...</p>`;
    showScreen('castle');
  }

  function beginConquest() {
    if (gameState.conquestInterval) return;
    
    addCastleLog('You begin the conquest!');
    gameState.conquestInterval = setInterval(() => {
      gameState.currentCastle.timeElapsed++;
      gameState.currentCastle.progress = (gameState.currentCastle.timeElapsed / gameState.currentCastle.conquestTime) * 100;
      updateConquestProgress();
      
      if (gameState.currentCastle.progress >= 100) {
        gameState.player.gold += gameState.currentCastle.reward;
        addCastleLog(`Conquest complete! You earned ${gameState.currentCastle.reward} gold!`);
        updatePlayerStats();
        clearInterval(gameState.conquestInterval);
        gameState.conquestInterval = null;
        setTimeout(() => showScreen('map'), 2000);
      }
    }, 1000);
  }

  function stopConquest() {
    if (gameState.conquestInterval) {
      clearInterval(gameState.conquestInterval);
      gameState.conquestInterval = null;
      addCastleLog('Conquest stopped.');
    }
  }

  function updateConquestProgress() {
    const castle = gameState.currentCastle;
    conquestProgressEl.textContent = `${Math.floor(castle.progress)}%`;
    conquestTimeEl.textContent = `${castle.timeElapsed}s`;
  }

  function addCastleLog(message) {
    const p = document.createElement('p');
    p.textContent = message;
    castleLogEl.appendChild(p);
    castleLogEl.scrollTop = castleLogEl.scrollHeight;
  }

  // --- Class Selection ---
  function selectClass(className) {
    const selectedClass = gameClasses[className];
    gameState.player.class = className;
    gameState.player.maxHp = selectedClass.maxHp;
    gameState.player.hp = selectedClass.maxHp;
    gameState.player.attack = selectedClass.attack;
    gameState.player.defense = selectedClass.defense;
    updatePlayerStats();
    classModal.classList.add('hidden');
    showGlobalEvent(`You are now a ${selectedClass.name}!`);
  }

  // --- Event Listeners ---
  
  // Name input
  startGameButton.addEventListener('click', () => {
    const name = playerNameInput.value.trim();
    if (name) {
      gameState.player.name = name;
      nameModal.classList.add('hidden');
      classModal.classList.remove('hidden');
      updatePlayerStats();
    }
  });

  playerNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      startGameButton.click();
    }
  });

  // Class selection
  classOptions.forEach(option => {
    option.addEventListener('click', () => {
      classOptions.forEach(opt => opt.classList.remove('selected'));
      option.classList.add('selected');
      selectClassButton.disabled = false;
      selectClassButton.dataset.class = option.dataset.class;
    });
  });

  selectClassButton.addEventListener('click', () => {
    const className = selectClassButton.dataset.class;
    if (className) {
      selectClass(className);
    }
  });

  cancelClassButton.addEventListener('click', () => {
    classModal.classList.add('hidden');
  });

  chooseClassButton.addEventListener('click', () => {
    classModal.classList.remove('hidden');
  });

  // Map interactions
  gameMapCanvas.addEventListener('click', (e) => {
    if (gameState.currentScreen !== 'map') return;
    
    const rect = gameMapCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Move player
    gameState.player.x = x;
    gameState.player.y = y;
    drawMap();
    
    // Check for encounters
    if (Math.random() < 0.3) {
      const monster = monsters[random(0, monsters.length - 1)];
      startBattle(monster);
    } else if (Math.random() < 0.2) {
      const resource = resources[random(0, resources.length - 1)];
      startResourceGathering(resource);
    } else if (Math.random() < 0.1) {
      const castle = castles[random(0, castles.length - 1)];
      startCastleConquest(castle);
    }
  });

  // Battle controls
  attackButton.addEventListener('click', playerAttack);
  fleeButton.addEventListener('click', fleeBattle);

  // Resource gathering controls
  stopGatheringButton.addEventListener('click', stopResourceGathering);

  // Castle conquest controls
  startConquestButton.addEventListener('click', beginConquest);
  stopConquestButton.addEventListener('click', stopConquest);
  leaveCastleButton.addEventListener('click', () => showScreen('map'));

  // Global events
  closeEventButton.addEventListener('click', () => {
    globalEventsBanner.classList.add('hidden');
  });

  // Reset game
  resetButton.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset the game?')) {
      location.reload();
    }
  });

  // --- Initialize Game ---
  function initGame() {
    showScreen('map');
    updatePlayerStats();
    
    // Show name modal if no name set
    if (!gameState.player.name) {
      nameModal.classList.remove('hidden');
    }
  }

  // Start the game
  initGame();
});