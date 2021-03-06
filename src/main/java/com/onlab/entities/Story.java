package com.onlab.entities;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Document(collection="story")
public class Story {
    @Id
    private String id;

    @Field("Episode")
    private int episode;

    @Field("Title")
    private String title;

    @Field("Content")
    private String content;

    @Field("Answers")
    private List<Answer> answers;

    public Story() {
    }

    public Story(int episode, String title, String content, List<Answer> answers) {
        this.episode = episode;
        this.title = title;
        this.content = content;
        this.answers = answers;
    }

    public int getEpisode() {
        return episode;
    }

    public void setEpisode(int episode) {
        this.episode = episode;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }


    public List<Answer> getAnswers() {
        return answers;
    }

    public void setAnswers(List<Answer> answers) {
        this.answers = answers;
    }

    @Override
    public String toString() {
        return "Story{" +
                "id='" + id + '\'' +
                ", episode=" + episode +
                ", title='" + title + '\'' +
                ", content='" + content + '\'' +
                ", answers=" + answers +
                '}';
    }

    private class Answer {
        public String text;
    }
}
