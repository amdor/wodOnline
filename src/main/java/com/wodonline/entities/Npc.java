package com.wodonline.entities;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * Created by Zsolt on 2017. 01. 16..
 */
@Document(collection="npc")
public class Npc extends AbstractCharacter {
    @Id
    String id;

    @Field("Name")
    String name;

    public Npc(){}

    public Npc(int attackPower, int defensePower, int healthPoint, int level, String name) {
        super(attackPower, defensePower, healthPoint, level);
        this.name = name;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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
