package com.onlab.controllers;

import com.onlab.entities.Player;
import com.onlab.entities.Story;
import com.onlab.repositories.PlayerRepository;
import com.onlab.repositories.StoryRepository;
import com.onlab.utils.PlayerUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
public class StoryController {

    @Autowired
    private StoryRepository storyRepository;

    @Autowired
    private PlayerRepository playerRepository;

    @RequestMapping(value = "/story", method = RequestMethod.GET)
    public Story story(@RequestParam(value = "story") int episode) {
        return storyRepository.findByEpisode(episode);
    }

    @RequestMapping(value = "/newGame", method = RequestMethod.GET)
    public Player newGame(Principal principal ) throws NoSuchFieldException {
        if( principal == null ) {
            throw new NoSuchFieldException();
        }
        String name = principal.getName();
        Player player = playerRepository.findByUsername(name);
        player = PlayerUtils.newGamePlayer(player);
        playerRepository.save(player);
        return player;
    }
}
