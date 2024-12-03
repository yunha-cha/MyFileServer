package com.website.mainpage.repository;

import com.website.mainpage.entity.FolderEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface FolderRepository extends JpaRepository<FolderEntity, Long> {
    @Query("SELECT c.folderCode FROM FolderEntity c WHERE c.user = :userCode AND c.parentFolderCode IS NULL")
    Long getUserRootFolderCode(Long userCode);

    @Query("SELECT f FROM FolderEntity f WHERE f.user = :userCode AND f.folderCode = :folderCode")
    FolderEntity getFileInFolder(Long folderCode, Long userCode);

    @Query("SELECT f FROM FolderEntity f WHERE f.parentFolderCode = :folderCode AND f.user = :userCode")
    List<FolderEntity> getFolderInFolder(Long folderCode, Long userCode);
}
