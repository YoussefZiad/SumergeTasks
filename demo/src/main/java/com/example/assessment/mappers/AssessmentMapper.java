package com.example.assessment.mappers;

import com.example.assessment.Assessment;
import com.example.assessment.dto.AssessmentData;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface AssessmentMapper {

    AssessmentMapper INSTANCE = Mappers.getMapper(AssessmentMapper.class);

    AssessmentData assessmentToAssessmentData(Assessment assessment);

}
