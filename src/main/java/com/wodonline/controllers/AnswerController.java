package com.wodonline.controllers;

import com.wodonline.entities.Answer;
import com.wodonline.repositories.AnswerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

/**
 * Created by Zsolt on 2017. 01. 13..
 */
@RestController
public class AnswerController {

    @Autowired
    private AnswerRepository repository;

    @RequestMapping(value = "/answer", method = RequestMethod.GET)
    public Answer.ActualAnswer story(@RequestParam(value = "answer") int episode, @RequestParam(value = "answerLetter") String answer) {
        Answer actualAnswer =  repository.findByEpisode(episode);
        switch (answer) {
            case "A" : return actualAnswer.getAnswerA();
            case "B" : return actualAnswer.getAnswerB();
            case "C" : return actualAnswer.getAnswerC();
            case "D" : return actualAnswer.getAnswerD();
        }
        throw(new IllegalArgumentException());
    }

    @ResponseStatus(value= HttpStatus.BAD_REQUEST,
            reason="No sufficient letter given")
    @ExceptionHandler(IllegalArgumentException.class)
    public void illegalArgument() {
        // Nothing to do
    }
}
