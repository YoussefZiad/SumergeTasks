package main.java.com.mycompany.questions;

import main.java.com.mycompany.exceptions.InvalidAnswerException;

public class EssayQuestion extends Question{

    public EssayQuestion(String questionText, String correctAnswer) throws InvalidAnswerException {
        this.setQuestionText(questionText);
        this.setCorrectAnswer(correctAnswer);
        this.setScoreValue(30);
    }

}
