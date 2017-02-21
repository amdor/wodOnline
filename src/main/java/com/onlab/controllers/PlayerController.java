package com.onlab.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.onlab.entities.Npc;
import com.onlab.entities.Player;
import com.onlab.utils.PlayerUtils;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
public class PlayerController {

    @RequestMapping(value = "/fight", method = RequestMethod.GET)
    public String story(@RequestParam(value = "enemy")String enemy,
                               @RequestParam(value = "character")String player) throws IOException {
        int xpGain = 0;
        String fightText = "";
        ObjectMapper mapper = new ObjectMapper();
        Npc actEnemy = mapper.readValue(enemy, Npc.class);
        Player character = mapper.readValue(player, Player.class);
        int characterHealth = character.getHealthPoint();
        //enemy is too strong
        if(actEnemy.getDefensePower() >= character.getAttackPower()){
            characterHealth -= character.getHealthPoint()/2;
            //opposit
        } else if(character.getDefensePower() >= actEnemy.getAttackPower()){
            xpGain = PlayerUtils.npcXpGain(actEnemy.getLevel(), character.getLevel());
        }
        //others
        else {
            int playerDmg = character.getAttackPower() - actEnemy.getDefensePower();
            int oppDmg = actEnemy.getAttackPower() - character.getDefensePower();
            double rndPlayerDmg = Math.floor(playerDmg * ((Math.random() * 1.5) + 0.8)); //damage * [0.8..1.5]
            double rndOppDmg = Math.floor(oppDmg * ((Math.random() * 1.5) + 0.8));
            fightText = "";
            int enemyHealth = actEnemy.getHealthPoint();
            while (((enemyHealth -= rndPlayerDmg) > 0)
                    && ((characterHealth -= rndOppDmg) > 0)) {
                rndPlayerDmg = Math.floor(playerDmg * ((Math.random() * 1.5) + 1));
                rndOppDmg = Math.floor(oppDmg * ((Math.random() * 1.5) + 1));
                fightText += "His opponent damaged him: -" + rndOppDmg
                        + " health point. Remained " + character.getHealthPoint();
                fightText += (rndOppDmg > oppDmg * 1.4) ? "\tCRITICAL HIT\n" : "\n";
                fightText += "Rhonin attacked: " + rndPlayerDmg + " damages. "
                        + actEnemy.getHealthPoint() + " health remained.";
                fightText += (rndPlayerDmg > playerDmg * 1.4) ? "\tCRITICAL HIT\n" : "\n";
            }
            //player died
            if (characterHealth <= 0) {
                character = new Player();
                //player survived
            } else {
                xpGain = PlayerUtils.npcXpGain(actEnemy.getLevel(), character.getLevel());
                character.setHealthPoint(characterHealth);
            }
        }
        return mapper.writeValueAsString(new ResponseClass(character, xpGain, fightText));
    }

    class ResponseClass {
        public Player character;
        public int xpGain;
        public String fightText;

        public ResponseClass(){}

        public ResponseClass(Player newPlayer, int xpGain, String fightText) {
            this.character = newPlayer;
            this.xpGain = xpGain;
            this.fightText = fightText;
        }


    }
}
