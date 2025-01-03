import React, { useState } from 'react';
import s from './Filedetail.module.css';
import { calcFileSize, canOpenFile, downloadFile, formattedDateTime, getFileIconByExtension } from '../../../function';
import { Tooltip } from 'react-tooltip';
import { Loading } from '../../../../common/Loading';

const Filedetail = ({isShowFileDetail,setIsShowFileDetail,selectedFile, openDeleteModal}) => {
    const [loading, setLoading] = useState(false);
    const openImage = (fileImage) => {        
        if(canOpenFile(selectedFile)){
            console.log(fileImage);
            
            window.open(selectedFile.fileFullPath, "_blank",'width=500,height=500,menubar=no,toolbar=no,location=no,status=no');
        }
    }

    return (
        <div className={s.afterFileDetail} style={isShowFileDetail ? {} : { display: 'none' }}>
            <Tooltip id="preview-tooltip" />
            <button className={s.closeButton} onClick={() => setIsShowFileDetail(false)}>❌</button>
            <div className={s.fileDetail}>
                <div data-tooltip-id='preview-tooltip' data-tooltip-content="사진, 동영상, 음악 등" style={{ fontSize: 13, marginTop: 20 }}>일부 파일은 클릭하면 크게 볼 수 있습니다.<br/> <b>아이콘에 마우스를 올려</b> 확인해보세요.</div>
                <img data-tooltip-id='preview-tooltip' data-tooltip-content={canOpenFile(selectedFile)?"미리 볼 수 있습니다.😊":"미리 볼 수 없습니다.😭"} onClick={() => openImage()} src={getFileIconByExtension(selectedFile.fileFullPath)} style={{ width: 64, height: 64 }} alt='Error' />
                <div className={s.detailButtonContainer}>
                    <button disabled={loading} onClick={() => downloadFile(selectedFile,setLoading)}>{loading ? <Loading text=''/> : '다운로드'}</button>
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