package com.website.mainpage.repository;

import com.website.mainpage.entity.FolderEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FolderRepository extends JpaRepository<FolderEntity, Long> {
    /**
     * 유저의 개인 클라우드의 최 상단 폴더의 코드를 가져온다.
     * @param userCode 유저 기본 키
     * @return 폴더 기본 키
     */
    @Query("SELECT c.folderCode FROM FolderEntity c WHERE c.user = :userCode AND c.parentFolderCode IS NULL")
    Long getUserRootFolderCode(Long userCode);

    /**
     * 어떤 폴더 안에 있는 폴더를 모두 가져온다.
     * @param folderCode 폴더 기본 키
     * @param userCode 유저 기본 키
     * @return 폴더 List
     */
    @Query("SELECT f FROM FolderEntity f WHERE f.parentFolderCode = :folderCode AND f.user = :userCode")
    List<FolderEntity> getFolderInFolder(Long userCode, Long folderCode);

    @Query("SELECT f.folderCode FROM FolderEntity f WHERE f.groupCode=:groupCode AND f.parentFolderCode IS NULL")
    Long getGroupRootFolderCode(Long groupCode);
    @Query("SELECT f FROM FolderEntity f WHERE f.parentFolderCode=:folderCode AND f.groupCode=:groupCode")
    List<FolderEntity> getFolderInFolderGroup(Long folderCode,Long groupCode);
}
