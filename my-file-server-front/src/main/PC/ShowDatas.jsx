import React from 'react';
import s from './ShowDatas.module.css';

const ShowDatas = ({ folder, intoFolder, file, showDetailOfFile }) => {
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
                <div className={s.fileContainer} onClick={() => intoFolder(folderCode)}>
                    <img src='/folder.png' style={{width: 64, height: 64}}/>
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
        const fileImage = matchFileImage[fileType] || "/defaultImage.png";
        return (
            <div onClick={()=>showDetailOfFile(file)} className={s.fileContainer} key={fileCode}>
                <img src={fileImage} style={{width: 64, height: 64}}/>
                <div>{description}</div>
            </div>
        )
    }
    return (<div>폴더 또는 파일이 존재하지 않습니다.</div>)
};

export default ShowDatas;