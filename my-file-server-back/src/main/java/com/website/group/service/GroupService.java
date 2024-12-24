package com.website.group.service;

import com.website.common.Tool;
import com.website.group.dto.GroupCreateDTO;
import com.website.group.entity.Group;
import com.website.group.entity.GroupMember;
import com.website.group.repository.GroupMemberRepository;
import com.website.group.repository.GroupRepository;
import com.website.mainpage.dto.UserFolderDTO;
import com.website.mainpage.dto.UserUploadFileDTO;
import com.website.mainpage.entity.FileEntity;
import com.website.mainpage.entity.FolderEntity;
import com.website.mainpage.repository.FileRepository;
import com.website.mainpage.repository.FolderRepository;
import com.website.mainpage.repository.MainUserRepository;
import com.website.security.dto.CustomUserDetails;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class GroupService {
    @Value("${file.download-url}")
    private String downloadUrl;
    private final GroupRepository groupRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final FolderRepository folderRepository;
    private final FileRepository fileRepository;
    private final MainUserRepository mainUserRepository;
    private final Tool tool;
    public GroupService(GroupRepository groupRepository, GroupMemberRepository groupMemberRepository, FolderRepository folderRepository, FileRepository fileRepository, MainUserRepository mainUserRepository, Tool tool) {
        this.groupRepository = groupRepository;
        this.groupMemberRepository = groupMemberRepository;
        this.folderRepository = folderRepository;
        this.fileRepository = fileRepository;
        this.mainUserRepository = mainUserRepository;
        this.tool = tool;
    }



    @Transactional
    public void createGroup(GroupCreateDTO groupCreateDTO, Long userCode) {
        Group group = new Group(groupCreateDTO.getGroupName(), LocalDate.now(),groupCreateDTO.getDescription(),userCode);
        Group newGroup = groupRepository.save(group);
        List<GroupMember> groupMembers = new ArrayList<>();
        for(Long g : groupCreateDTO.getUserCodes()){
            GroupMember groupMember = new GroupMember();
            groupMember.setGroupCode(newGroup.getGroupCode());
            groupMember.setJoinDate(LocalDate.now());
            groupMember.setUserCode(g);
            groupMembers.add(groupMember);
        }
        groupMembers.add(new GroupMember(group.getGroupCode(), userCode, LocalDate.now()));
        groupMemberRepository.saveAll(groupMembers);
        FolderEntity folder = new FolderEntity();
        folder.setFolderName("group"+group.getGroupCode()+"RootFolder");
        folder.setGroupCode(group.getGroupCode());
        folder.setCreatedAt(LocalDateTime.now());
        folderRepository.save(folder);
    }

    public List<Group> getMyGroup(CustomUserDetails user) {
        return groupRepository.getMyGroup(user.getUserCode());
    }

    public Long getGroupRootFolderCode(Long groupCode) {
        return folderRepository.getGroupRootFolderCode(groupCode);
    }
    public UserFolderDTO getDataInGroupFolder(Long folderCode, Long groupCode) throws Exception {
        try {
            List<FolderEntity> folders = folderRepository.getFolderInFolderGroup(folderCode,groupCode);
            List<FileEntity> files = fileRepository.getFileInGroupFolder(folderCode);
            return new UserFolderDTO(folderCode, folders, files, "success");
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    @Transactional
    public FolderEntity createGroupFolder(Long groupCode, String folderName, Long folderCode) {
        FolderEntity folder = new FolderEntity();
        if(folderName == null || folderName.equalsIgnoreCase("null") || folderName.length() > 10 || folderName.isBlank()){
            folderName = "새 폴더";
        }
        folder.setFolderName(folderName.trim());
        folder.setParentFolderCode(folderCode);
        folder.setGroupCode(groupCode);
        return folderRepository.save(folder);
    }

    public Group getMyGroup(Long groupCode) {
        return groupRepository.findById(groupCode).orElseThrow();
    }

    @Transactional
    public boolean deleteGroup(Long groupCode) {
        try {
            //그룹 cascade 되어있어서 한 번에 다 삭제됨 서버의 파일 지워야 함
            List<FolderEntity> folders = folderRepository.findAllByGroupCode(groupCode);
            List<FileEntity> fileEntities = fileRepository.findAllByFolderIn(folders);
            for (FileEntity f : fileEntities) {
                tool.deleteFile(f.getChangedName());
            }
            groupRepository.deleteById(groupCode);
            return true;
        }catch (Exception e){
            return false;
        }
    }
}
