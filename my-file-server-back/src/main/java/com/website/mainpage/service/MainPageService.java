package com.website.mainpage.service;

import com.website.common.Tool;
import com.website.mainpage.entity.FileEntity;
import com.website.mainpage.repository.FileRepository;
import com.website.security.dto.CustomUserDetails;
import com.website.security.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MainPageService {
    @Value("${file.download-url}")
    private String downloadUrl;
    private final Tool tool;
    private final UserRepository userRepository;
    private final FileRepository fileRepository;

    public MainPageService(Tool tool, UserRepository userRepository, FileRepository fileRepository) {
        this.tool = tool;
        this.userRepository = userRepository;
        this.fileRepository = fileRepository;
    }
    @Transactional
    public String uploadFile(MultipartFile file, String description, CustomUserDetails user) {
        try{
            FileEntity fileEntity =  new FileEntity();
            fileEntity.setChangedName(tool.upload(file));
            fileEntity.setUploadedAt(LocalDateTime.now());
            fileEntity.setDescription(description);
            fileEntity.setFileFullPath(downloadUrl+fileEntity.getChangedName());
            fileEntity.setUploadedByUser(userRepository.findById(user.getUsername()));
            fileEntity.setDownload_count(0);
            if(file.getOriginalFilename() != null){
                fileEntity.setOriginalName(StringUtils.cleanPath(file.getOriginalFilename()));
            } else {
                fileEntity.setOriginalName("파일");
            }
            fileRepository.save(fileEntity);
            return "업로드 성공";
        } catch (Exception e){
            return e.getMessage();
        }
    }

    public List<FileEntity> getMyFile(CustomUserDetails user) {
        return fileRepository.getMyFile(user.getUserCode());
    }
    @Transactional
    public void increaseDownloadCount(Long fileCode) {
        FileEntity fileEntity = fileRepository.findById(fileCode).orElseThrow();
        fileEntity.setDownload_count(fileEntity.getDownload_count() + 1);
    }
}
