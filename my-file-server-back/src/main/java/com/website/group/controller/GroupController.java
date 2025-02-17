package com.website.group.controller;

import com.website.group.dto.GroupCreateDTO;
import com.website.group.entity.Group;
import com.website.group.service.GroupService;
import com.website.mainpage.dto.UserFolderDTO;
import com.website.mainpage.entity.FolderEntity;
import com.website.mainpage.entity.MainUserEntity;
import com.website.security.dto.CustomUserDetails;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
public class GroupController {
    private final GroupService groupService;
    public GroupController(GroupService groupService) {
        this.groupService = groupService;
    }

    @GetMapping("/my-group")
    public ResponseEntity<List<Group>> getMyGroups(@AuthenticationPrincipal CustomUserDetails user){
        return ResponseEntity.ok().body(groupService.getMyGroup(user));
    }
    @GetMapping("/group")
    public ResponseEntity<Group> getGroup(@RequestParam Long groupCode, @AuthenticationPrincipal CustomUserDetails user){
        return ResponseEntity.ok().body(groupService.getMyGroup(groupCode));
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
    @DeleteMapping("/group")
    public ResponseEntity<?> deleteGroup(@RequestParam Long groupCode){
        return ResponseEntity.ok().body(groupService.deleteGroup(groupCode));
    }
    @GetMapping("/group/member")
    public ResponseEntity<List<MainUserEntity>> getMembers(@RequestParam Long groupCode){
        return ResponseEntity.ok().body(groupService.getGroupMembers(groupCode));
    }

    @GetMapping("/group/management/{groupCode}")
    public ResponseEntity<?> getGroupAllData(@PathVariable Long groupCode){
        System.out.println(groupCode);
        return ResponseEntity.ok().build();
    }

}
