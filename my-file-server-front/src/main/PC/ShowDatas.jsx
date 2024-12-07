import React from 'react';
import s from './ShowDatas.module.css';

const ShowDatas = ({ folder, intoFolder, file, showDetailOfFile, handleContextMenu }) => {
    const matchFileImage = {
        "hwp" : "/hancom.png",
        "hwpx" : "/hancom.png",
        "pdf" : "/pdf.png",
        "mp4" : "/mp4.png",
        "zip" : "/zip.png"
    }
    if (folder) {
        const {
            folderCode,
            folderName,
        } = folder;
        return (
            <div key={folderCode}>
                <div onContextMenu={(e)=>handleContextMenu(e,folderCode)} className={s.fileContainer} onClick={() => intoFolder(folderCode)}>
                    <img src='/folder.png' style={{width: 64, height: 64}} alt='Error'/>
                    <div>{folderName}</div>
                </div>
            </div>
        )
    }
    if (file) {
        const {
            fileCode,
            description
        } = file;
        const fileType = description.split(".").pop();
        let fileImage = '';
        switch(fileType){
            case 'jpg':
            case 'png':
            case 'jpeg':
            case 'gif':
            case 'webp':
                fileImage = file.fileFullPath; break;
            default:
                fileImage = matchFileImage[fileType] || "/defaultImage.png"; break;
        }
        return (
            <div onClick={()=>showDetailOfFile(file)} className={s.fileContainer} key={fileCode}>
                <img src={fileImage} style={{width: 64, height: 64, borderRadius:5}} alt='Error'/>
                <div style={{textAlign:'center'}}>{description}</div>
            </div>
        )
    }
    return (<div>폴더 또는 파일이 존재하지 않습니다.</div>)
};

export default ShowDatas;