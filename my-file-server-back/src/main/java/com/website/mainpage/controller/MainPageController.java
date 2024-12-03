package com.website.mainpage.controller;
import com.website.mainpage.dto.UserPageDTO;
import com.website.mainpage.entity.FileEntity;
import com.website.mainpage.entity.FolderEntity;
import com.website.mainpage.entity.MainUserEntity;
import com.website.mainpage.service.MainPageService;
import com.website.security.dto.CustomUserDetails;
import lombok.Getter;
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
import java.util.Objects;

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
    public ResponseEntity<String> uploadFile(@AuthenticationPrincipal CustomUserDetails user, @RequestParam("file") MultipartFile file, String description, boolean isPrivate) {
        if (!file.isEmpty()) {
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
    @GetMapping("/root-folder")
    public ResponseEntity<Long> getUserRootFolder(@AuthenticationPrincipal CustomUserDetails user){
        Long a = mainService.getUserRootFolder(user.getUserCode());
        System.out.println(a);
        return ResponseEntity.ok().body(a);
    }
    @GetMapping("/folder")
    public ResponseEntity<?> getFileInFolder(@RequestParam Long folderCode, @AuthenticationPrincipal CustomUserDetails user){
        //폴더 코드랑, 유저가 옴
        //
        try{
            return ResponseEntity.ok().body(mainService.getFileInFolder(folderCode, user.getUserCode()));
        } catch (Exception e){
            System.out.println(e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
}
