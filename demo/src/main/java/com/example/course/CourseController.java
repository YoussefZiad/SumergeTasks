package com.example.course;

import com.example.course.dto.CourseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api")
@Tag(name = "Sumerge Tasks API", description = "API for backend tasks for the talent program")
public class CourseController {

    private CourseService courseService;

    @Autowired
    public CourseController(CourseService courseService){
        this.courseService = courseService;
    }

    @GetMapping("/courses")
    @Operation(summary = "View Courses", description = "Get All Courses")
    public List<Course> viewCourses(){
        return this.courseService.viewCourses();
    }

    @GetMapping("/courses/{courseId}")
    @Operation(summary = "View Course", description = "Get Course By ID")
    public Course viewCourse(@PathVariable int courseId){
        return this.courseService.viewCourse(courseId);
    }

    @PostMapping("/courses")
    @Operation(summary = "Add Course", description = "Add Course")
    public ResponseEntity<Void> addCourse(@RequestBody CourseDTO body){
        int createdId = this.courseService.addCourse(body.name, body.description, body.credit);
        return entityWithLocation(createdId);
    }

    @PutMapping("/courses/{courseId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Update Course", description = "Update Course by id")
    public void updateCourse(@PathVariable int courseId, @RequestBody CourseDTO body){
        this.courseService.updateCourse(courseId, body.name, body.description, body.credit);
    }

    @DeleteMapping("/courses/{courseId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete Course", description = "Delete Course by id")
    public void deleteCourse(@PathVariable int courseId){
        this.courseService.deleteCourse(courseId);
    }

    private ResponseEntity<Void> entityWithLocation(Object resourceId) {

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequestUri()
                .path("/{resourceId}")
                .buildAndExpand(resourceId)
                .toUri();

        return ResponseEntity.created(location).build();
    }

}
