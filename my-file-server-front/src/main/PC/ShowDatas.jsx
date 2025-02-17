import React from 'react';
import s from './ShowDatas.module.css';
import { getFileIconByExtension } from '../function';

const ShowDatas = ({ folder, intoFolder, file, showDetailOfFile, handleContextMenu }) => {
    if (folder) {
        const {
            folderCode,
            folderName,
        } = folder;
        return (
            <div key={folderCode}>
                <div onContextMenu={(e)=>handleContextMenu(e,folderCode)} className={s.fileContainer} onClick={() => intoFolder(folderCode)}>
                    <img src='/folder.png' style={{width: 64, height: 64}} alt='Error'/>
                    <div style={{textAlign:'center'}}>{folderName}</div>
                </div>
            </div>
        )
    }
    if (file) {
        const {
            fileCode,
            description
        } = file;
        return (
            <div onClick={()=>showDetailOfFile(file)} className={s.fileContainer} key={fileCode}>
                <img src={getFileIconByExtension(file.fileFullPath)} style={{width: 64, height: 64, borderRadius:5}} alt='Error'/>
                <div style={{textAlign:'center'}}>{description}</div>
            </div>
        )
    }
    return (<div>폴더 또는 파일이 존재하지 않습니다.</div>)
};

export default ShowDatas;