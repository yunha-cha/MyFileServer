import React from 'react';
import s from './File.module.css';
import { getFileIconByExtension } from '../../function';
function File({ file, onClick }) {
    return (
        <div>
            <div onClick={()=>onClick(file)} className={s.container}>
                <img className={s.icon} height={50} src={getFileIconByExtension(file.fileFullPath)} />
                <div>
                    <div className={s.name}>{file.description}</div>
                </div>
            </div>
        </div>
    );
}

export default File;