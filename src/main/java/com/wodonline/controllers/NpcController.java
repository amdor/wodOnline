package com.wodonline.controllers;

import com.wodonline.entities.Npc;
import com.wodonline.repositories.NpcRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Created by Zsolt on 2017. 01. 16..
 */
@RestController
public class NpcController {

    @Autowired
    private NpcRepository repository;

    @RequestMapping(value = "/npcs", method = RequestMethod.GET)
    List<Npc> getNpcs() {
        return repository.findAll();
    }

    @RequestMapping(value = "/npc", method = RequestMethod.GET)
    Npc getNpc(@RequestParam(value = "npc") String name) {
        return repository.findByName(name);
    }

}
