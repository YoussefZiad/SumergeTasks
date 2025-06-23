package com.example.author;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JPAAuthorRepository extends JpaRepository<Author, Integer> {

    List<Author> findByEmail(String email);

}
