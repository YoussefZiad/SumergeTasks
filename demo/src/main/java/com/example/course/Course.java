package com.example.course;

import com.example.assessment.Assessment;
import com.example.author.Author;
import com.example.rating.Rating;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.Set;

@Entity
@Table(name="Course")
public class Course {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private int id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "credit")
    private int credit;

    @ManyToMany
    @JoinTable(
            name = "Author_Course",
            joinColumns = @JoinColumn(name = "course_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "author_id", referencedColumnName = "id"))
    private Set<Author> authors;

    @OneToMany(mappedBy = "course")
    @JsonManagedReference
    private Set<Rating> ratings;

    @OneToOne(mappedBy = "course")
    @JsonManagedReference
    private Assessment assessment;

    public Course() {
    }

    public Course(int id, int credit, String description, String name) {
        this.id = id;
        this.credit = credit;
        this.description = description;
        this.name = name;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getCredit() {
        return credit;
    }

    public void setCredit(int credit) {
        this.credit = credit;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Author> getAuthors() {
        return authors;
    }

    public Assessment getAssessment() {
        return assessment;
    }

    public Set<Rating> getRatings() {
        return ratings;
    }

    public void setAuthors(Set<Author> authors) {
        this.authors = authors;
    }

    public void setRatings(Set<Rating> ratings) {
        this.ratings = ratings;
    }

    public void setAssessment(Assessment assessment) {
        this.assessment = assessment;
    }
}