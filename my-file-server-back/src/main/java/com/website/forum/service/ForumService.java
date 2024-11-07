package com.website.forum.service;

import com.website.forum.dto.ForumDTO;
import com.website.forum.dto.ForumDetailDTO;
import com.website.forum.entity.Forum;
import com.website.forum.repository.ForumRepository;
import com.website.security.dto.CustomUserDetails;
import com.website.security.entity.User;
import com.website.security.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

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



    public ForumDetailDTO getForumDetail(Long forumCode) {

        // 1. JPA method 사용하고, getter setter 변환
//         forumRepository.findById(forumCode);

         // 2. jpql 사용하여 method 생성
        return forumRepository.findByForumCode(forumCode);

    }

    public Object registForum(CustomUserDetails user, ForumDTO forumDTO) {

        // user entity 조회
        User registUser = userRepository.findById(user.getUsername());

        Forum newForum = new Forum(
                forumDTO.getForumCode(),
                forumDTO.getTitle(),
                "임시",
                registUser,
                LocalDateTime.now(),
                0,
                "상태",
                forumDTO.getIpAddress()
        );

        forumRepository.save(newForum);

        return "등록 굿";
    }


}
