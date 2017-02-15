package com.onlab.repositories;

import com.onlab.entities.Npc;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface NpcRepository extends MongoRepository<Npc, String> {

    List<Npc> findAll();

    Npc findByName(String name);

}
