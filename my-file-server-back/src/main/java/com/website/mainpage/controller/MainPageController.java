package com.website.mainpage.controller;
import com.website.mainpage.dto.UserPageDTO;
import com.website.mainpage.entity.FileEntity;
import com.website.mainpage.entity.MainUserEntity;
import com.website.mainpage.service.MainPageService;
import com.website.security.dto.CustomUserDetails;
import jakarta.servlet.ServletInputStream;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/main")
public class MainPageController {
    private final MainPageService mainService;
    private static final long ONE_GB = 1024L * 1024L * 1024L; // 1GB in bytes
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
    @GetMapping("/user")
    public ResponseEntity<MainUserEntity> getUser(@AuthenticationPrincipal CustomUserDetails user){
        return ResponseEntity.ok().body(mainService.getUser(user));
    }
    @GetMapping("/other-user/{userCode}")
    public ResponseEntity<?> getUser(@PathVariable Long userCode){
        try{
            UserPageDTO user = mainService.getOtherUser(userCode);
            return ResponseEntity.ok().body(Objects.requireNonNullElse(user, "유저가 없습니다."));
        }
        catch (Exception e){return ResponseEntity.badRequest().body("유저가 없습니다.");}
    }
    @PostMapping("/user")
    public ResponseEntity<?> modifyUser(UserPageDTO user){
        System.out.println(user.getUserId());
        try{
            mainService.modifyUser(user);
            return ResponseEntity.ok().build();
        } catch (Exception e){
            return ResponseEntity.badRequest().build();
        }
    }
    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@AuthenticationPrincipal CustomUserDetails user, @RequestParam("file") MultipartFile file, String description, boolean isPrivate, HttpServletRequest request) {
//        if (!file.isEmpty()) {
//            return ResponseEntity.ok().body(mainService.uploadFile(file, description, user, isPrivate));
//        }
//        return ResponseEntity.ok().body("파일이 존재하지 않습니다.");
        try {
            if (file.getSize() > ONE_GB) {
                System.out.println("파일 크기가 1GB를 초과했습니다. 스트리밍 방식으로 처리합니다.");

                // 스트리밍 방식으로 처리
                try (ServletInputStream inputStream = request.getInputStream()) {
                    mainService.uploadLargeFile(inputStream, description, user, isPrivate);
                }
            } else {
                System.out.println("파일 크기가 1GB 이하입니다. 기존 방식으로 처리합니다.");

                // 기존 MultipartFile 방식으로 처리
                mainService.uploadFile(file, description, user, isPrivate);
            }
            return ResponseEntity.ok("파일 업로드 성공");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("파일 업로드 실패");
        }
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
