package com.example.course;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class JDBCCourseRepository {

    private JdbcTemplate jdbcTemplate;

    @Autowired
    public JDBCCourseRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void addCourse(String name, String description, int credit){
        jdbcTemplate.execute("INSERT INTO Course VALUES('"+name+"','"+description+"','"+credit+"')");
        System.out.println("Added course "+name+" to the database");
    }

    public void updateCourse(int id, String name, String description, Integer credit){
        if(name == null && description == null && credit == null) return;
        String sql = "UPDATE Course SET ";
        if(name != null) sql += "name='"+name+"', ";
        if(description != null) sql += "description='"+description+"', ";
        if(credit != null) sql += "credit="+credit+", ";
        sql = sql.substring(0, sql.length()-2);
        sql += " WHERE id = "+id;
        jdbcTemplate.execute(sql);
        System.out.println("Updated course "+name+" in the database");
    }

    public void deleteCourse(int id){
        jdbcTemplate.execute("DELETE FROM Course WHERE id="+id);
        System.out.println("Deleted course from database");
    }

    public Course viewCourse(int id){
        return jdbcTemplate.queryForObject(
                "SELECT * FROM Course WHERE id=?",
                (rs, _) -> new Course(
                        rs.getInt("id"),
                        rs.getInt("credit"),
                        rs.getString("description"),
                        rs.getString("name")
                ),
                id);
    }

    public List<Course> viewCourses(){
        return jdbcTemplate.query(
                "SELECT * FROM Course",
                (rs, _) -> new Course(
                        rs.getInt("id"),
                        rs.getInt("credit"),
                        rs.getString("description"),
                        rs.getString("name")
                ));
    }

}
