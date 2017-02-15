package com.onlab.controllers;

import com.onlab.entities.Npc;
import com.onlab.repositories.NpcRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

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
