// Main game variables
let xp = 0;  // Player's experience points
let health = 100;  // Player's starting health
let gold = 50;  // Player's starting gold
let currentWeapon = 0;  // Index for the player's current weapon in the weapons array
let fighting;  // Index of the current monster being fought in the monsters array
let monsterHealth;  // Health of the current monster
let inventory = ["stick"];  // Weapons that the player currently has

// Selecting various HTML elements for game interactions
const button1 = document.querySelector('#button1');
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");

// list of weapons player can use
const weapons = [
  { name: 'stick', power: 5 },
  { name: 'dagger', power: 30 },
  { name: 'claw hammer', power: 50 },
  { name: 'sword', power: 100 }
];

// List of monsters the player can fight. Only the dragon needs to be defeated to win the game.
// Fighting the other monsters increases gold and XP.
const monsters = [
  {
    name: "slime",
    level: 2,
    health: 15
  },
  {
    name: "fanged beast",
    level: 8,
    health: 60
  },
  {
    name: "dragon",
    level: 20,
    health: 300
  }
]

// List of location objects used in the update function to set button labels, button click events, and bottom text.
const locations = [
  {
    name: "town square",
    "button text": ["Go to store", "Go to cave", "Fight dragon"],
    "button functions": [goStore, goCave, fightDragon],
    text: "You are in the town square. You see a sign that says \"Store\"."
  },
  {
    name: "store",
    "button text": ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Go to town square"],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "You enter the store."
  },
  {
    name: "cave",
    "button text": ["Fight slime", "Fight fanged beast", "Go to town square"],
    "button functions": [fightSlime, fightBeast, goTown],
    text: "You enter the cave. You see some monsters."
  },
  {
    name: "fight",
    "button text": ["Attack", "Dodge", "Run"],
    "button functions": [attack, dodge, goTown],
    text: "You are fighting a monster."
  },
  {
    name: "kill monster",
    "button text": ["Go to town square", "Go to town square", "Go to town square"],
    "button functions": [goTown, goTown, goTown],
    text: 'The monster screams "Arg!" as it dies. You gain experience points and find gold.'
  },
  {
    name: "lose",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
    "button functions": [restart, restart, restart],
    text: "You die. &#x2620;"
  },
  { 
    name: "win", 
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"], 
    "button functions": [restart, restart, restart], 
    text: "You defeat the dragon! YOU WIN THE GAME! &#x1F389;" 
  },
  {
    name: "easter egg",
    "button text": ["2", "8", "Go to town square?"],
    "button functions": [pickTwo, pickEight, goTown],
    text: "You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!"
  }
];

// initialize buttons when the game starts 
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

// it'll take an object from locations array and update the button label , button click event and bottom text
function update(location) {
  monsterStats.style.display = "none";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerHTML = location.text;
}
// Triggered when player want to go to the town square location  
function goTown() {
  update(locations[0]); //update the game state to show the town square location
}
// Triggered when player want to go to the store location 
function goStore() {
  update(locations[1]); //update the game state to show the store location
}
// triggered when player want to the cave location 
function goCave() {
  update(locations[2]); // update the game state to show the cave location 
}
// triggered when the player want to buy health
function buyHealth() {
  if (gold >= 10) {
    gold -= 10;
    health += 10;
    goldText.innerText = gold;
    healthText.innerText = health;
  } else {
    text.innerText = "You do not have enough gold to buy health.";
  }
}
// triggred when player want to buy weapon
// each weapon will cost 30 gold 
function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeapon++;
      goldText.innerText = gold;
      let newWeapon = weapons[currentWeapon].name;
      text.innerText = "You now have a " + newWeapon + ".";
      inventory.push(newWeapon);
      text.innerText += " In your inventory you have: " + inventory;
    } else {
      text.innerText = "You do not have enough gold to buy a weapon.";
    }
  } else {
    text.innerText = "You already have the most powerful weapon!";
    button2.innerText = "Sell weapon for 15 gold";
    button2.onclick = sellWeapon;
  }
}
// triggred when player want to sell weapon
// each weapon can be sold for 15 gold
function sellWeapon() {
  if (inventory.length > 1) { // player must be have at least one weapon in it's inventory
    gold += 15;
    goldText.innerText = gold;
    let currentWeapon = inventory.shift();
    text.innerText = "You sold a " + currentWeapon + ".";
    text.innerText += " In your inventory you have: " + inventory;
  } else {
    text.innerText = "Don't sell your only weapon!";
  }
}

function fightSlime() {
  fighting = 0;
  goFight();
}

function fightBeast() {
  fighting = 1;
  goFight();
}

function fightDragon() {
  fighting = 2;
  goFight();
}

function goFight() {
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block"; // this will show name and health of current monster the player is fighting
  monsterName.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsterHealth;
}

function attack() {
  // Display the monster's attack message
  text.innerText = "The " + monsters[fighting].name + " attacks.";
  // Display the player's attack message, mentioning the current weapon
  text.innerText += " You attack it with your " + weapons[currentWeapon].name + ".";

  // Decrease player's health based on the monster's level-based attack value
  health -= getMonsterAttackValue(monsters[fighting].level);

  // Check if the player's attack hits the monster
  if (isMonsterHit()) {
    // Calculate damage to monster's health using weapon power, XP, and random factor
    monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
  } else {
    // Display a miss message if the attack did not hit the monster
    text.innerText += " You miss.";
  }

  // Update the displayed health of the player and the monster after the attack
  healthText.innerText = health;
  monsterHealthText.innerText = monsterHealth;

  // Check if the player has lost all health
  if (health <= 0) {
    lose();  // Trigger lose condition if player's health reaches 0 or below
  } 
  // Check if the monster has been defeated
  else if (monsterHealth <= 0) {
    // If the monster is the specific target (e.g., the main boss), trigger win condition
    if (fighting === 2) {
      winGame();
    } else {
      // Otherwise, count it as a regular monster defeat
      defeatMonster();
    }
  }

  // Random chance (10%) for the player's weapon to break if the player has more than one weapon
  if (Math.random() <= 0.1 && inventory.length > 1) {
    // Display message that the current weapon breaks and remove it from inventory
    text.innerText += " Your " + inventory.pop() + " breaks.";
    currentWeapon--;  // Move to the previous weapon in the inventory
  }
}

function getMonsterAttackValue(level) {
  const hit = (level * 5) - (Math.floor(Math.random() * xp)); // more the player xp value less chance of getting big hit
  console.log(hit);
  return hit > 0 ? hit : 0; // to check whether hit value is -ve , if it's return hit to 0
}

function isMonsterHit() {
  return Math.random() > .2 || health < 20;
}

function dodge() {
  text.innerText = "You dodge the attack from the " + monsters[fighting].name;
}

function defeatMonster() {
  gold += Math.floor(monsters[fighting].level * 6.7);
  xp += monsters[fighting].level;
  goldText.innerText = gold;
  xpText.innerText = xp;
  update(locations[4]);
}

function lose() {
  update(locations[5]);
}

function winGame() {
  update(locations[6]);
}

function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["stick"];
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = xp;
  goTown();
}

function easterEgg() {
  update(locations[7]);
}

function pickTwo() {
  pick(2);
}

function pickEight() {
  pick(8);
}

function pick(guess) {
  const numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }
  text.innerText = "You picked " + guess + ". Here are the random numbers:\n";
  for (let i = 0; i < 10; i++) {
    text.innerText += numbers[i] + "\n";
  }
  if (numbers.includes(guess)) {
    text.innerText += "Right! You win 20 gold!";
    gold += 20;
    goldText.innerText = gold;
  } else {
    text.innerText += "Wrong! You lose 10 health!";
    health -= 10;
    healthText.innerText = health;
    if (health <= 0) {
      lose();
    }
  }
}