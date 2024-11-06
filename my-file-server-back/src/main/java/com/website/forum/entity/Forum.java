package com.website.forum.entity;


import com.website.security.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Table(name = "forum")
public class Forum {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "forum_code")
    private Long forumCode;

    @Column(name = "title")
    private String title;

    @Column(name = "content")
    private String content;

    @JoinColumn(name = "user_code")
    @ManyToOne
    private User user;

//    @OneToMany(mappedBy = "forum")
//    private List<Comment> commentList;
//
//    @OneToMany(mappedBy = "forum")
//    private List<Attachment> attachmentList;

    @Column(name = "create_at")
    private LocalDateTime createAt;

    @Column(name = "views")
    private int views;

    @Column(name = "status")
    private String status;      // 공개, 비공개

    @Column(name = "ip_address")
    private String ipAddress;




}
