package com.examplelib.external;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SampleRepository<T, id> extends JpaRepository<T, id> {

    Page<T> findByCreditGreaterThan(int gt, Pageable pageable);

}
