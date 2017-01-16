package com.wodonline.entities;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * Created by Zsolt on 2017. 01. 16..
 */
@Document(collection="npc")
public class Npc {
    @Id
    private String id;

    @Field("Name")
    private String name;

    @Field("attackPower")
    private int attackPower;

    @Field("defensePower")
    private int defensePower;

    @Field("healthPoint")
    private int healthPoint;

    @Field("level")
    private int level;

    public Npc(String name, int attackPower, int defensePower, int healthPoint, int level) {
        this.name = name;
        this.attackPower = attackPower;
        this.defensePower = defensePower;
        this.healthPoint = healthPoint;
        this.level = level;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    @Override
    public String toString() {
        return "Npc{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", attackPower=" + attackPower +
                ", defensePower=" + defensePower +
                ", healthPoint=" + healthPoint +
                ", level=" + level +
                '}';
    }
}
