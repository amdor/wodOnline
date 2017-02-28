package com.onlab.entities;


public class ResponseClass {
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
