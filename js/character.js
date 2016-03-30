/**
 * Created by Zsolt Deák 2016.03
 *
 * Controls game dynamics
 */
var maxHP;

function Character() {
    this.attackPower = 10;
    this.defensePower = 8;
    this.healthPoint = 150;
    maxHP = this.healthPoint;
    this.experience = 0;
    this.level = 1;
    this.fail = fail;
    this.reward = reward;
    this.fight = fight;
    this.xpToLevelUp = xpToLevelUp;
    this.npcXpGain = npcXpGain;
    this.refreshDiv = refreshCharacterDataDiv;
}

function levelUp() {
    this.attackPower += 2;
	this.defensePower += 1;
	maxHP += 20;
    this.healthPoint = maxHP;
	this.experience = 0;
	this.level++;
}

function xpToLevelUp() {
    if( this.level < 11 ) {
			if( ( this.experience - ( 40 * this.level * this.level ) +
                            ( 360 * this.level ) ) <= 0 ) {		
				this.experience -= ( 40 * this.level * this.level ) + ( 360 * this.level );
				this.experience += 2 * this.experience;
				this.levelUp();
            }				
	}
		
    if( this.level >= 11 ) {
        if( ( this.experience - ( 0.4 * this.level * this.level * this.level )
                + ( 40 * this.level * this.level ) + ( 396 * this.level ) ) <= 0 ){
            this.experience -= ( 0.4 * this.level*this.level * this.level )
                + ( 40 * this.level * this.level ) + ( 396 * this.level );
            this.experience += this.experience * 2;
            this.levelUp();
        }
    }
}

function fail() {
    var gain = this.level + 5;
    this.experience += gain;
    this.xpToLevelUp();
    return gain;
}

function reward() {
    var gain = ( this.level * 4 ) + 45;
    this.experience += gain;
    this.xpToLevelUp();
    return gain;
}

function fight( actEnemy ) {
    //enemy is too strong
    if(actEnemy.defensePower >= this.attackPower){
        contentDiv.textContent = "Rhonin's opponent proved to be much more powerful than him " + 
                "luckily he could escape before got killed, as he realized the differences.\n"
                + "He lost " + this.healthPoint / 2 + " health points.";
        this.healthPoint -= this.healthPoint/2;
        
    //opposit
    }else if(this.defensePower >= actEnemy.attackPower){
        contentDiv.textContent = "Rhonin was so much stronger, the opponent didn't cause any trouble to him.\n";
        var xpGain = this.npcXpGain(actEnemy);
        contentDiv.textContent += "He gain " + xpGain + " experience";
    }
    
    //others
    else {
        var playerDmg = this.attackPower - actEnemy.defensePower;
        var oppDmg = actEnemy.attackPower - this.defensePower;
        contentDiv.textContent = "";
        while( ( ( actEnemy.healthPoint -= playerDmg ) > 0 ) && ( ( this.healthPoint -= oppDmg ) > 0 ) ) {
            contentDiv.textContent += "His opponent damaged him: -"  + oppDmg + " health point\n";
            contentDiv.textContent += "Rhonin attacked: " + playerDmg + " damages\n";			
        }
        //player died
        if(this.healthPoint <= 0){
            contentDiv.textContent += "Rhonin died, the game is lost\n";
            character = new Character();
            episode = 1;
        //player survived
        }else{
            
            contentDiv.textContent += "Rhonin won\n";
            var xpGain = this.npcXpGain(actEnemy);
            contentDiv.textContent += "Gained " + xpGain + " experiences";        
        }
        
    }
}

function npcXpGain( actEnemy ){
		var base = this.level * 5 + 45;	
		if( this.level >= actEnemy.level ){
			this.experience += base;
			this.xpToLevelUp();
			return base;
		} else {
			this.experience += base * (actEnemy.level - this.level);
			this.xpToLevelUp();
			return base * (actEnemy.level - this.level);
		}
}

function refreshCharacterDataDiv( div ) {
    div.textContent = "Attack power: " + this.attackPower + "\n" +
                    "Defense power: " + this.defensePower + "\n" +
                    "Health point: " + this.healthPoint + "\n" +
                    "Level: " + this.level + "\n" +
                    "Experience: " + this.experience;
}