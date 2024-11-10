package com.website.mainpage.controller;
import com.website.mainpage.entity.FileEntity;
import com.website.mainpage.service.MainPageService;
import com.website.security.dto.CustomUserDetails;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
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
public class MainPageController {
    private final MainPageService mainService;

    public MainPageController(MainPageService mainService) {
        this.mainService = mainService;
    }

    @GetMapping("/file/public")
    public ResponseEntity<Page<FileEntity>> getPublicFile(@RequestParam int page){
        Page<FileEntity> fileEntities = mainService.getPublicFiles(page);
        return ResponseEntity.ok().body(fileEntities);
    }
    @GetMapping("/file")
    public ResponseEntity<Page<FileEntity>> getMyFile(@AuthenticationPrincipal CustomUserDetails user,@RequestParam int page) {
        Page<FileEntity> fileEntities = mainService.getMyFile(user,page);
        return ResponseEntity.ok().body(fileEntities);
    }
    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@AuthenticationPrincipal CustomUserDetails user, @RequestParam("file") MultipartFile file, String description, boolean isPrivate) {
        if (!file.isEmpty()) {
            System.out.println(isPrivate);
            return ResponseEntity.ok().body(mainService.uploadFile(file, description, user, isPrivate));
        }
        return ResponseEntity.ok().body("파일이 존재하지 않습니다.");
    }
    @PostMapping("/download-count/{fileCode}")
    public void increaseCount(@PathVariable Long fileCode){
        mainService.increaseDownloadCount(fileCode);
    }
    @DeleteMapping("/file/{fileCode}")
    public ResponseEntity<String> deleteFile(@PathVariable Long fileCode){
        if(mainService.deleteFile(fileCode)){
            return ResponseEntity.ok().body("삭제 성공!");
        } else { return ResponseEntity.badRequest().body("삭제 실패!");}
    }
}
