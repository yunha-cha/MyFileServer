package com.website.admin.controller;

import com.website.admin.entity.AdminUserEntity;
import com.website.admin.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Stack;

@RestController
@RequestMapping("/admin")
public class AdminController {
    private final AdminService adminService;
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/disable-user")
    public ResponseEntity<List<AdminUserEntity>> getDisableUser(){
        List<AdminUserEntity> adminUserEntities = adminService.getDisableUser();
        return ResponseEntity.ok().body(adminUserEntities);
    }
    @PostMapping("/user-enable/{userCode}")
    public ResponseEntity<String> enableUser(@PathVariable Long userCode){
        adminService.enableUser(userCode);
        return ResponseEntity.ok().body("활성화 성공");
    }
}
