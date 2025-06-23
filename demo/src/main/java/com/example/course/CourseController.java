package com.example.course;

import com.example.course.dto.CourseDTO;
import com.example.course.dto.CourseData;
import com.examplelib.external.Course;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/courses")
@Tag(name = "Courses API", description = "API for Course Entity")
public class CourseController {

    private CourseService courseService;

    @Autowired
    public CourseController(CourseService courseService){
        this.courseService = courseService;
    }

    @GetMapping("/")
    @Operation(summary = "View Courses", description = "Get All Courses")
    @ApiResponses(
            value = {
                    @ApiResponse(responseCode = "200", description = "Courses Found Successfully",
                        content = { @Content(mediaType = "application/json",
                        schema = @Schema(implementation = CourseData.class)) })
            }
    )
    public Page<CourseData> viewCourses(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "true") boolean ascending
    ){
        Sort sort = ascending ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return this.courseService.viewCourses(pageable);
    }

    @GetMapping("/{courseId}")
    @Operation(summary = "View Course", description = "Get Course By ID")
    @ApiResponses(
            value = {
                    @ApiResponse(responseCode = "200", description = "Course Found Successfully",
                            content = { @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = CourseData.class)) })
            }
    )
    public Optional<CourseData> viewCourse(@PathVariable int courseId){
        return this.courseService.viewCourse(courseId);
    }

    @PostMapping("/")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Add Course", description = "Add Course")
    @ApiResponses(
            value = {
                    @ApiResponse(responseCode = "201", description = "Course Added Successfully",
                            content = { @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = CourseData.class)) })
            }
    )
    public ResponseEntity<CourseData> addCourse(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Course to create", required = true,
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = CourseDTO.class),
                            examples = @ExampleObject(value =
                                    "{ \"name\": \"CS I\", \"description\": \"slim\", \"credit\": 8}")))
            @RequestBody CourseDTO body) throws Exception {
        CourseData createdEntity = this.courseService.addCourse(body);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(createdEntity.getId())
                .toUri();
        return ResponseEntity.created(location).body(createdEntity);
    }

    @PutMapping("/{courseId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @ApiResponses(
            value = {
                    @ApiResponse(responseCode = "204", description = "Course Updated Successfully",
                            content = { @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = CourseData.class)), })
            }
    )
    @Operation(summary = "Update Course", description = "Update Course by id")
    public CourseData updateCourse(@PathVariable int courseId,
           @io.swagger.v3.oas.annotations.parameters.RequestBody(
                   description = "Course to update", required = true,
                   content = @Content(mediaType = "application/json",
                           schema = @Schema(implementation = CourseDTO.class),
                           examples = @ExampleObject(value =
                                   "{ \"name\": \"CS I\", \"description\": \"slim\", \"credit\": 8}")))
           @RequestBody CourseDTO body) throws Exception {
        return this.courseService.updateCourse(courseId, body);
    }

    @DeleteMapping("/{courseId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @ApiResponses(
            value = {
                    @ApiResponse(responseCode = "204", description = "Course Deleted Successfully",
                            content = { @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = Course.class)) })
            }
    )
    @Operation(summary = "Delete Course", description = "Delete Course by id")
    public void deleteCourse(@PathVariable int courseId){
        this.courseService.deleteCourse(courseId);
    }

}
