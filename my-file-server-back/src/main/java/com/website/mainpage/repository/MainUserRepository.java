package com.website.mainpage.repository;

import com.website.mainpage.dto.UserPageDTO;
import com.website.mainpage.entity.MainUserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface MainUserRepository extends JpaRepository<MainUserEntity, Long> {

}
