package com.website.mainpage.repository;

import com.website.mainpage.entity.FileEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface FileRepository extends JpaRepository<FileEntity, Long> {

    @Query("SELECT f FROM FileEntity f WHERE f.uploadedByUser.userCode=:userCode")
    Page<FileEntity> getMyFile(Long userCode, Pageable pageable);
}
