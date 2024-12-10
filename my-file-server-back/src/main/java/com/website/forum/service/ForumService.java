package com.website.forum.service;

import com.website.common.Tool;
import com.website.forum.dto.ForumDTO;
import com.website.forum.entity.Attachment;
import com.website.forum.entity.Forum;
import com.website.forum.repository.CommentRepository;
import com.website.forum.repository.ForumRepository;
import com.website.security.dto.CustomUserDetails;
import com.website.security.entity.User;
import com.website.security.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ForumService {

    @Value("${file.download-url}")
    private String downloadUrl;
    private final Tool tool;
    private final ForumRepository forumRepository;
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;

    public ForumService(Tool tool, ForumRepository forumRepository, CommentRepository commentRepository, UserRepository userRepository) {
        this.tool = tool;
        this.forumRepository = forumRepository;
        this.commentRepository = commentRepository;
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

//        Forum removedForum = forumRepository.findById(forumCode).orElseThrow(() -> new NoSuchElementException("데이터가 없음"));
        // 게시글의 댓글 먼저 삭제
        commentRepository.deleteByForumCode(forumCode);
        forumRepository.deleteById(forumCode);
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

            System.out.println("hasViewed = " + hasViewed);
            System.out.println(session.getAttribute(sessionKey));
            forumRepository.incrementViewCount(forumCode);
            session.setAttribute(sessionKey, true);
        } else{
            System.out.println("hasViewed = " + hasViewed);

        }

    }


    public String uploadEditorImg(MultipartFile file) {


        return tool.upload(file);
    }

    public List<String> uploadAttachment(List<MultipartFile> files) {
        List<String> filePaths = new ArrayList<>();
        for(MultipartFile file : files){
            filePaths.add(tool.upload(file));
        }
        return filePaths;
    }
}
