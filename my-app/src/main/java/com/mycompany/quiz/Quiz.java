package main.java.com.mycompany.quiz;

import main.java.com.mycompany.questions.Question;

import java.util.Iterator;
import java.util.List;

public class Quiz {

    private final List<Question> questions;
    private Iterator<Question> questionIterator;
    private Question currentQuestion;

    public Quiz(List<Question> questions) {
        this.questions = questions;
        this.questionIterator = questions.iterator();
        this.currentQuestion = questionIterator.next();
    }

    public boolean moreQuestions(){
        return questionIterator.hasNext();
    }

    public void addQuestion(Question question) {
        questions.add(question);
        questionIterator = questions.iterator();
    }

    public void addQuestion(Question question, int index) {
        questions.add(index, question);
        questionIterator = questions.iterator();
    }

    public void nextQuestion() {
        currentQuestion = questionIterator.next();
    }

    public void displayQuestion() {
        System.out.println("Question " + (questions.indexOf(currentQuestion) + 1) + ":");
        currentQuestion.display();
    }

    public int calculateScore(String userAnswer) {
        if (userAnswer.equalsIgnoreCase(currentQuestion.getCorrectAnswer()))
            return currentQuestion.getScoreValue();
        return 0;
    }
}
