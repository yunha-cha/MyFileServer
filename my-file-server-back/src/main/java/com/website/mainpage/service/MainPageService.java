package com.website.mainpage.service;

import com.website.common.Tool;
import com.website.forum.repository.CommentRepository;
import com.website.forum.repository.ForumRepository;
import com.website.mainpage.dto.UserPageDTO;
import com.website.mainpage.entity.FileEntity;
import com.website.mainpage.entity.MainUserEntity;
import com.website.mainpage.repository.FileRepository;
import com.website.mainpage.repository.MainUserRepository;
import com.website.security.dto.CustomUserDetails;
import com.website.security.entity.User;
import com.website.security.repository.UserRepository;
import jakarta.servlet.ServletInputStream;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class MainPageService {
    @Value("${file.download-url}")
    private String downloadUrl;
    @Value("${file.upload-dir}")
    private String uploadDir;
    private final Tool tool;
    private final UserRepository userRepository;
    private final MainUserRepository mainUserRepository;
    private final FileRepository fileRepository;
    private final ForumRepository forumRepository;
    private final CommentRepository commentRepository;
    public MainPageService(Tool tool, UserRepository userRepository, MainUserRepository mainUserRepository, FileRepository fileRepository, ForumRepository forumRepository, CommentRepository commentRepository) {
        this.tool = tool;
        this.userRepository = userRepository;
        this.mainUserRepository = mainUserRepository;
        this.fileRepository = fileRepository;
        this.forumRepository = forumRepository;
        this.commentRepository = commentRepository;
    }
    @Transactional
    public String uploadFile(MultipartFile file, String description, CustomUserDetails user, boolean isPrivate) {
        try{
            System.out.println("메서드 시작");
            FileEntity fileEntity =  new FileEntity();
            fileEntity.setChangedName(tool.upload(file));
            fileEntity.setUploadedAt(LocalDateTime.now());
            fileEntity.setDescription(description);
            fileEntity.setPrivate(isPrivate);
            fileEntity.setSize(file.getSize());
            fileEntity.setFileFullPath(downloadUrl+fileEntity.getChangedName());
            fileEntity.setUploadedByUser(mainUserRepository.findById(user.getUserCode()).orElseThrow());
            fileEntity.setDownload_count(0);
            if(file.getOriginalFilename() != null){
                System.out.println("올리기 시작");
                fileEntity.setOriginalName(StringUtils.cleanPath(file.getOriginalFilename()));
                System.out.println("올리기 끝");
            } else {
                fileEntity.setOriginalName("파일");
            }
            fileRepository.save(fileEntity);
            return "업로드 성공";
        } catch (Exception e){
            return e.getMessage();
        }
    }
    public Page<FileEntity> getPublicFiles(int page) {
        Pageable pageable = PageRequest.of(page,10,Sort.by("uploadedAt").descending());
        return fileRepository.getPublicFile(pageable);
    }
    public Page<FileEntity> getMyFile(CustomUserDetails user, int page) {
        Pageable pageable = PageRequest.of(page,10,  Sort.by("uploadedAt").descending());
        return fileRepository.getMyFile(user.getUserCode(),pageable);
    }
    @Transactional
    public void increaseDownloadCount(Long fileCode) {
        FileEntity fileEntity = fileRepository.findById(fileCode).orElseThrow();
        fileEntity.setDownload_count(fileEntity.getDownload_count() + 1);
    }

    public boolean deleteFile(Long fileCode) {
        FileEntity fileEntity = fileRepository.findById(fileCode).orElseThrow();
        try{
            if(!tool.deleteFile(fileEntity.getChangedName())){
                return false;
            }
            fileRepository.deleteById(fileEntity.getFileCode());
            return true;
        } catch (Exception e){
            return false;
        }

    }

    public MainUserEntity getUser(CustomUserDetails user) {
        return mainUserRepository.findById(user.getUserCode()).orElseThrow();
    }

    public UserPageDTO getOtherUser(Long userCode) {
        MainUserEntity user = mainUserRepository.findById(userCode).orElseThrow();
        int writtenPostCount = forumRepository.getUserWrittenPostCount(userCode);
        int writtenCommentCount = commentRepository.getUserWrittenCommentCount(userCode);
        int uploadCount = fileRepository.getUserFileUploadCount(userCode);
        return new UserPageDTO(
                user.getUserCode(),
                user.getId(),
                writtenPostCount,
                writtenCommentCount,
                uploadCount,
                "/icon.png"
        );
    }

    @Transactional
    public void modifyUser(UserPageDTO user) {
        User userEntity = userRepository.findByUserCode(user.getUserCode());
        userEntity.setId(user.getUserId());
        userRepository.save(userEntity);
    }

    @Transactional
    public String uploadLargeFile(InputStream inputStream, String description, CustomUserDetails user, boolean isPrivate) {
        try {
            System.out.println("스트리밍 방식 메서드 시작");

            // 파일 이름을 고유하게 생성
            String changedName = "test";
            File targetFile = new File(uploadDir + "/" + changedName);

            // 스트리밍 방식으로 파일 저장
            try (BufferedOutputStream outputStream = new BufferedOutputStream(new FileOutputStream(targetFile))) {
                byte[] buffer = new byte[8192];
                int bytesRead;
                while ((bytesRead = inputStream.read(buffer)) != -1) {
                    outputStream.write(buffer, 0, bytesRead);
                }
            }

            // 파일 엔티티 생성 및 저장
            FileEntity fileEntity = new FileEntity();
            fileEntity.setChangedName(changedName);
            fileEntity.setUploadedAt(LocalDateTime.now());
            fileEntity.setDescription(description);
            fileEntity.setPrivate(isPrivate);
            fileEntity.setSize(targetFile.length());
            fileEntity.setFileFullPath(downloadUrl + changedName);
            fileEntity.setUploadedByUser(mainUserRepository.findById(user.getUserCode()).orElseThrow());
            fileEntity.setDownload_count(0);

            // 원본 파일 이름 설정
            fileEntity.setOriginalName("파일");  // 기본 이름 설정
            System.out.println("엔티티 저장 시작");
            fileRepository.save(fileEntity);
            System.out.println("엔티티 저장 완료");

            return "업로드 성공";
        } catch (Exception e) {
            e.printStackTrace();
            return e.getMessage();
        }
    }
}
