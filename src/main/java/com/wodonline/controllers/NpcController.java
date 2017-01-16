package com.wodonline.controllers;

import com.wodonline.entities.Npc;
import com.wodonline.repositories.NpcRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Created by Zsolt on 2017. 01. 16..
 */
@RestController
public class NpcController {

    @Autowired
    private NpcRepository repository;

    @RequestMapping(value = "/npc", method = RequestMethod.GET)
    List<Npc> getNpcs() {
        return repository.findAll();
    }

}
