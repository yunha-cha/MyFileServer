package com.website.mainpage.controller;
import com.website.mainpage.dto.UserFolderDTO;
import com.website.mainpage.dto.UserPageDTO;
import com.website.mainpage.dto.UserUploadFileDTO;
import com.website.mainpage.entity.FileEntity;
import com.website.mainpage.entity.FolderEntity;
import com.website.mainpage.entity.MainUserEntity;
import com.website.mainpage.service.MainPageService;
import com.website.security.dto.CustomUserDetails;
import lombok.Getter;
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
        return ResponseEntity.ok().body(mainService.getUserRootFolder(user.getUserCode()));
    }
    @GetMapping("/folder")
    public ResponseEntity<UserFolderDTO> getFileInFolder(@RequestParam Long folderCode, @AuthenticationPrincipal CustomUserDetails user){
        try{
            return ResponseEntity.ok().body(mainService.getDataInFolder(folderCode, user.getUserCode()));
        } catch (Exception e){
            //에러 내용 상세 응답이기 때문에 나중에 수정할 것!!
            return ResponseEntity.badRequest().body(new UserFolderDTO(e.getMessage()));
        }
    }
    @PostMapping("/folder")
    public ResponseEntity<FolderEntity> createFolder(@RequestParam("folderName") String folderName,@RequestParam("folderCode") Long folderCode, @AuthenticationPrincipal CustomUserDetails user){
        return ResponseEntity.ok().body(mainService.createFolder(user.getUserCode(),folderName, folderCode));
    }
    @DeleteMapping("/folder")
    public ResponseEntity<?> deleteFolder(@RequestParam Long folderCode, @AuthenticationPrincipal CustomUserDetails user){
        if(user!=null){
            return ResponseEntity.ok().body(mainService.deleteFolder(folderCode, user.getUserCode()));
        }else{
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }
    @PostMapping("/upload")
    public ResponseEntity<UserUploadFileDTO> uploadFile(@AuthenticationPrincipal CustomUserDetails user,
                                                        @RequestParam("file") MultipartFile file,
                                                        String description,
                                                        boolean isPrivate,
                                                        Long folderCode)
    {
        if (!file.isEmpty()) {
            return ResponseEntity.ok().body(mainService.uploadPrivateFile(file, description, user, folderCode));
        }
        return ResponseEntity.badRequest().body(new UserUploadFileDTO("파일이 존재하지 않습니다."));
    }
    @PostMapping("/upload/public")
    public ResponseEntity<UserUploadFileDTO> uploadPublicFile(@AuthenticationPrincipal CustomUserDetails user, @RequestParam("file") MultipartFile file, String description){
        if(!file.isEmpty()){
            mainService.uploadPublicFile(file,description,user);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().body(new UserUploadFileDTO("파일이 존재하지 않습니다."));
    }
    @PostMapping("/folder-name")
    public ResponseEntity<?> modifyFolderName(@RequestParam("folderCode") Long folderCode,@RequestParam("description") String description){
        mainService.modifyFolderName(folderCode,description);
        return ResponseEntity.ok().build();
    }

}
