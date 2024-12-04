import React from 'react';

const ShowDatas = ({ folder, intoFolder, file }) => {
    if (folder) {
        const {
            folderCode,
            folderName,
        } = folder;
        return (
            <div key={folderCode}>
                
                <div onClick={() => intoFolder(folderCode)}>
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
        return (
            <div key={fileCode}>
                <div>{description}</div>
            </div>
        )
    }
    return (<div>폴더 또는 파일이 존재하지 않습니다.</div>)
};

export default ShowDatas;