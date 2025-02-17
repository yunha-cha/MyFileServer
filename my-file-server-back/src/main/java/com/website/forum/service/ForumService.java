package com.website.forum.service;

import com.website.common.Tool;
import com.website.forum.dto.AttachmentDTO;
import com.website.forum.dto.ForumDTO;
import com.website.forum.entity.Attachment;
import com.website.forum.entity.Forum;
import com.website.forum.repository.AttachmentRepository;
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

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ForumService {

    @Value("${file.download-url}")
    private String downloadUrl;
    private final Tool tool;
    private final ForumRepository forumRepository;
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final AttachmentRepository attachmentRepository;

    public ForumService(Tool tool, ForumRepository forumRepository, CommentRepository commentRepository, UserRepository userRepository, AttachmentRepository attachmentRepository) {
        this.tool = tool;
        this.forumRepository = forumRepository;
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
        this.attachmentRepository = attachmentRepository;
    }


    public Page<ForumDTO> getForumList(Pageable pageable) {

        Page<ForumDTO> forumList = forumRepository.findAllForumPage(pageable);
        System.out.println(forumList);
        return forumList;
    }


    public ForumDTO getForumDetail(Long forumCode) {
        List<AttachmentDTO> attachmentDTO = attachmentRepository.findAllByForumCode(forumCode);
        ForumDTO forumDTO = forumRepository.findByForumCode(forumCode);
        forumDTO.setFile(attachmentDTO);
        return forumDTO;
    }


    @Transactional
    public String registForum(CustomUserDetails user, ForumDTO forumDTO, String remoteAddr) {

        User registUser = userRepository.findById(user.getUsername());

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
        newForum = forumRepository.save(newForum);
        List<MultipartFile> files = forumDTO.getFiles();
        if(files != null){
            List<Attachment> attachments = new ArrayList<>();
            for (MultipartFile f : files){
                String changedName = tool.upload(f);
                Attachment attachment = new Attachment(
                        newForum.getForumCode(),
                        changedName,
                        f.getOriginalFilename(),
                        downloadUrl+changedName,
                        0,
                        f.getSize(),
                        LocalDate.now()
                );
                attachments.add(attachment);
            }
            attachmentRepository.saveAll(attachments);
        }
        return "등록 굿";
    }


    @Transactional
    public String removeForum(Long forumCode) {
        Forum forum = forumRepository.findById(forumCode).orElseThrow();

        String regex = "src\\s*=\\s*\"[^\"]*?/download/([^\"]+?)\"";

        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(forum.getContent());
        ArrayList<String> fileNames = new ArrayList<>();

        while (matcher.find()) {
            fileNames.add(matcher.group(1));
        }
        String[] result = fileNames.toArray(new String[0]);

        // 결과 출력
        for (String fileName : result) {
            System.out.println(fileName);
            if(tool.deleteFile(fileName)){
                System.out.println("사진 삭제 성공");
            } else {
                System.out.println("사진 삭제 실패");
            }
        }
        forumRepository.deleteById(forumCode);
        return "게시글 삭제 완료";
    }


    @Transactional
    public void countView(Long forumCode) {
        forumRepository.incrementViewCount(forumCode);
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
