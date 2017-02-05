package com.wodonline.utils;

import com.wodonline.entities.Npc;

/**
 * Created by Zsolt on 2017. 02. 04..
 */
public class PlayerUtils {
    public static int npcXpGain( int actEnemyLevel, int playerLevel ){
        int gain = playerLevel * 5 + 45;
        if( playerLevel < actEnemyLevel ){
            gain = gain * (actEnemyLevel - playerLevel);
        }
        return gain;
    }
}
