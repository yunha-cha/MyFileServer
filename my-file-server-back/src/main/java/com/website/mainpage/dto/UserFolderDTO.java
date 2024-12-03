package com.website.mainpage.dto;

import com.website.mainpage.entity.FolderEntity;

import java.util.ArrayList;
import java.util.List;

public class UserFolderDTO {
    private List<FolderEntity> folders = new ArrayList<>();
    private List<FolderEntity> files = new ArrayList<>();
}
