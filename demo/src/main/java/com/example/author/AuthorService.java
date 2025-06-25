package com.example.author;

import com.example.author.dto.AuthorData;
import com.example.author.mappers.AuthorMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthorService {

    private JPAAuthorRepository authorRepository;

    @Autowired
    public AuthorService(JPAAuthorRepository authorRepository) {
        this.authorRepository = authorRepository;
    }

    public Optional<AuthorData> findByEmail(String email){
        Optional<Author> author = authorRepository.findByEmail(email).stream().findFirst();
        return author.map(AuthorMapper.INSTANCE::authorToAuthorData);
    }
}
