package com.onlab.repositories;

import com.onlab.entities.Player;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<Player, String> {
    Player findByUserName(String userName);
}
