package com.example.rating.mappers;

import com.example.rating.Rating;
import com.example.rating.dto.RatingData;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface RatingMapper {

    RatingMapper INSTANCE = Mappers.getMapper(RatingMapper.class);

    RatingData ratingToRatingData(Rating rating);

}
