package main.java.com.mycompany.questions;

import main.java.com.mycompany.exceptions.InvalidAnswerException;

public abstract class Question {

    private String questionText;
    private String correctAnswer;
    private int scoreValue;

    public int getScoreValue() {
        return scoreValue;
    }

    public void setScoreValue(int scoreValue) {
        this.scoreValue = scoreValue;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public String getCorrectAnswer() {
        return correctAnswer;
    }

    public void setCorrectAnswer(String correctAnswer) throws InvalidAnswerException {
        this.correctAnswer = correctAnswer;
    }

    public void display(){
        System.out.println(questionText);
        System.out.println();
    }
}
