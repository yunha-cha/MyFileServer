package com.website.mainpage.entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "folder")
@Getter@Setter@AllArgsConstructor@NoArgsConstructor
public class FolderEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "folder_code")
    private Long folderCode;
    @Column(name = "folder_name", nullable = false, length = 255)
    private String folderName;
    @Column(name = "create_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    @Column(name = "user_code")
    private Long user;
    @Column(name = "parent_folder_code")
    private Long parentFolderCode;

    @OneToMany(mappedBy = "folder")
    private List<FileEntity> files = new ArrayList<>();

    @Transient
    private List<FolderEntity> folders = new ArrayList<>();

    //parentFolderCode가 이 엔티티에 folderCode랑 같은 애들

    //폴더 리스트가 있으면 얘를 또 조회하는데, 거기 안에 파일 또 존나 많음
}

