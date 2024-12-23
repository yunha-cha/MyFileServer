import React, { useCallback, useEffect, useRef, useState } from 'react';
import s from './PCMainPublic.module.css'
import api from '../../common/api';
import Pagination from 'react-js-pagination';
import { calcFileSize, canOpenFile, deleteFile, downloadFile, formattedDateTime } from '../function';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaTrashAlt } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';

function PCMainPublic() {

    const nav = useNavigate();

    const {data} = useSelector((state)=>state.user);    //스토어 유저 정보 가져오기
    

    const [files, setFiles] = useState([]); //렌더링되는 파일들
    const [page, setPage] = useState(0);    //현재 페이지
    const [totalElements, setTotalElements] = useState(0);  //총 파일 개수

    //업로드 관련 state
    const fileInputRef = useRef(null);
    const fileNameRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadFile, setUploadFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [percent, setPercent] = useState(0);

    const getPublicFile = useCallback(async () => { //페이지에 따라 파일 가져오는 함수
        const res = await api.get(`/main/file/public?page=${page}`);
        setTotalElements(res.data.totalElements);        
        setFiles(res.data.content);        
    },[page]);

    const downloadSelectedFile = (file) => {    //파일 다운로드 함수
        downloadFile(file);
    }

    const upload = async () => {//파일 업로드 함수
        if(fileName.length>20){
            alert('파일 이름은 20자를 넘을 수 없어요.');
            setFileName('');
        } else {
            setIsUploading(true);
            let name = fileName;
            if(fileName.length===0){
                name='새 파일';
            }
            await api.post('/main/upload/public', { file: uploadFile, description: name }, {
                onUploadProgress: (e) => {
                    const percent = Math.round((e.loaded * 100) / e.total);
                    setPercent(percent);
                }
            });
            await getPublicFile();

            setUploadFile(null);
            setFileName('');
            setPercent(0);
            setIsUploading(false);
            fileInputRef.current.value = "";
        }
    }


    const deleteSelectedFile = async (file) =>{   //파일 삭제 함수
        await deleteFile(file.fileCode);
        getPublicFile();
    }

    const selectUser = (user) => {  //유저 선택 함수 유저 페이지 이동
        nav(`/user/${user.userCode}`);
    }

    const openFile = (file) => {    //사진, 동영상 미리보기
        if(canOpenFile(file)){
            window.open(file.fileFullPath, "_blank",'width=500,height=500,menubar=no,toolbar=no,location=no,status=no');
        }
    }


    useEffect(()=>{getPublicFile()},[page,getPublicFile]);
    useEffect(()=>{
        if(uploadFile){
            fileNameRef.current.focus();
        }
    },[uploadFile])

    return (
        <div className={s.container}>
            <div className={s.titleContianer}>
                <h1>공용 클라우드</h1>
                <h5>사진, 동영상 파일은 클릭하여 미리볼 수 있습니다.</h5>
            </div>
            <div className={s.buttonContainer}>
                <div style={{display:'flex',width:'50vw',alignItems:'center'}}>
                    <label htmlFor="fileInput" className={s.customUploadButton}>공용 파일 업로드</label>
                    <input ref={fileInputRef} id="fileInput" type="file"  onChange={(e)=>setUploadFile(e.target.files[0])}/>
                    {uploadFile&&isUploading===false?   //업로드 파일이 있고, 지금 업로드 중이 아니지?
                    <div style={{display:'flex'}}>
                        <input ref={fileNameRef} className={s.uploadInput} value={fileName} onChange={(e)=>setFileName(e.target.value)} onKeyDown={(e)=>e.key==='Enter'&&upload()} placeholder='파일 명을 입력해주세요!'/>
                        <button className={s.uploadButton} onClick={upload}>업로드</button>
                    </div>
                    :
                    uploadFile&&isUploading&&
                    <div className={s.progressBar}>
                        <div className={s.progressText}>{percent}%</div>
                        <div className={s.progress} style={{ width: `${percent}%`}}></div>
                    </div>
                    }

                </div>
                <div>

      <Tooltip id="tooltip" />
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
                                <td style={{flex:0.5}} className={s.center}>{data&&data.userCode===file.uploadedByUser.userCode||data.userRole==='ROLE_ADMIN'?<button className={s.delete} onClick={()=>deleteSelectedFile(file)}><FaTrashAlt size={15} color="#ff2020" style={{alignSelf:'center'}}/></button>:file.fileCode}</td>
                                <td data-tooltip-id='tooltip' data-tooltip-content={file.description} style={{flex:5}} className={s.left} onClick={()=>openFile(file)}>{file.description}{}</td>
                                <td style={{flex:1}} className={s.center}><div onClick={()=>selectUser(file.uploadedByUser)} className={s.uploaderData}>{file.uploadedByUser.id}</div></td>
                                <td style={{flex:1}} className={s.timeData}>{formattedDateTime(file.uploadedAt)}</td>
                                <td style={{flex:1}} className={s.center}>{file.download_count}</td>
                                <td style={{flex:1}} className={s.center}>{calcFileSize(file.size)}</td>
                                <td style={{flex:1}} className={s.center}><button onClick={()=>downloadSelectedFile(file)} className={s.downloadButton}>다운로드</button></td> 
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            <div className={s.pagination}>
                <Pagination
                activePage={page}
                itemsCountPerPage={15}
                totalItemsCount={totalElements}
                onChange={(page)=>setPage(page-1)}/>
            </div>
        
        </div>
    );
}

export default PCMainPublic;