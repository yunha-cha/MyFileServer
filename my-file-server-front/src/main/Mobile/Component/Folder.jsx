import React from 'react';
import s from './Folder.module.css';

function Folder({folder, intoFolder}) {
    return (
        <div onClick={()=>intoFolder(folder.folderCode)} className={s.container}>
            <img className={s.icon} height={50} src='/folder.png' alt='Error'/>
            <div>
                <div className={s.name}>{folder.folderName}</div>
            </div>
        </div>
    );
}

export default Folder;