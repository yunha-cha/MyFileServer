package com.website.group.repository;

import com.website.group.entity.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface GroupRepository extends JpaRepository<Group, Long> {
    @Query("SELECT g FROM Group g JOIN GroupMember gm ON gm.groupCode=g.groupCode WHERE gm.userCode=:userCode")
    List<Group> getMyGroup(Long userCode);

}
