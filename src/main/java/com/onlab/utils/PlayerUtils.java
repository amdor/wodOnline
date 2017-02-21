package com.onlab.utils;

public class PlayerUtils {
    public static int npcXpGain( int actEnemyLevel, int playerLevel ){
        int gain = playerLevel * 5 + 45;
        if( playerLevel < actEnemyLevel ){
            gain = gain * (actEnemyLevel - playerLevel);
        }
        return gain;
    }
}
