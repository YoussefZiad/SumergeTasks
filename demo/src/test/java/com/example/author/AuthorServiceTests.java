package com.example.author;

import com.example.author.dto.AuthorData;
import com.example.author.mappers.AuthorMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.text.ParseException;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.spy;

@ExtendWith(MockitoExtension.class)
public class AuthorServiceTests {

    @Mock
    private JPAAuthorRepository repository;

    @Spy
    private AuthorMapper mapper = spy(AuthorMapper.INSTANCE);

    @InjectMocks
    private AuthorService service;

    @Test
    public void givenAuthor_whenGetAuthorByEmail_thenReturnsAuthorData() throws ParseException {

        Date authorBirthDate = new Date();
        Author author = new Author(1, "Test Author", "test@test.test", authorBirthDate);

        AuthorData authorData = new AuthorData(1, "Test Author", "test@test.test", authorBirthDate);

        given(repository.findByEmail(any(String.class))).willReturn(List.of(author));

        given(mapper.authorToAuthorData(author)).willReturn(authorData);

        Optional<AuthorData> optionalAuthorData = service.findByEmail("test@test.test");

        then(repository).should().findByEmail("test@test.test");

        assertTrue(optionalAuthorData.isPresent(), "Author Should be found");

        assertEquals(authorData, optionalAuthorData.get(),
                "Returned author data should match input data");

    }

    @Test
    public void givenEmpty_whenGetAuthorByEmail_thenReturnsEmpty(){

        given(repository.findByEmail(any(String.class))).willReturn(List.of());

        Optional<AuthorData> authorData = service.findByEmail("test@test.test");

        then(repository).should().findByEmail("test@test.test");

        assertTrue(authorData.isEmpty(), "Author Should not be found");

    }

}
