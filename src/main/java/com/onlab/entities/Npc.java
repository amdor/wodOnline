package com.onlab.entities;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection="npc")
public class Npc extends AbstractCharacter {

    @Field("Name")
    String name;

    public Npc(){}

    public Npc(int attackPower, int defensePower, int healthPoint, int level, String name) {
        super(attackPower, defensePower, healthPoint, level);
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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
