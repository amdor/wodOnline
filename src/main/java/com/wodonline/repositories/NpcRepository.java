package com.wodonline.repositories;

import com.wodonline.entities.Npc;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

/**
 * Created by Zsolt on 2017. 01. 16..
 */
public interface NpcRepository extends MongoRepository<Npc, String> {

    List<Npc> findAll();

    Npc findByName(String name);

}
