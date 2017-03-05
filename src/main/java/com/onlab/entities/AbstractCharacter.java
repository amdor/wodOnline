package com.onlab.entities;

import org.springframework.data.annotation.Id;

public abstract class AbstractCharacter {

    @Id
    String id;

    int attackPower;

    int defensePower;

    int healthPoint;

    int level;

    public AbstractCharacter(){}

    public AbstractCharacter(int attackPower, int defensePower, int healthPoint, int level) {
        this.attackPower = attackPower;
        this.defensePower = defensePower;
        this.healthPoint = healthPoint;
        this.level = level;
    }


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public int getAttackPower() {
        return attackPower;
    }

    public void setAttackPower(int attackPower) {
        this.attackPower = attackPower;
    }

    public int getDefensePower() {
        return defensePower;
    }

    public void setDefensePower(int defensePower) {
        this.defensePower = defensePower;
    }

    public int getHealthPoint() {
        return healthPoint;
    }

    public void setHealthPoint(int healthPoint) {
        this.healthPoint = healthPoint;
    }

    public int getLevel() {
        return level;
    }

    public void setLevel(int level) {
        this.level = level;
    }
}
