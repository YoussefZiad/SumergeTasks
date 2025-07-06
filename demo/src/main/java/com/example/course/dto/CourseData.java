package com.example.course.dto;

import com.example.assessment.dto.AssessmentData;
import com.example.author.dto.AuthorData;
import com.example.rating.dto.RatingData;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.Set;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class CourseData {

    private int id;
    private String name;
    private String description;
    private Integer credit;
    private Set<AuthorData> authors;
    private Set<RatingData> ratings;
    private AssessmentData assessment;

    public CourseData(int id, String name, String description, Integer credit) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.credit = credit;
    }

    public CourseData() {

    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getCredit() {
        return credit;
    }

    public void setCredit(Integer credit) {
        this.credit = credit;
    }

    public Set<AuthorData> getAuthors() {
        return authors;
    }

    public void setAuthors(Set<AuthorData> authors) {
        this.authors = authors;
    }

    public Set<RatingData> getRatings() {
        return ratings;
    }

    public void setRatings(Set<RatingData> ratings) {
        this.ratings = ratings;
    }

    public AssessmentData getAssessment() {
        return assessment;
    }

    public void setAssessment(AssessmentData assessment) {
        this.assessment = assessment;
    }

    @Override
    public boolean equals(Object o){
        if(!(o instanceof CourseData c))
            return false;
        return id == c.getId()
                && name.equals(c.getName())
                && description.equals(c.getDescription())
                && credit.equals(c.getCredit());
    }

}
