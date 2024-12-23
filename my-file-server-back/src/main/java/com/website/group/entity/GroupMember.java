package com.website.group.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "group_member")
@AllArgsConstructor
@NoArgsConstructor
@Getter@Setter
public class GroupMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "group_member_code")
    private Long groupMemberCode;
    @Column(name = "group_code")
    private Long groupCode;
    @Column(name = "user_Code")
    private Long userCode;
    @Column(name = "join_date")
    private LocalDate joinDate;

    public GroupMember(Long groupCode, Long userCode, LocalDate joinDate) {
        this.groupCode = groupCode;
        this.userCode = userCode;
        this.joinDate = joinDate;
    }
}
