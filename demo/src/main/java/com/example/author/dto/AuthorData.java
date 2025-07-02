package com.example.author.dto;

import com.example.course.dto.CourseData;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.Date;
import java.util.Set;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class AuthorData {

    private int id;
    private String name;
    private String email;
    private Date birthdate;
    private Set<CourseData> courses;

    public AuthorData() {
    }

    public AuthorData(int id, String name, String email, Date birthdate) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.birthdate = birthdate;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Date getBirthdate() {
        return birthdate;
    }

    public void setBirthdate(Date birthdate) {
        this.birthdate = birthdate;
    }

    public Set<CourseData> getCourses() {
        return courses;
    }

    public void setCourses(Set<CourseData> courses) {
        this.courses = courses;
    }

    @Override
    public boolean equals(Object o){
        if(!(o instanceof AuthorData a))
            return false;
        return id == a.getId()
                && name.equals(a.getName())
                && email.equals(a.getEmail())
                && birthdate.equals(a.getBirthdate());
    }

}
