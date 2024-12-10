import React from 'react';
import { calcFileSize, canOpenFile } from '../../function';
import s from './FileDetailMenu.module.css';

function FileDetailMenu({ file, setClose, state }) {
    return (
        <aside className={s.fileDetailMenu} style={state ? { bottom: 0 } : { bottom: '-400px' }}>
            <button className={s.closeFileDetailMenu} onClick={() => setClose(false)}>닫기</button>
            <div className={s.fileDetail}>
                <img src={file.fileCode&&canOpenFile(file)?file.fileFullPath:'/defaultImage.png'} alt='Error'/>
                <div>
                    <div>이름 : {file.description}</div>
                    <div>용량 : {calcFileSize(file.size)}</div>
                </div>
            </div>
        </aside>
    );
}

export default FileDetailMenu;