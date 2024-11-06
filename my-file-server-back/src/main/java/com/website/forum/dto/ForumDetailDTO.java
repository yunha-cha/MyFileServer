package com.website.forum.dto;

import lombok.*;

import java.time.LocalDateTime;

@NoArgsConstructor
@Getter
@Setter
@ToString
public class ForumDetailDTO extends ForumDTO{

    private String content;

    public ForumDetailDTO(String title, String userId, LocalDateTime createAt, int views, String content) {
        super(title, userId, createAt, views);
        this.content = content;
    }
}
