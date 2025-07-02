package com.example.author;

import com.example.author.dto.AuthorData;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Date;
import java.util.Optional;

import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doThrow;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthorController.class)
public class AuthorControllerTests {

    @Autowired
    private MockMvc mvc;

    @MockitoBean
    private AuthorService service;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void givenAuthor_whenGetAuthorByEmail_thenStatus200()
            throws Exception {

        AuthorData authorData = new AuthorData(1, "Test", "test@test.test", new Date());

        given(service.findByEmail(any(String.class))).willReturn(Optional.of(authorData));

        mvc.perform(get("/api/authors/email/test@test.test")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content()
                        .contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.name", is("Test")));
    }

    @Test
    public void givenEmpty_whenGetCourse_thenStatus404()
            throws Exception {

        given(service.findByEmail(any(String.class))).willReturn(Optional.empty());

        mvc.perform(get("/api/authors/email/test@test.test")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

}
