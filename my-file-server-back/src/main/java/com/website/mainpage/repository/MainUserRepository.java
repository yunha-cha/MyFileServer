package com.website.mainpage.repository;

import com.website.mainpage.entity.MainUserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MainUserRepository extends JpaRepository<MainUserEntity, Long> {

}
