package com.website.group.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter@Setter
public class GroupCreateDTO {
    private List<Long> userCodes;
    private String groupName;
    private String description;
}
