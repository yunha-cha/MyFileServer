package com.website.mainpage.dto;

import com.website.mainpage.entity.FileEntity;
import com.website.mainpage.entity.FolderEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Setter@Getter
public class UserFolderDTO {
    private List<FolderEntity> folders = new ArrayList<>();
    private List<FileEntity> files = new ArrayList<>();
    private String message;

    public UserFolderDTO(String message) {
        this.message = message;
    }
}
