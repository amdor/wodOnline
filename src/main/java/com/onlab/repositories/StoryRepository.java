package com.onlab.repositories;

import com.onlab.entities.Story;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface StoryRepository extends MongoRepository<Story, String> {

    Story findByEpisode(int episode);

}
