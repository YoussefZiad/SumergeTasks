package main.java.com.mycompany.quiz;

import main.java.com.mycompany.questions.Question;

import java.util.List;

public record Quiz(List<Question> questions) {

    public void addQuestion(Question question) {
        questions.add(question);
    }

    public void addQuestion(Question question, int index) {
        questions.add(index, question);
    }

    public void displayQuestion(int questionIndex) {
        System.out.println("Question " + (questionIndex + 1) + ":");
        questions.get(questionIndex).display();
    }

    public int calculateScore(int questionIndex, String userAnswer) {
        Question question = questions.get(questionIndex);
        if (userAnswer.equalsIgnoreCase(question.getCorrectAnswer()))
            return question.getScoreValue();
        return 0;
    }
}
