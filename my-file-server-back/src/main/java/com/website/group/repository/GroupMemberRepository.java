package com.website.group.repository;

import com.website.group.entity.GroupMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GroupMemberRepository extends JpaRepository<GroupMember, Long> {
    List<GroupMember> findAllByGroupCode(Long groupCode);
}
