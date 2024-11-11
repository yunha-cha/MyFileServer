package com.website.admin.service;

import com.website.admin.entity.AdminUserEntity;
import com.website.admin.repository.AdminUserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {
    private final AdminUserRepository adminUserRepository;
    public AdminService(AdminUserRepository adminUserRepository) {
        this.adminUserRepository = adminUserRepository;
    }

    public List<AdminUserEntity> getDisableUser() {
        return adminUserRepository.getDisableUser();
    }

    public void enableUser(Long userCode) {
        AdminUserEntity user = adminUserRepository.findById(userCode).orElseThrow();
        user.setEnable(true);
        adminUserRepository.save(user);
    }
}
