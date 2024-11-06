package com.website.mainpage.controller;
import com.website.mainpage.entity.FileEntity;
import com.website.mainpage.service.MainPageService;
import com.website.security.dto.CustomUserDetails;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/main")
@Slf4j
public class MainPageController {
    private final MainPageService mainService;

    public MainPageController(MainPageService mainService) {
        this.mainService = mainService;
    }

    @GetMapping("/file")
    public ResponseEntity<List<FileEntity>> getMyFile(@AuthenticationPrincipal CustomUserDetails user) {
        List<FileEntity> fileEntities = mainService.getMyFile(user);
        return ResponseEntity.ok().body(fileEntities);
    }
    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@AuthenticationPrincipal CustomUserDetails user, @RequestParam("file") MultipartFile file, String description) {
        if (!file.isEmpty()) {
            return ResponseEntity.ok().body(mainService.uploadFile(file, description, user));
        }
        return ResponseEntity.ok().body("파일이 존재하지 않습니다.");
    }
    @PostMapping("/download-count/{fileCode}")
    public void increaseCount(@PathVariable Long fileCode){
        mainService.increaseDownloadCount(fileCode);
    }
}
