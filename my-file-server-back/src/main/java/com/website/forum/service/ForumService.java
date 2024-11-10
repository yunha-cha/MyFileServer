package com.website.forum.service;

import com.website.forum.dto.ForumDTO;
import com.website.forum.entity.Forum;
import com.website.forum.repository.ForumRepository;
import com.website.security.dto.CustomUserDetails;
import com.website.security.entity.User;
import com.website.security.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.NoSuchElementException;

@Service
public class ForumService {

    private final ForumRepository forumRepository;
    private final UserRepository userRepository;

    public ForumService(ForumRepository forumRepository, UserRepository userRepository) {
        this.forumRepository = forumRepository;
        this.userRepository = userRepository;
    }


    public Page<ForumDTO> getForumList(Pageable pageable) {

        Page<ForumDTO> forumList = forumRepository.findAllForumPage(pageable);
        System.out.println("forumService: " + forumList);
        return forumList;
    }


    public ForumDTO getForumDetail(Long forumCode) {

        return forumRepository.findByForumCode(forumCode);
    }


    @Transactional
    public String registForum(CustomUserDetails user, ForumDTO forumDTO) {

        // user entity 조회
        User registUser = userRepository.findById(user.getUsername());

        // 1. 객체 생성해서 save      2. setter 사용
        Forum newForum = new Forum(
                forumDTO.getForumCode(),
                forumDTO.getTitle(),
                "임시 content",
                registUser,
                LocalDateTime.now(),
                0,
                "비공개",
                forumDTO.getIpAddress()
        );
        forumRepository.save(newForum);

        return "등록 굿";
    }


    public String removeForum(Long forumCode) {

        Forum removedForum = forumRepository.findById(forumCode).orElseThrow(() -> new NoSuchElementException("데이터가 없음"));
        forumRepository.delete(removedForum);
        return "게시글 삭제 완료";
    }




}
