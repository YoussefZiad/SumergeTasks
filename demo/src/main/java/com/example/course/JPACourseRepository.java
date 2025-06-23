package com.example.course;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JPACourseRepository extends JpaRepository<Course, Integer> {


}
