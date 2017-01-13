package com.wodonline.repositories;

/**
 * Created by Zsolt on 2017. 01. 12..
 */
import com.wodonline.entities.Story;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface StoryRepository extends MongoRepository<Story, String> {

    Story findByEpisode(int episode);

}
