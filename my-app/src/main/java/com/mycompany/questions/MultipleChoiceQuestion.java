package main.java.com.mycompany.questions;

import main.java.com.mycompany.exceptions.InvalidAnswerException;
import java.util.List;

public class MultipleChoiceQuestion extends Question{

    private final List<String> answers;

    public MultipleChoiceQuestion(
            String questionText,
            List<String> answers,
            String correctAnswer) throws InvalidAnswerException {
        this.setQuestionText(questionText);
        this.answers = answers;
        this.setCorrectAnswer(correctAnswer);
        this.setScoreValue(10);
    }

    @Override
    public void setCorrectAnswer(String correctAnswer) throws InvalidAnswerException {
        if(answers.contains(correctAnswer)){
            super.setCorrectAnswer(correctAnswer);
            return;
        }
        throw new InvalidAnswerException(
                "Answer "+correctAnswer+" must be one of the available" +
                        " answers to be set as the correct answer.");
    }

    @Override
    public void display() {
        super.display();
        System.out.println("Choices: ");
        answers.forEach(System.out::println);
        System.out.println();
    }

    public List<String> getAnswers() {
        return answers;
    }

    public void addAnswer(String answer) {
        this.answers.add(answer);
    }

    public void removeAnswer(String answer) throws InvalidAnswerException {
        if(this.answers.contains(answer)){
            this.answers.remove(answer);
            return;
        }
        throw new InvalidAnswerException("Answer "+answer+" is not" +
                " one of the answers to the question.");
    }

}
