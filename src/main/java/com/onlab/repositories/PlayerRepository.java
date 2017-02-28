package com.onlab.repositories;

import com.onlab.entities.Player;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PlayerRepository extends MongoRepository<Player, String> {
    Player findByUsername(String userName);
}
