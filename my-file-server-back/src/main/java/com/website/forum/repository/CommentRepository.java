package com.website.forum.repository;

import com.website.forum.dto.CommentDTO;
import com.website.forum.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CommentRepository extends JpaRepository<Comment, Long> {


    @Query("SELECT new com.website.forum.dto.CommentDTO(c.user, c.content, c.createAt) FROM Comment c")
    Page<CommentDTO> findAllByForumCode(Pageable pageable, Long forumCode);
}
