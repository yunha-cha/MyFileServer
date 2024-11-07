package com.website.forum.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Table(name = "attachment")
public class Attachment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "attachment_code")
    private Long attachmentCode;

    @JoinColumn(name = "forum_code")
    @ManyToOne
    private Forum forum;

    @Column(name = "changed_name")
    private String changedName;

    @Column(name = "original_name")
    private String originalName;

    @Column(name = "file_full_path")
    private String fileFullPath;

    @Column(name = "download_count")
    private int downloadCount;

    @Column(name = "size")
    private int size;
}
