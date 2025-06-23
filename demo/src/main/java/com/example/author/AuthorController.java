package com.example.author;

import com.example.author.dto.AuthorData;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/authors")
@Tag(name = "Author API", description = "API for Author Entity")
public class AuthorController {

    private AuthorService authorService;

    @Autowired
    public AuthorController(AuthorService authorService){
        this.authorService = authorService;
    }

    @GetMapping("/email/{email}")
    @Operation(summary = "Find Author by email", description = "Find Author by email")
    public Optional<AuthorData> findByEmail(String email){
        return authorService.findByEmail(email);
    }

}
