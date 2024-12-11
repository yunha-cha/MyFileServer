import React from 'react';
import { calcFileSize, formattedDateTime, getFileIconByExtension } from '../../function';
import { useSelector } from 'react-redux';
import s from './MobileMainContent.module.css';
import { FaTrashAlt } from "react-icons/fa";

const MobilePublicContent = ({contentData, setFileDetail}) => {
    const {
        // changedName,
        description,
        // download_count,
        // fileCode,
        fileFullPath,
        // originalName,
        size,
        uploadedAt,
        uploadedByUser
    } = contentData;
    //유저 정보 가져오기
    const {data} = useSelector((state)=>state.user);
    return (
        <div className={s.object} onClick={()=> setFileDetail((prevData) => ({
            ...prevData, // 이전 상태 복사
            isOpen: true, // 상태 업데이트
            file: contentData // 새 데이터 추가
        }))}>
            <div className={s.sort}>
                <img src={getFileIconByExtension(fileFullPath)} className={s.fileIcon} alt='fileIcon'/>
                <div className={s.titleSeparator}>
                    <div className={s.titleStyle}>
                        {description}
                    </div>
                    <div className={s.dateAndSizeSort}>
                        <div className={s.timeStyle}>{formattedDateTime(uploadedAt)}</div>
                        <div className={s.sizeStyle}>{calcFileSize(size)}</div>
                    </div>
                </div>
                {data.userCode === uploadedByUser.userCode && 
                <FaTrashAlt size={15} color="#ff2020" style={{alignSelf:'center'}}/>}
            </div>
        </div>
    );
};

export default MobilePublicContent;