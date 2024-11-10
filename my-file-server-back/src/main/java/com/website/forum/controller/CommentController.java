package com.website.forum.controller;


import com.website.forum.dto.CommentDTO;
import com.website.forum.service.CommentService;
import com.website.security.dto.CustomUserDetails;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comment")
public class CommentController {


    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }


    /* 댓글 조회 */
    // '더보기' 누르면 10개씩 보여주는 걸로
    @GetMapping("/{forumCode}")
    public ResponseEntity<?> getCommentList(@RequestParam int page ,@PathVariable Long forumCode){

        Pageable pageable = PageRequest.of(page, 10, Sort.by("createAt").descending());
        return ResponseEntity.ok().body(commentService.getCommentList(pageable, forumCode));
    }



    /* 댓글 등록 */
    @PostMapping("/{forumCode}")
    public ResponseEntity<String> registComment(@AuthenticationPrincipal CustomUserDetails user, @RequestBody CommentDTO commentDTO, @PathVariable Long forumCode){

        return ResponseEntity.ok().body(commentService.registComment(user, commentDTO, forumCode));

    }


    /* 댓글 삭제 */
    @DeleteMapping("/{commentCode}")
    public ResponseEntity<?> removeComment(@PathVariable Long commentCode){

        return ResponseEntity.ok().body(commentService.removeComment(commentCode));
    }

}
