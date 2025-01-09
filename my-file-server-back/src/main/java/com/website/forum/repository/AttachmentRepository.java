package com.website.forum.repository;

import com.website.forum.dto.AttachmentDTO;
import com.website.forum.entity.Attachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AttachmentRepository extends JpaRepository<Attachment, Long> {
    @Query("SELECT new com.website.forum.dto.AttachmentDTO(a.attachmentCode, a.forumCode, a.changedName, a.originalName, a.fileFullPath, a.downloadCount, a.size, a.uploadDate) FROM Attachment a WHERE a.forumCode=:forumCode")
    List<AttachmentDTO> findAllByForumCode(Long forumCode);
}
