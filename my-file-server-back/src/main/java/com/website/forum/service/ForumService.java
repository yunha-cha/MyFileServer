package com.website.forum.service;

import com.website.common.Tool;
import com.website.forum.dto.ForumDTO;
import com.website.forum.entity.Forum;
import com.website.forum.repository.ForumRepository;
import com.website.security.dto.CustomUserDetails;
import com.website.security.entity.User;
import com.website.security.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.NoSuchElementException;

@Service
public class ForumService {

    private final Tool tool;
    private final ForumRepository forumRepository;
    private final UserRepository userRepository;

    public ForumService(Tool tool, ForumRepository forumRepository, UserRepository userRepository) {
        this.tool = tool;
        this.forumRepository = forumRepository;
        this.userRepository = userRepository;
    }


    public Page<ForumDTO> getForumList(Pageable pageable) {

        Page<ForumDTO> forumList = forumRepository.findAllForumPage(pageable);
        System.out.println(forumList);
        return forumList;
    }


    public ForumDTO getForumDetail(Long forumCode) {

        return forumRepository.findByForumCode(forumCode);
    }


    @Transactional
    public String registForum(CustomUserDetails user, ForumDTO forumDTO, String remoteAddr) {

        // user entity 조회
        User registUser = userRepository.findById(user.getUsername());

        // 1. 객체 생성해서 save      2. setter 사용
        Forum newForum = new Forum(
                forumDTO.getForumCode(),
                forumDTO.getTitle(),
                forumDTO.getContent(),
                registUser,
                LocalDateTime.now(),
                0,
                "비공개",
                remoteAddr
        );
        forumRepository.save(newForum);

        return "등록 굿";
    }


    @Transactional
    public String removeForum(Long forumCode) {

        Forum removedForum = forumRepository.findById(forumCode).orElseThrow(() -> new NoSuchElementException("데이터가 없음"));
        forumRepository.delete(removedForum);
        return "게시글 삭제 완료";
    }


    @Transactional
    public void countView(Long forumCode, String remoteAddr) {

        System.out.println("forumCode = " + forumCode);
        System.out.println("request = " + remoteAddr);

        ServletRequestAttributes attr = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
        HttpSession session = attr.getRequest().getSession(true);

        String sessionKey = "viewedForum_" + forumCode + "_ip_" + remoteAddr;
        Boolean hasViewed = (Boolean) session.getAttribute(sessionKey);


        if(hasViewed == null || !hasViewed){
            forumRepository.incrementViewCount(forumCode);
            session.setAttribute(sessionKey, true);
        }

    }


    public String uploadEditorImg(MultipartFile file) {


        return tool.upload(file);
    }
}
