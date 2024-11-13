package com.website.security.controller;

import com.website.security.dto.JoinDTO;
import com.website.security.entity.User;
import com.website.security.service.JoinService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@ResponseBody
public class JoinController {

    private final JoinService joinService;

    public JoinController(JoinService joinService) {
        this.joinService = joinService;
    }

    @PostMapping("/join")
    public ResponseEntity<String> joinUser(JoinDTO joinDTO){
        try {
            joinService.joinUser(joinDTO);
            return ResponseEntity.ok().body("회원가입에 성공했습니다. 로그인해주세요.");
        } catch (Exception e){
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("회원가입에 실패했습니다. : "+e.getMessage());
        }
    }
}
