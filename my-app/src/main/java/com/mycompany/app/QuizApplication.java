package main.java.com.mycompany.app;

import main.java.com.mycompany.exceptions.InvalidAnswerException;
import main.java.com.mycompany.questions.EssayQuestion;
import main.java.com.mycompany.questions.MultipleChoiceQuestion;
import main.java.com.mycompany.questions.Question;
import main.java.com.mycompany.quiz.Quiz;
import main.java.com.mycompany.user.User;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Scanner;

/**
 * Hello world!
 */
public class QuizApplication {

    private Quiz quiz;
    private User user;

    private final List<Question> questionList = new ArrayList<>(
            List.of(new Question[]{
                    new MultipleChoiceQuestion(
                            "1+1 = ?",
                            new ArrayList<>(List.of(new String[]{"2","3","4"})),
                            "2"),
                    new MultipleChoiceQuestion(
                            "1+2 = ?",
                            new ArrayList<>(List.of(new String[]{"2","3","4"})),
                            "3"),
                    new MultipleChoiceQuestion(
                            "2+2 = ?",
                            new ArrayList<>(List.of(new String[]{"2","3","4"})),
                            "4"),
                    new EssayQuestion(
                            "Do you like Math?",
                            "Yes"),
                    new EssayQuestion(
                            "Do you like chemistry?",
                            "No")
            })
    );

    public QuizApplication() throws InvalidAnswerException {
        Scanner sc = new Scanner(System.in);
        registerUser(sc);
        String playAgain;
        do {
            createRandomQuiz();
            playQuiz(sc);
            System.out.println("Quiz Complete!");
            System.out.println(user.getName()+"'s Final Score: " + user.getScore());
            System.out.println("Play Again? Yes/No");
            playAgain = sc.nextLine();
        } while(playAgain.equals("Yes"));
    }

    public void createRandomQuiz(){
        Collections.shuffle(questionList);
        this.quiz = new Quiz(questionList.subList(0,
                (int) (Math.random()*questionList.size())+1));
    }

    public void registerUser(Scanner sc){
        System.out.println("Welcome! Please enter your name:");
        String username = sc.nextLine();
        this.user = new User(username);
    }

    public void playQuiz(Scanner sc){
        for (int i = 0; i < quiz.questions().size(); i++) {
            quiz.displayQuestion(i);
            System.out.println("Answer: ");
            String userAnswer = sc.nextLine();
            int points = quiz.calculateScore(i, userAnswer);
            user.setScore(user.getScore() + points);
            System.out.println(points == 0 ? "Incorrect" : "Correct");
            System.out.println("Total Score: " + user.getScore());
            System.out.println();
        }
    }

    public static void main(String[] args) {
        try {
            new QuizApplication();
        } catch (InvalidAnswerException e){
            System.out.println("Error: "+e.getMessage());
        }
    }
}
