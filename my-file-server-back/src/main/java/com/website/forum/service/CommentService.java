package com.website.forum.service;

import com.website.forum.dto.CommentDTO;
import com.website.forum.entity.Comment;
import com.website.forum.repository.CommentRepository;
import com.website.forum.repository.ForumRepository;
import com.website.security.dto.CustomUserDetails;
import com.website.security.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class CommentService {


    private final UserRepository userRepository;
    private final CommentRepository commentRepository;
    private final ForumRepository forumRepository;

    public CommentService(UserRepository userRepository, CommentRepository commentRepository, ForumRepository forumRepository) {
        this.userRepository = userRepository;
        this.commentRepository = commentRepository;
        this.forumRepository = forumRepository;
    }


    /* 댓글 등록 */
    public void registComment(CustomUserDetails user, CommentDTO commentDTO, Long forumCode, String clientIp) {

        Comment newComment = new Comment(
                userRepository.findById(user.getUsername()),
                forumCode,
                commentDTO.getContent(),
                LocalDateTime.now(),
                clientIp
        );
        commentRepository.save(newComment);

    }

    public String removeComment(Long commentCode) {

        commentRepository.deleteById(commentCode);
        return "댓글 삭제 완료";
    }


    public Page<CommentDTO> getCommentList(Pageable pageable, Long forumCode) {

        return commentRepository.findAllByForumCode(pageable, forumCode);

    }
}
