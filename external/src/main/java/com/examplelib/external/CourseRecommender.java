package com.examplelib.external;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CourseRecommender {

    Page recommendCourses(Pageable pageable);

}
