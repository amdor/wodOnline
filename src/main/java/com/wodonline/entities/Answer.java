package com.wodonline.entities;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * Created by Zsolt on 2017. 01. 13..
 */
@Document(collection="answer")
public class Answer {
    @Id
    private String id;

    @Field("Episode")
    private int episode;

    @Field("A")
    private ActualAnswer answerA;

    @Field("B")
    private ActualAnswer answerB;

    @Field("C")
    private ActualAnswer answerC;

    @Field("D")
    private ActualAnswer answerD;

    public Answer(int episode, ActualAnswer answerA, ActualAnswer answerB, ActualAnswer answerC, ActualAnswer answerD) {
        this.episode = episode;
        this.answerA = answerA;
        this.answerB = answerB;
        this.answerC = answerC;
        this.answerD = answerD;
    }

    public int getEpisode() {
        return episode;
    }

    public void setEpisode(int episode) {
        this.episode = episode;
    }

    public ActualAnswer getAnswerA() {
        return answerA;
    }

    public void setAnswerA(ActualAnswer answerA) {
        this.answerA = answerA;
    }

    public ActualAnswer getAnswerB() {
        return answerB;
    }

    public void setAnswerB(ActualAnswer answerB) {
        this.answerB = answerB;
    }

    public ActualAnswer getAnswerC() {
        return answerC;
    }

    public void setAnswerC(ActualAnswer answerC) {
        this.answerC = answerC;
    }

    public ActualAnswer getAnswerD() {
        return answerD;
    }

    public void setAnswerD(ActualAnswer answerD) {
        this.answerD = answerD;
    }

    public class ActualAnswer {
        public String outcome;
        public String storyText;
        public int next;
        public int time;
    }
}