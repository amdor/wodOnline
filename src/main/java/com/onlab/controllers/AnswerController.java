package com.onlab.controllers;

import com.onlab.entities.Answer;
import com.onlab.entities.Player;
import com.onlab.repositories.AnswerRepository;
import com.onlab.repositories.PlayerRepository;
import com.onlab.utils.PlayerUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
public class AnswerController {

    @Autowired
    private AnswerRepository answerRepository;

    @Autowired
    private PlayerRepository playerRepository;

    @RequestMapping(value = "/answer", method = RequestMethod.GET)
    public String story(@RequestParam(value = "answer") int episode,
                                     @RequestParam(value = "answerLetter") String answer,
                                     Principal principal) throws NoSuchFieldException {
        Answer answers =  answerRepository.findByEpisode(episode);
        Answer.ActualAnswer actualAnswer = null;

        if( principal == null || answer == null ) {
            throw new NoSuchFieldException();
        }
        String name = principal.getName();
        Player player = playerRepository.findByUsername(name);

        if( player == null ) {
            throw new NoSuchFieldException();
        }

        switch (answer) {
            case "A" : actualAnswer = answers.getAnswerA();
                break;
            case "B" : actualAnswer = answers.getAnswerB();
                break;
            case "C" : actualAnswer = answers.getAnswerC();
                break;
            case "D" : actualAnswer = answers.getAnswerD();
                break;
        }

        return PlayerUtils.afterAnsweredModifications(actualAnswer, player);
    }

    @ResponseStatus(value= HttpStatus.BAD_REQUEST,
            reason="No sufficient letter given")
    @ExceptionHandler(IllegalArgumentException.class)
    public void illegalArgument() {
        // Nothing to do
    }
}
