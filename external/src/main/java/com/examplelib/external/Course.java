package com.examplelib.external;

public class Course {


    private int id;
    private String name;
    private String description;
    private int credit;

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

    @Override
    public String toString(){
        return "Course(name: "+name+", description: "+description+", credit: "+credit+")";
    }
}
