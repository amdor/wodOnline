package com.onlab.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.onlab.entities.Npc;
import com.onlab.entities.Player;
import com.onlab.entities.ResponseClass;
import com.onlab.entities.SavedPlayer;
import com.onlab.repositories.PlayerRepository;
import com.onlab.repositories.SavedPlayerRepository;
import com.onlab.utils.PlayerUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.Principal;

@RestController
public class PlayerController {

    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private SavedPlayerRepository savedPlayerRepository;

    @Autowired
    BCryptPasswordEncoder encoder;

    @RequestMapping(value="/player", method = RequestMethod.GET)
    public Player getPlayer( Principal principal ) throws NoSuchFieldException {
        if( principal == null ) {
            throw new NoSuchFieldException();
        }
        String name = principal.getName();
        Player player = playerRepository.findByUsername( name );
        if( player == null ) {
            throw new NoSuchFieldException();
        }
        player.setPassword("");
        return player;
    }

    @RequestMapping(value="/load", method = RequestMethod.GET)
    public Player loadPlayer( Principal principal ) throws NoSuchFieldException {
        if( principal == null ) {
            throw new NoSuchFieldException();
        }
        String name = principal.getName();
        Player player = savedPlayerRepository.findByUsername( name );
        if( player == null ) {
            throw new NoSuchFieldException();
        }
        player.setId(playerRepository.findByUsername( name ).getId());
        playerRepository.save(player);
        player.setPassword("");
        return player;
    }

    @RequestMapping(value="/save", method = RequestMethod.POST)
    public void savePlayer( Principal principal ) throws NoSuchFieldException {
        if( principal == null ) {
            throw new NoSuchFieldException();
        }
        String name = principal.getName();
        Player player = playerRepository.findByUsername( name );
        if( player == null ) {
            throw new NoSuchFieldException();
        }
        savedPlayerRepository.save(new SavedPlayer(player));
    }

    @RequestMapping( value = "/register", method = RequestMethod.POST )
    public ResponseEntity<?> register(@RequestBody Player player ) {
        String userName = player.getUsername();
        Player oldPlayer = playerRepository.findByUsername( userName );
        if( oldPlayer == null ) {
            String encodedPassword = encoder.encode( player.getPassword() );
            Player newPlayer = new Player();
            newPlayer.setUsername( userName );
            newPlayer.setPassword( encodedPassword );
            playerRepository.save( newPlayer );
            return new ResponseEntity<Object>( HttpStatus.CREATED );
        } else {
            return new ResponseEntity<Object>(HttpStatus.METHOD_NOT_ALLOWED);
        }
    }

    @RequestMapping(value = "/fight", method = RequestMethod.GET)
    public String story(@RequestParam(value = "enemy")String enemy,
                        Principal principal ) throws IOException, NoSuchFieldException {
        ObjectMapper mapper = new ObjectMapper();
        if( principal == null ) {
            throw new NoSuchFieldException();
        }
        String name = principal.getName();
        Player character = playerRepository.findByUsername( name );
        if( character == null ) {
            throw new NoSuchFieldException();
        }
        character.setPassword( "" );
        ResponseClass response = PlayerUtils.fight(enemy, character);
        return mapper.writeValueAsString(response);
    }
}
