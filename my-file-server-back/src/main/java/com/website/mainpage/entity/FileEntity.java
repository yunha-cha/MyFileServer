package com.website.mainpage.entity;

import com.website.security.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "file")
@AllArgsConstructor
@NoArgsConstructor
@Setter@Getter
public class FileEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "file_code")
    private Long fileCode;
    @Column(name = "changed_name")
    private String changedName;
    @Column(name = "uploaded_at")
    private LocalDateTime uploadedAt;
    @Column(name = "description")
    private String description;
    @Column(name = "file_full_path")
    private String fileFullPath;
    @JoinColumn(name = "uploaded_by")
    @ManyToOne
    private User uploadedByUser;
    @Column(name = "download_count")
    private int download_count;
    @Column(name = "original_name")
    private String originalName;
    @Column(name = "size")
    private long size;
    @Column(name = "is_private")
    private boolean isPrivate;
}
