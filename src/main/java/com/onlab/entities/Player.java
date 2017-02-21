package com.onlab.entities;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection="player")
public class Player extends AbstractCharacter {

    String userName;

    String password;

    int maxHP;

    int experience;

    int episode;

    public Player() {
        this.attackPower = 10;
        this.defensePower = 8;
        this.healthPoint = 120;
        this.maxHP = this.healthPoint;
        this.experience = 0;
        this.level = 1;
        this.episode = 1;
    }

    public Player(int attackPower, int defensePower, int healthPoint, int maxHP, int experience, int level, int episode) {
        super(attackPower, defensePower, healthPoint, level);
        this.maxHP = maxHP;
        this.experience = experience;
        this.episode = episode;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public int getMaxHP() {
        return maxHP;
    }

    public void setMaxHP(int maxHP) {
        this.maxHP = maxHP;
    }

    public int getExperience() {
        return experience;
    }

    public void setExperience(int experience) {
        this.experience = experience;
    }

    public int getEpisode() {
        return episode;
    }

    public void setEpisode(int episode) {
        this.episode = episode;
    }

    @Override
    public String toString() {
        return "Player{" +
                "attackPower=" + attackPower +
                ", defensePower=" + defensePower +
                ", healthPoint=" + healthPoint +
                ", maxHP=" + maxHP +
                ", experience=" + experience +
                ", level=" + level +
                ", episode=" + episode +
                '}';
    }
}
