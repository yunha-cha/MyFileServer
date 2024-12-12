package com.website.mainpage.service;

import com.website.common.Tool;
import com.website.forum.repository.CommentRepository;
import com.website.forum.repository.ForumRepository;
import com.website.mainpage.dto.UserFolderDTO;
import com.website.mainpage.dto.UserPageDTO;
import com.website.mainpage.dto.UserUploadFileDTO;
import com.website.mainpage.entity.FileEntity;
import com.website.mainpage.entity.FolderEntity;
import com.website.mainpage.entity.MainUserEntity;
import com.website.mainpage.repository.FileRepository;
import com.website.mainpage.repository.FolderRepository;
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
import java.util.List;

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
    private final FolderRepository folderRepository;
    public MainPageService(Tool tool, UserRepository userRepository, MainUserRepository mainUserRepository, FileRepository fileRepository, ForumRepository forumRepository, CommentRepository commentRepository, FolderRepository folderRepository) {
        this.tool = tool;
        this.userRepository = userRepository;
        this.mainUserRepository = mainUserRepository;
        this.fileRepository = fileRepository;
        this.forumRepository = forumRepository;
        this.commentRepository = commentRepository;
        this.folderRepository = folderRepository;
    }
    private String getFileExtension(MultipartFile file) {
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.isEmpty()) {
            return "";
        }
        int dotIndex = originalFilename.lastIndexOf('.');
        if (dotIndex == -1 || dotIndex == originalFilename.length() - 1) {
            return "";
        }
        return originalFilename.substring(dotIndex + 1);
    }
    private FileEntity uploadFile(MultipartFile file, String description, CustomUserDetails user, boolean isPrivate){
        FileEntity fileEntity =  new FileEntity();
        fileEntity.setChangedName(tool.upload(file));
        fileEntity.setUploadedAt(LocalDateTime.now());
        fileEntity.setDescription(description+"."+this.getFileExtension(file));
        fileEntity.setPrivate(isPrivate);
        fileEntity.setSize(file.getSize());
        fileEntity.setFileFullPath(downloadUrl+fileEntity.getChangedName());
        fileEntity.setUploadedByUser(mainUserRepository.findById(user.getUserCode()).orElseThrow());
        fileEntity.setDownload_count(0);
        if(file.getOriginalFilename() != null){
            fileEntity.setOriginalName(StringUtils.cleanPath(file.getOriginalFilename()));
        } else {
            fileEntity.setOriginalName("file");
        }
        return fileRepository.save(fileEntity);
    }
    private UserUploadFileDTO convertFileEntity(FileEntity savedEntity){
        return new UserUploadFileDTO(
                savedEntity.getFileCode(),
                savedEntity.getChangedName(),
                savedEntity.getUploadedAt(),
                savedEntity.getDescription(),
                savedEntity.getFileFullPath(),
                savedEntity.getDownload_count(),
                savedEntity.getOriginalName(),
                savedEntity.getSize(),
                savedEntity.isPrivate(),
                savedEntity.getFolder().getFolderCode(),
                "업로드 성공!"
        );
    }
    @Transactional
    public void uploadPublicFile(MultipartFile file, String description, CustomUserDetails user) {
        FileEntity fileEntity = this.uploadFile(file, description, user, false);
        fileRepository.save(fileEntity);
    }
    @Transactional
    public UserUploadFileDTO uploadPrivateFile(MultipartFile file, String description, CustomUserDetails user, Long folderCode) {
        FileEntity fileEntity = this.uploadFile(file, description, user, true);
        fileEntity.setFolder(folderRepository.findById(folderCode).orElseThrow());
        return convertFileEntity(fileRepository.save(fileEntity));
    }

    public Page<FileEntity> getPublicFiles(int page) {
        Pageable pageable = PageRequest.of(page,15,Sort.by("uploadedAt").descending());
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
    public Long getUserRootFolder(Long userCode) {
        Long userRootFolderCode = folderRepository.getUserRootFolderCode(userCode);
        System.out.println(userRootFolderCode);
        if(userRootFolderCode==null){   //처음에 루트 폴더 만들어주기
            FolderEntity newFolderEntity = new FolderEntity();
            newFolderEntity.setUser(userCode);
            newFolderEntity.setFolderName("rootFolder"+userCode);
            folderRepository.save(newFolderEntity);
            userRootFolderCode = folderRepository.getUserRootFolderCode(userCode);
        }
        return userRootFolderCode;
    }

    public UserFolderDTO getDataInFolder(Long folderCode, Long userCode) throws Exception {
        try{
            List<FolderEntity> folders = folderRepository.getFolderInFolder(userCode, folderCode);
            System.out.println("userCode = " + userCode);
            System.out.println("folderCode = " + folderCode);
            List<FileEntity> files = fileRepository.getFileInFolder(userCode, folderCode);
            return new UserFolderDTO(folderCode, folders, files, "success");
        } catch (Exception e){
            throw new Exception(e.getMessage());
        }
    }

    public FolderEntity createFolder(Long userCode, String folderName, Long folderCode) {
        FolderEntity folder = new FolderEntity();
        if(folderName == null || folderName.equalsIgnoreCase("null") || folderName.length() > 10 || folderName.isBlank()){
            folderName = "새 폴더";
        }
        folder.setFolderName(folderName.trim());
        folder.setParentFolderCode(folderCode);
        folder.setUser(userCode);
        return folderRepository.save(folder);
    }

    @Transactional
    public boolean deleteFolder(Long folderCode, Long userCode) {
        try{
            List<FileEntity> files = fileRepository.getFileInFolder(userCode, folderCode);
            List<FolderEntity> folders = folderRepository.getFolderInFolder(userCode,folderCode);
            folderRepository.deleteAll(folders);
            fileRepository.deleteAll(files);
            folderRepository.deleteById(folderCode);
            return true;
        } catch (Exception e){
            return false;
        }
    }
    @Transactional
    public void modifyFolderName(Long folderCode, String description) {
        FolderEntity folder = folderRepository.findById(folderCode).orElseThrow();
        folder.setFolderName(description);
        folderRepository.save(folder);
    }
}
