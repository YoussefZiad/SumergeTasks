package com.example.author.mappers;

import com.example.author.Author;
import com.example.author.dto.AuthorData;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface AuthorMapper {

    AuthorMapper INSTANCE = Mappers.getMapper(AuthorMapper.class);

    AuthorData authorToAuthorData(Author author);

}
