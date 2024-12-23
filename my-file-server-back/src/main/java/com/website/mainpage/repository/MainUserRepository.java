package com.website.mainpage.repository;

import com.website.mainpage.entity.MainUserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MainUserRepository extends JpaRepository<MainUserEntity, Long> {

    @Query("SELECT u FROM MainUserEntity u WHERE u.id LIKE :id")
    List<MainUserEntity> findAllByUserId(String id);
}
