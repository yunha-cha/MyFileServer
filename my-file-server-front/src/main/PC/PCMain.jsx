import { useCallback, useEffect, useState } from "react";
import api from "../../common/api";
import s from './PCMain.module.css';
import '../../common/Pagination.css';
import Pagination from "react-js-pagination";
import InputModal from "../Modal/InputModal";
import { calcFileSize, deleteFile, downloadFile, formattedDateTime, getMyFile, getPublicFile } from "../function";
import { useNavigate, useOutletContext } from "react-router-dom";
import Modal from "../Modal/Modal";


const PCMain = ({user}) => {
    const nav = useNavigate();
    const { isPublicCloud } = useOutletContext() || {};
    const [myFiles, setMyFiles] = useState([]);
    const [showInputModal, setShowInputModal] = useState(false);
    const [fileName, setFileName] = useState('');
    const [file, setFile]=useState(null);
    const [page,setPage] = useState(0);
    const [totalElements,setTotalElements] = useState(0);
    const [isPrivate, setIsPrivate] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [deleteFileCode, setDeleteFileCode] = useState(0);
    //모달 열기
    const openUploadModal = (e) => {
        setFile(e.target.files[0]);
        e.target.value = null;
        setShowInputModal(true);
    }
    const openDeleteModal = (fileCode) => {
        setShowModal(true);
        setDeleteFileCode(fileCode);
    }
    //업로드 하기
    const upload = async (file,setPercent) => {
        if(file){
            const extension = file.name.split('.')[1];
            await api.post('/main/upload',{file:file,description:fileName+'.'+extension,isPrivate:isPrivate},{
                onUploadProgress: (e) => {
                    const percent = Math.round((e.loaded*100) / e.total);
                    setPercent(percent);
                }
            });
            await getFile();
        }
    }
    //다운로드
    const download = async (file) => {      
        await downloadFile(file);
        await getFile();
    };
    const isImage = (file) => {
        const ex = file.description.split('.')[1];  
        return ex==='jpg'||ex==='png'||ex==='jpeg'||ex==='gif'||ex==='webp'||ex==='mp4';
    }
    const openImage = (file) =>{
        isImage(file) && window.open(file.fileFullPath, "_blank", "width=800,height=600,left=300,top=300");
    }
    //공용, 개인에 맞게 파일 가져오기
    const getFile = useCallback(async()=>{
        isPublicCloud? await getPublicFile(page,setMyFiles,setTotalElements): await getMyFile(page,setMyFiles,setTotalElements)
    },[isPublicCloud,page]);
    //page, 공용, 개인이 바뀔 때 마다 파일 가져오기
    useEffect(()=>{getFile();},[page, isPublicCloud,getFile]);
    //공용 개인이 바뀔 때 페이지 초기화하기
    useEffect(()=>{setPage(0);},[isPublicCloud]);
    return(
<div className={s.container}>
    <div className={s.pageTitle}>{isPublicCloud? `공용 클라우드`:`개인 클라우드`}</div>
    <div className={s.message}>이미지, 동영상 파일은 클릭하면 미리 볼 수 있습니다.</div>
    <div className={s.message}><b>{page+1}</b> 페이지</div>
    <div className={s.customFileUpload}>
        <label htmlFor="fileInput" className={s.customUploadButton}>파일 업로드</label>
        <input id="fileInput" type="file" onChange={openUploadModal} />
    </div>
    <table className={s.table}>
        <thead className={s.thead}>
                <tr className={s.tr}>
                    <th>파일 이름</th>
                    <th>다운로드 횟수</th>
                    <th>업로드 시간</th>
                    {isPublicCloud?<th style={{width:70}}>유저</th>:<th>권한</th>}
                    <th>용량</th>
                    <th>삭제</th>
                    <th>다운로드</th>
                </tr>
        </thead>
        <tbody>
        {
        myFiles.map((f) => (
            <tr className={s.file} key={f.fileCode}>
                {isImage(f) ? <td onClick={()=>openImage(f)} className={s.imageTitle}>{f.description}</td>:<td className={s.title}>{f.description}</td>}
                <td className={s.downloadCount}>{f.download_count}회</td>
                <td className={s.time}>{formattedDateTime(f.uploadedAt)}</td>
                {isPublicCloud?<td className={s.tableUser} onClick={()=>nav(`/user/${f.uploadedByUser.userCode}`)}><button>{f.uploadedByUser.id}</button></td>:<td style={{textAlign:'center'}}>{f.private? "개인" : "공용"}</td>}
                <td style={{textAlign:'center'}}>{calcFileSize(f.size)}</td>
                {user.accountCode===f.uploadedByUser.userCode?<td title="삭제하기" className={s.deleteFile} onClick={()=>openDeleteModal(f.fileCode)}><img alt="Error" width={15} src="/deleteIcon.png"/></td>:<td></td>}
                <td className={s.download}><button className={s.downloadBtn} onClick={()=>download(f)}>다운로드</button></td>
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
    <div className={s.inputModal}>
        {showInputModal ? <InputModal setFileName={setFileName} upload={upload} file={file} setShow={setShowInputModal} setIsPrivate={setIsPrivate} isPrivate={isPrivate}/> : <></>}
        {showModal ? <Modal message="삭제하시겠습니까?" setShowModal={setShowModal} callBack={async()=>{
            await deleteFile(deleteFileCode);
            await getFile();             
        }}/> : <></>}
    </div>
</div>
    )

}
 
export default PCMain;