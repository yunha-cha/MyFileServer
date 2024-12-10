import React from 'react';
import { calcFileSize, formattedDateTime, getFileIconByExtension } from '../../function';
import { useSelector } from 'react-redux';
import s from './MobileMainContent.module.css';

const MobilePublicContent = ({contentData}) => {
    const {
        changedName,
        description,
        download_count,
        fileCode,
        fileFullPath,
        originalName,
        size,
        uploadedAt
    } = contentData;
    //유저 정보 가져오기
    const {data} = useSelector((state)=>state.user);
    return (
        <div className={s.object}>
            <div className={s.sort}>
                <img src={getFileIconByExtension(fileFullPath)} className={s.fileIcon}/>
                <div className={s.titleSeparator}>
                    <div className={s.titleStyle}>
                        {description}
                    </div>
                    <div className={s.dateAndSizeSort}>
                        <div className={s.timeStyle}>{formattedDateTime(uploadedAt)}</div>
                        <div className={s.sizeStyle}>{calcFileSize(size)}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobilePublicContent;