package com.website.admin.repository;

import com.website.admin.entity.AdminUserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AdminUserRepository extends JpaRepository<AdminUserEntity, Long> {
    @Query("SELECT u FROM AdminUserEntity u WHERE u.enable = false")
    List<AdminUserEntity> getDisableUser();
}
