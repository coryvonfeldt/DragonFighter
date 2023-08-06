let xp = 0;
let vitality = 100;
let gold = 50;
let currentWeapon = 0;
let inventory = ['stick'];
let fighting;
let monsterHealth;

const weapons = [
    {
        name: 'stick',
        damage: 5
    },
    {
        name: 'dagger',
        damage: 20
    },
    {
        name: 'bow',
        damage: 35
    },
    {
        name: 'mace',
        damage: 60
    },
    {
        name: 'sword',
        damage: 75
    }
];


const monsters = [
    {
        name: 'Ghoul',
        level: 5,
        health: 20
    },
    {
        name: 'Troll',
        level: 30,
        health: 100
    },
    {
        name: 'Dragon',
        level: 60,
        health: 700
    }
]


const button1 = document.querySelector('.button1');
const button2 = document.querySelector('.button2');
const button3 = document.querySelector('.button3');
const xpText = document.querySelector('.xpText');
const vitalityText = document.querySelector('.vitalityText');
const goldText = document.querySelector('.goldText');
const gameText = document.querySelector('.gameText');
const monsterStats = document.querySelector('.monsterStats');
const monsterNameText = document.querySelector('.monsterNameText');
const monsterHealthText = document.querySelector('.monsterHealthText');


const locations = [
    {
        name: 'town square',
        buttonText: ['Go to store', 'Go to cave', 'Fight dragon'],
        buttonFunction: [goToStore, goToCave, fightDragon],
        text: `You are in the town square.`
    },
    {
        name: 'store',
        buttonText: ['Buy potion', 'Buy weapon', 'Leave store'],
        buttonFunction: [buyPotion, buyWeapon, goToTownSquare],
        text: 'Welcome to the store! You can buy health potions for 25 gold, or weapons for 50 gold.'
    },
    {
        name: 'cave',
        buttonText: ['Fight ghoul', 'Fight troll', 'Leave Cave'],
        buttonFunction: [fightGhoul, fightTroll, goToTownSquare],
        text: 'You are in the cave. Watch out for monsters!'
    },
    {
        name: 'fighting monster',
        buttonText: ['Attack', 'Dodge', 'Run'],
        buttonFunction: [attack, dodge, goToTownSquare],
        text: `You are fighting a monster. Be careful!`
    },
    {
        name: 'defeat monster',
        buttonText: ['Leave cave', 'Stay in cave', 'Stay in cave'],
        buttonFunction: [goToTownSquare, goToCave, goToCave],
        text: 'The monster writhes around as it dies. You have gained gold and experience points. You can leave the cave and go back to town, or fight more monsters in the cave.'
    },
    {
        name: 'game over',
        buttonText: ['Try again', 'Try again', 'Try again'],
        buttonFunction: [restart, restart, restart],
        text: 'You died. Would you like to try again?'
    },
    {
        name: 'win game',
        buttonText: ['Play again', 'Play again', 'Play again'],
        buttonFunction: [goToTownSquare, goToTownSquare, goToTownSquare],
        text: `You have defeated the dragon and saved the town! Would you like to play again?`
    }
]



function update (location) {
    monsterStats.style.display = 'none';
    button1.innerHTML = location.buttonText[0];
    button2.innerHTML = location.buttonText[1];
    button3.innerHTML = location.buttonText[2];
    button1.onclick = location.buttonFunction[0];
    button2.onclick = location.buttonFunction[1];
    button3.onclick = location.buttonFunction[2];
    gameText.innerHTML = location.text;
}



function goToTownSquare () {
    update(locations[0]);
}


function goToStore () {
    update(locations[1]);
}

button1.onclick = goToStore




/* In store functions */

function buyPotion () {
    if (gold >= 25) {
        gold -= 25;
        vitality += 10;
        goldText.innerHTML = `Gold: ${gold}`;
        vitalityText.innerHTML = `Vitality: ${vitality}`;
        gameText.innerHTML = `Thank you for purchasing a health potion! Your health increased by 10.`;
    } else {
        gameText.innerHTML = `You need at least 25 gold to purchase a health potion.`;
    }
}

function buyWeapon () {
    if (currentWeapon < weapons.length - 1) {
        if (gold >= 50) {
            gold -= 50;
            currentWeapon++;
            let newWeapon = weapons[currentWeapon].name;
            inventory.push(newWeapon);
            goldText.innerHTML = `Gold: ${gold}`;
            gameText.innerHTML = `You have purchased a ${newWeapon}! In your inventory, you have a: ${inventory.join(', ')}`
        } else {
            gameText.innerHTML = 'You need at least 50 gold to purchase a new weapon.'
        }
    } else {
        gameText.innerHTML = 'You already have the best weapon in the game. You can sell your weaker weapons for 15 gold each.';
        button2.innerHTML = 'Sell weapon';
        button2.onclick = sellWeapon;
    }
}

function sellWeapon () {
    if (inventory.length > 1) {
    gold += 15;
    let soldWeapon = inventory[0];
    inventory.shift();
    goldText.innerHTML = `Gold: ${gold}`;
    gameText.innerHTML = `You have sold your ${soldWeapon} for 15 gold. In your inventory, you have a: ${inventory.join(', ')}`
    } else {
        gameText.innerHTML = `You only have a sword in your inventory. Don't sell your only weapon!`
    }
}



/* Fighting functions */

function goToCave () {
    update(locations[2]);
}

button2.onclick = goToCave;



function goFight () {
    update(locations[3])
    monsterStats.style.display = 'flex';
    monsterNameText.innerHTML = `Monster name: ${monsters[fighting].name}`;
    monsterHealthText.innerHTML = `Monster health: ${monsters[fighting].health}`
    monsterHealth = monsters[fighting].health;
}


function fightGhoul () {
    fighting = 0;
    goFight()
}

function fightTroll () {
    fighting = 1;
    goFight()
}

function fightDragon () {
    fighting = 2;
    goFight()
}

button3.onclick = fightDragon;


function attack () {
    vitality -= monsters[fighting].level;
    let damageDone = weapons[currentWeapon].damage + Math.floor((Math.random () * xp) + 1);
    monsterHealth -= damageDone;
    if (vitality > 0 && monsterHealth > 0) {
        vitalityText.innerHTML = `Vitality: ${vitality}`;
        monsterHealthText.innerHTML = `Monster health: ${monsterHealth}`;
        gameText.innerHTML = `The ${monsters[fighting].name} attacked you for ${monsters[fighting].level} damage. You attacked back and did ${damageDone} damage to the ${monsters[fighting].name}.`;
    } else if (vitality > 0 && monsterHealth <= 0 ) {
        monsterHealth.innerHTML = `Monster health: 0`;
        vitalityText.innerHTML = `Vitality: ${vitality}`
        fighting === 2 ? winGame() : defeatMonster()
    } else if (vitality <= 0) {
        loseGame()
    }
}

function defeatMonster () {
    xp += monsters[fighting].level;
    gold += Math.floor(monsters[fighting].level * 4.7);
    xpText.innerHTML = `XP: ${xp}`;
    goldText.innerHTML = `Gold: ${gold}`;
    update(locations[4]);
}

function dodge () {
    gameText.innerHTML = `You dodged the ${monsters[fighting].name}'s attack.`
}

function loseGame () {
    vitalityText.innerHTML = `Vitality: 0`
    update(locations[5]);
}

function restart () {
     xp = 0;
     vitality = 100;
     gold = 50;
     xpText.innerHTML = `XP: 0`;
     vitalityText.innerHTML = `Vitality: 100`;
     goldText.innerHTML = `Gold: 50`;
     currentWeapon = 0;
     inventory = ['stick'];
     fighting;
     monsterHealth;
     update(locations[0]);
}

function winGame() {
    gold += 1000;
    xp += 300;
    goldText.innerHTML = `Gold: ${gold}`;
    xpText.innerHTML = `XP: ${xp};`
    update(locations[6]);
}