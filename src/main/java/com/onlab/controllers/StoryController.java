package com.onlab.controllers;

import com.onlab.entities.Story;
import com.onlab.repositories.StoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class StoryController {

    @Autowired
    private StoryRepository repository;

    @RequestMapping(value = "/story", method = RequestMethod.GET)
    public Story story(@RequestParam(value = "story") int episode) {
        return repository.findByEpisode(episode);
    }
}
