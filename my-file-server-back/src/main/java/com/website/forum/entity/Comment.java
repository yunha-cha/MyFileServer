package com.website.forum.entity;


import com.website.security.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Table(name = "comment")
public class Comment {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comment_code")
    private Long commentCode;

    @JoinColumn(name = "user_code")
    @ManyToOne
    private User user;

    @JoinColumn(name = "forum_code")
    private Long forumCode;

    @Column(name = "content")
    private String content;

    @Column(name = "create_at")
    private LocalDateTime createAt;

    @Column(name = "ip_address")
    private String ipAddress;


    public Comment(User user, Long forumCode, String content, LocalDateTime createAt, String ipAddress) {
        this.user = user;
        this.forumCode = forumCode;
        this.content = content;
        this.createAt = createAt;
        this.ipAddress = ipAddress;
    }
}
