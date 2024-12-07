import React, { useCallback, useEffect, useState } from 'react';
import s from './PCMainPublic.module.css'
import api from '../../common/api';
import Pagination from 'react-js-pagination';
import { calcFileSize } from '../function';
import { useSelector } from 'react-redux';

function PCMainPublic() {

    const {data} = useSelector((state)=>state.user);    //스토어 유저 정보 가져오기
    

    const [files, setFiles] = useState([]); //렌더링되는 파일들
    const [page, setPage] = useState(0);    //현재 페이지
    const [totalElements, setTotalElements] = useState(0);  //총 파일 개수


    const getPublicFile = useCallback(async () => { //페이지에 따라 파일 가져오는 함수
        const res = await api.get(`/main/file/public?page=${page}`);
        setTotalElements(res.data.totalElements);        
        setFiles(res.data.content);
    },[page]);

    const downloadFile = (file) => {    //파일 다운로드 함수
        console.log('다운로드 :',file);
    }

    const handleFileChnage = (file) => {//파일 업로드 함수
        //모달 띄워야 하는데..
        console.log('업로드 :',file);
    }

    const deleteFile = (file) =>{   //파일 삭제 함수
        console.log('삭제 :',file);
    }

    const selectUser = (user) => {  //유저 선택 함수
        console.log('클릭 :',user);
    }


    useEffect(()=>{getPublicFile()},[page,getPublicFile]);


    return (
        <div className={s.container}>
            <div className={s.titleContianer}>
                <h1>공용 클라우드</h1>
                <h5>사진, 동영상 파일은 클릭하여 미리볼 수 있습니다.</h5>
            </div>
            <div className={s.buttonContainer}>
                <div>
                    <label htmlFor="fileInput" className={s.customUploadButton}>공용 파일 업로드</label>
                    <input id="fileInput" type="file"  onChange={(e)=>handleFileChnage(e.target.files[0])}/>
                </div>
            </div>
            <table className={s.table}>
                <thead>
                <tr>
                    <th className={s.no}>번호</th>
                    <th className={s.fileName}>파일이름</th>
                    <th className={s.uploader}>업로더</th>
                    <th className={s.time}>시간</th>
                    <th className={s.downloadCount}>다운로드 수</th>
                    <th className={s.downloadCount}>용량</th>
                    <th className={s.download}>다운로드</th>
                </tr>
                </thead>
                <tbody>
                    {
                        files.map((file)=>(
                            <tr key={file.fileCode}>
                                <td style={{flex:0.5}} className={s.center}>{data&&data.userCode===file.uploadedByUser.userCode?<button onClick={()=>deleteFile(file)}>삭제</button>:file.fileCode}</td>
                                <td style={{flex:5}} className={s.left}>{file.description}{}</td>
                                <td style={{flex:1}} className={s.center}><div onClick={()=>selectUser(file.uploadedByUser)} className={s.uploaderData}>{file.uploadedByUser.id}</div></td>
                                <td style={{flex:1}} className={s.timeData}>2024-12-06(아직)</td>
                                <td style={{flex:1}} className={s.center}>{file.download_count}</td>
                                <td style={{flex:1}} className={s.center}>{calcFileSize(file.size)}</td>
                                <td style={{flex:1}} className={s.center}><button onClick={()=>downloadFile(file)} className={s.downloadButton}>다운로드</button></td> 
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            <div className={s.pagination}>
                <Pagination
                activePage={page}
                itemsCountPerPage={10}
                totalItemsCount={totalElements}
                onChange={(page)=>setPage(page-1)}/>
            </div>
        </div>
    );
}

export default PCMainPublic;