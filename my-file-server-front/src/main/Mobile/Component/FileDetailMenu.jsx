import React from 'react';
import { calcFileSize, formattedDateTime, getFileIconByExtension, truncateString } from '../../function';
import s from './FileDetailMenu.module.css';
import { deleteFile, download } from '../../apiFunction';

function FileDetailMenu({ file, setClose, state,getData }) {
    return (
        <aside className={s.fileDetailMenu} style={state ? { bottom: 0 } : { bottom: '-400px' }}>
            <button className={s.closeFileDetailMenu} onClick={() => setClose(false)}><img className={s.downImg} src='/down-icon.png' alt='Error'/></button>
            <div className={s.fileDetail}>
                <img className={s.fileImg} src={file.fileCode&&getFileIconByExtension(file.fileFullPath)} alt='Error'/>
                <div className={s.inforContainer}>
                    <div><b>이름</b> : {file.description}</div>
                    <div><b>용량</b> : {file.fileCode&&calcFileSize(file.size)}</div>
                    <div style={{fontSize:14}}><b>날짜</b> : {file.fileCode&&formattedDateTime(file.uploadedAt)}</div>
                    <div><b>원본</b> : {file.fileCode&&truncateString(file.originalName, 12)}</div>
                </div>
            </div>
            <div className={s.buttonContainer}>
                <button onClick={()=>{deleteFile(file.fileCode,()=>getData());setClose(false)}} className={s.download}>삭제</button>
                <button onClick={()=>download(file)} className={s.download}>다운로드</button>
            </div>
        </aside>
    );
}

export default FileDetailMenu;