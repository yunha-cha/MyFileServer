package com.website.forum.dto;

import lombok.*;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class ForumDTO {

    private Long forumCode;

    private String title;

    private String content;

    private String userId;

    private LocalDateTime createAt;

    private int views;

    private String status;     // 삭제 여부

    private String ipAddress;


    // 전체 조회
    public ForumDTO(Long forumCode, String title, String content,String userId, LocalDateTime createAt, int views) {
        this.forumCode = forumCode;
        this.title = title;
        this.content = content;
        this.userId = userId;
        this.createAt = createAt;
        this.views = views;
    }

    // 상세 조회
    public ForumDTO(String title, String content, String userId, LocalDateTime createAt, int views) {
        this.title = title;
        this.content = content;
        this.userId = userId;
        this.createAt = createAt;
        this.views = views;
    }


    // 등록
    public ForumDTO(String title, String userId, LocalDateTime createAt, String ipAddress) {
        this.title = title;
//        this.content = content;
        this.userId = userId;
        this.createAt = createAt;
        this.ipAddress = ipAddress;
    }
}
