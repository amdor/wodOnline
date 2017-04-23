package com.onlab.utils;

import com.onlab.entities.Answer;
import com.onlab.entities.Npc;
import com.onlab.entities.Player;
import com.onlab.entities.ResponseClass;
import com.onlab.repositories.NpcRepository;
import com.onlab.repositories.PlayerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class PlayerUtils {
    private static PlayerRepository playerRepository;

    private static NpcRepository npcRepository;

    @Autowired
    public PlayerUtils( PlayerRepository playerRepo, NpcRepository npcRepo ) {
        PlayerUtils.playerRepository = playerRepo;
        PlayerUtils.npcRepository = npcRepo;
    }


    public static int npcXpGain( int actEnemyLevel, int playerLevel ) {
        int gain = playerLevel * 5 + 45;
        if( playerLevel < actEnemyLevel ){
            gain = gain * (actEnemyLevel - playerLevel);
        }
        return gain;
    }

    public static String afterAnsweredModifications(Answer.ActualAnswer answer, Player player) {
        int xpGain = 0;
        String returnText = answer.storyText;
        String playerId = player.getId();
        returnText += "\n";
        int episode = (answer.next == 0) ? player.getEpisode() + 1 : answer.next;
        player.setEpisode(episode);

        if ( answer.outcome.equals("fail") ) {
            xpGain = fail(player.getLevel());
            returnText += "Hasn't saved the world today. \n Gained " +
                    xpGain + " experience";
        } else if ( answer.outcome.equals("reward") ) {
            xpGain = reward(player.getLevel());
            returnText += "The well-deserved reward is " +
                    xpGain + " experience";
        } else {
            ResponseClass fightResponse = fight(answer.outcome, player);
            xpGain = fightResponse.xpGain;
            returnText += fightResponse.fightText;
            player = fightResponse.character;
        }
        player.setHealthPoint( (player.getHealthPoint() < player.getMaxHP() - 20) ?
                player.getHealthPoint() + 20 : player.getMaxHP() );
        player = finalizeAction(xpGain, player);
        player.setId(playerId);
        playerRepository.save(player);
        return returnText;
}

    /**
     *   ACTIONS
     */
    private static int fail(int level) {
        return level + 5;
    }

    private static int reward(int level) {
        return ( level * 4 ) + 45;
    }

    /**
     *  UTILS
     */
    private static int nextLevelXP(int level) {
        if( level < 11 ) {
            return ( 40 * level * level ) + ( 360 * level );
        } else {
            return (int) ( 0.4 * level * level * level )
                    + ( 40 * level * level )
                    + ( 396 * level );
        }
    }

    private static Player levelUpIfNeeded(Player player) {
        if( ( player.getExperience() - nextLevelXP(player.getLevel()) ) >= 0 ) {
            player.setExperience( player.getExperience() - nextLevelXP(player.getLevel()) );
            player.setAttackPower( player.getAttackPower() + 2 );
            player.setDefensePower( player.getDefensePower() + 1 );
            player.setMaxHP( player.getMaxHP() + 20 );
            player.setHealthPoint( player.getMaxHP() );
            player.setExperience( 0 );
            player.setLevel( player.getLevel() + 1 );
        }
        return player;
    }

    private static Player finalizeAction(int xpGain, Player player) {
        player.setExperience(player.getExperience() + xpGain);
        return levelUpIfNeeded(player);
    }

    public static ResponseClass fight(String enemyName, Player player) {
        int xpGain = 0;
        String fightText = "";
        int characterHealth = player.getHealthPoint();
        Npc actEnemy = npcRepository.findByName(enemyName);

        //enemy is too strong
        if(actEnemy.getDefensePower() >= player.getAttackPower()){
            characterHealth -= player.getHealthPoint()/2;
            xpGain = fail(actEnemy.getLevel());
            //opposit
        } else if(player.getDefensePower() >= actEnemy.getAttackPower()){
            xpGain = npcXpGain(actEnemy.getLevel(), player.getLevel());
        }
        //others
        else {
            int playerDmg = player.getAttackPower() - actEnemy.getDefensePower();
            int oppDmg = actEnemy.getAttackPower() - player.getDefensePower();
            double rndPlayerDmg = Math.floor(playerDmg * ((Math.random() * 1.5) + 0.8)); //damage * [0.8..1.5]
            double rndOppDmg = Math.floor(oppDmg * ((Math.random() * 1.5) + 0.8));
            fightText = "";
            int enemyHealth = actEnemy.getHealthPoint();
            while (((enemyHealth -= rndPlayerDmg) > 0)
                    && ((characterHealth -= rndOppDmg) > 0)) {
                rndPlayerDmg = Math.floor(playerDmg * ((Math.random() * 1.5) + 1));
                rndOppDmg = Math.floor(oppDmg * ((Math.random() * 1.5) + 1));
                fightText += "His opponent damaged him: -" + rndOppDmg
                        + " health point. Remained " + characterHealth;
                fightText += (rndOppDmg > oppDmg * 1.4) ? "\tCRITICAL HIT\n" : "\n";
                fightText += "Rhonin attacked: " + rndPlayerDmg + " damages. "
                        + enemyHealth + " health remained.";
                fightText += (rndPlayerDmg > playerDmg * 1.4) ? "\tCRITICAL HIT\n" : "\n";
            }
            //player died
            if (characterHealth <= 0) {
                player = newGamePlayer(player);
                //player survived
            } else {
                xpGain = npcXpGain(actEnemy.getLevel(), player.getLevel());
            }
        }
        player.setHealthPoint(characterHealth);
        return new ResponseClass(player, xpGain, fightText);
    }

    public static Player newGamePlayer(Player oldPlayer) {
        Player newPlayer = new Player();
        oldPlayer.setMaxHP(newPlayer.getMaxHP());
        oldPlayer.setHealthPoint(newPlayer.getHealthPoint());
        oldPlayer.setExperience(newPlayer.getExperience());
        oldPlayer.setEpisode(newPlayer.getEpisode());
        oldPlayer.setAttackPower(newPlayer.getAttackPower());
        oldPlayer.setDefensePower(newPlayer.getDefensePower());
        oldPlayer.setLevel(newPlayer.getLevel());
        return oldPlayer;
    }
}
