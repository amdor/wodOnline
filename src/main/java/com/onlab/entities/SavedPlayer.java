package com.onlab.entities;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection="savedplayer")
public class SavedPlayer extends Player {

    public SavedPlayer() {
        this.username = "";
        this.password = "";
        this.attackPower = 10;
        this.defensePower = 8;
        this.healthPoint = 120;
        this.maxHP = this.healthPoint;
        this.experience = 0;
        this.level = 1;
        this.episode = 1;
    }

    public SavedPlayer( Player original ) {
        this.username = original.getUsername();
        this.password = original.getPassword();
        this.attackPower = original.getAttackPower();
        this.defensePower = original.getDefensePower();
        this.healthPoint = original.getHealthPoint();
        this.maxHP = original.getMaxHP();
        this.experience = original.getExperience();
        this.level = original.getLevel();
        this.episode = original.getEpisode();
    }
}
