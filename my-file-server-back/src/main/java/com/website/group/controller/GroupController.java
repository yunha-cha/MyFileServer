package com.website.group.controller;

import com.website.group.dto.GroupCreateDTO;
import com.website.group.entity.Group;
import com.website.group.service.GroupService;
import com.website.mainpage.dto.UserFolderDTO;
import com.website.mainpage.entity.FolderEntity;
import com.website.security.dto.CustomUserDetails;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
public class GroupController {
    private final GroupService groupService;
    public GroupController(GroupService groupService) {
        this.groupService = groupService;
    }

    @GetMapping("/group")
    public ResponseEntity<List<Group>> getMyGroup(@AuthenticationPrincipal CustomUserDetails user){
        return ResponseEntity.ok().body(groupService.getMyGroup(user));
    }
    @PostMapping("/group")
    public ResponseEntity<?> createGroup(GroupCreateDTO groupCreateDTO, @AuthenticationPrincipal CustomUserDetails user){
        groupService.createGroup(groupCreateDTO,user.getUserCode());
        return ResponseEntity.ok().body(groupCreateDTO);
    }
    @GetMapping("/group-root-folder")
    public ResponseEntity<Long> getGroupRootFolder(@RequestParam Long groupCode){
        return ResponseEntity.ok().body(groupService.getGroupRootFolderCode(groupCode));
    }
    @GetMapping("/group/file")
    public ResponseEntity<UserFolderDTO> getDataInGroupFolder(@RequestParam Long folderCode, @RequestParam Long groupCode){
        try {
            System.out.println(folderCode);
            return ResponseEntity.ok().body(groupService.getDataInGroupFolder(folderCode, groupCode));
        } catch (Exception e){
            return ResponseEntity.badRequest().build();
        }
    }
    @PostMapping("/group/folder")
    public ResponseEntity<FolderEntity> createGroupFolder(@RequestParam Long groupCode, @RequestParam String folderName, @RequestParam Long folderCode){
        return ResponseEntity.ok().body(groupService.createGroupFolder(groupCode,folderName,folderCode));
    }
}
