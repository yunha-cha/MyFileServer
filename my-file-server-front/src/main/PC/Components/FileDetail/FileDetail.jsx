import React from 'react';
import s from './Filedetail.module.css';
import { calcFileSize, canOpenFile, downloadFile, formattedDateTime, getFileIconByExtension } from '../../../function';

const Filedetail = ({isShowFileDetail,setIsShowFileDetail,selectedFile, openDeleteModal}) => {
    
    const openImage = (fileImage) => {        
        if(canOpenFile(selectedFile)){
            window.open(fileImage, "_blank",'width=500,height=500,menubar=no,toolbar=no,location=no,status=no');
        }
    }

    return (
        <div className={s.afterFileDetail} style={isShowFileDetail ? {} : { display: 'none' }}>
            <button className={s.closeButton} onClick={() => setIsShowFileDetail(false)}>❌</button>
            <div className={s.fileDetail}>
                <div style={{ fontSize: 13, marginTop: 20 }}>사진 파일은 클릭하면 크게 볼 수 있습니다.</div>
                <img onClick={() => openImage()} src={getFileIconByExtension(selectedFile.fileFullPath)} style={{ width: 64, height: 64 }} alt='Error' />
                <div className={s.detailButtonContainer}>
                    <button onClick={() => downloadFile(selectedFile)}>다운로드</button>
                    <button onClick={() => openDeleteModal(selectedFile.fileCode)}>삭제하기</button>
                </div>
                <table className={s.table}>
                    <tbody>
                        <tr>
                            <th>이름 </th>
                            <td>{selectedFile.description}</td>
                        </tr>
                        <tr>
                            <th>용량 </th>
                            <td>{calcFileSize(selectedFile.size)}</td>
                        </tr>
                        <tr>
                            <th>올린 날짜 </th>
                            <td>{formattedDateTime(selectedFile.uploadedAt)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Filedetail;