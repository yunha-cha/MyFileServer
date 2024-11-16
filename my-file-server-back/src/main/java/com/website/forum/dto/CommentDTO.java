package com.website.forum.dto;

import com.website.forum.entity.Forum;
import com.website.security.entity.User;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@ToString
public class CommentDTO {

    private Long commentCode;

    private User user;

    private Long forumCode;

    private String content;

    private LocalDateTime createAt;

    private String ipAddress;


    /* 등록 */


    /* 조회 */
    public CommentDTO(Long commentCode, User user, String content, LocalDateTime createAt) {
        this.commentCode = commentCode;
        this.user = user;
        this.content = content;
        this.createAt = createAt;
    }
}
