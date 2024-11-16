package com.website.forum.repository;

import com.website.forum.dto.ForumDTO;
import com.website.forum.entity.Forum;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface ForumRepository extends JpaRepository<Forum, Long> {

    @Query("SELECT new com.website.forum.dto.ForumDTO(f.forumCode, f.title, f.content, f.user.id, f.createAt, f.views) FROM Forum f")
    Page<ForumDTO> findAllForumPage(Pageable pageable);

    @Query("SELECT new com.website.forum.dto.ForumDTO(f.title, f.content, f.user.id, f.createAt, f.views) FROM Forum f WHERE f.forumCode = :forumCode")
    ForumDTO findByForumCode(Long forumCode);

    @Query("SELECT COUNT(f) FROM Forum f WHERE f.user.userCode=:userCode")
    int getUserWrittenPostCount(Long userCode);
}
