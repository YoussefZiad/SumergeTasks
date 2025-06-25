package com.example.course;

import com.examplelib.external.SampleRepository;
import org.springframework.stereotype.Repository;

@Repository("CourseRepo")
public interface JPACourseRepository extends SampleRepository<Course, Integer> {


}
