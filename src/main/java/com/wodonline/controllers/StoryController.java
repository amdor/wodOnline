package com.wodonline.controllers;

import com.wodonline.entities.Story;
import com.wodonline.repositories.StoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by Zsolt on 2017. 01. 12..
 */
@RestController
public class StoryController {

    @Autowired
    private StoryRepository repository;

    @RequestMapping(value = "/story", method = RequestMethod.GET)
    public Story story(@RequestParam(value = "story") int episode) {
        return repository.findByEpisode(episode);
    }
}
