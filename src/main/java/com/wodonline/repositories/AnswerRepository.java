package com.wodonline.repositories;

import com.wodonline.entities.Answer;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

/**
 * Created by Zsolt on 2017. 01. 13..
 */
public interface AnswerRepository extends MongoRepository<Answer, String> {
    
    Answer findByEpisode(int episode);

}
