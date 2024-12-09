package com.website.mainpage.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@AllArgsConstructor@NoArgsConstructor
@Getter@Setter
public class UserUploadFileDTO {
    private Long fileCode;
    private String changedName;
    private LocalDateTime uploadedAt;
    private String description;
    private String fileFullPath;
    private int downloadCount;
    private String originalName;
    private long size;
    private boolean isPrivate;
    private Long folderCode;
    private String message;

    public UserUploadFileDTO(String message) {
        this.message = message;
    }
}
