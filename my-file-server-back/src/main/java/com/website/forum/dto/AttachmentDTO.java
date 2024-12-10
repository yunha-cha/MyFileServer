package com.website.forum.dto;

import com.website.forum.entity.Forum;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;

import java.time.LocalDateTime;


@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class AttachmentDTO {

    private Long attachmentCode;

    private Long forumCode;

    private String changedName;

    private String originalName;

    private String fileFullPath;

    private int downloadCount;

    private int size;

    private LocalDateTime uploadDate;
}
