package com.example.author.mappers;

import com.example.author.Author;
import com.example.author.dto.AuthorData;
import com.example.course.Course;
import com.example.course.dto.CourseData;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Date;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.spy;

@ExtendWith(MockitoExtension.class)
public class AuthorMapperTests {

    @Test
    public void givenAuthor_whenMap_thenReturnAuthorData() {
        Date authorBirthdate = new Date();
        Author author = new Author(1, "test", "test@test.test", authorBirthdate);

        Course c1 = new Course(1, 2, "desc", "testc1");
        Course c2 = new Course(2, 1, "desc", "testc2");

        CourseData cData1 = new CourseData(c1.getId(), c1.getName(), c1.getDescription(), c1.getCredit());
        CourseData cData2 = new CourseData(c2.getId(), c2.getName(), c2.getDescription(), c2.getCredit());

        c1.setAuthors(Set.of(author));
        c2.setAuthors(Set.of(author));

        author.setCourses(Set.of(c1,c2));

        AuthorData authorData = AuthorMapper.INSTANCE.authorToAuthorData(author);

        assertEquals(author.getId(), authorData.getId());
        assertEquals(author.getName(), authorData.getName());
        assertEquals(author.getEmail(), authorData.getEmail());
        assertEquals(author.getBirthdate(), authorData.getBirthdate());
        assertEquals(Set.of(cData1, cData2), authorData.getCourses());
    }

}
