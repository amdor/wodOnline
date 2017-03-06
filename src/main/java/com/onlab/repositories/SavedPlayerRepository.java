package com.onlab.repositories;

import com.onlab.entities.SavedPlayer;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface SavedPlayerRepository extends MongoRepository<SavedPlayer, String> {
    SavedPlayer findByUsername(String userName);
}
