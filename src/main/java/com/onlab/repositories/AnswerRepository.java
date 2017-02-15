package com.onlab.repositories;

import com.onlab.entities.Answer;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AnswerRepository extends MongoRepository<Answer, String> {

    Answer findByEpisode(int episode);

}
