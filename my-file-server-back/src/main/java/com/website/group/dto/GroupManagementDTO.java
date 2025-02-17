package com.website.group.dto;

import com.website.group.entity.GroupMember;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Setter@Getter@ToString
public class GroupManagementDTO {
    private String name;
    private String description;
    private LocalDate createAt;
    private List<GroupMember> users;

}
