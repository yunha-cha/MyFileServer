import { useCallback, useEffect, useState } from "react";
import { calcFileSize, deleteFile, downloadFile, getMyFile, getPublicFile } from "../function";
import s from './MobileMain.module.css';
import InputModal from "../Modal/InputModal";
import api from "../../common/api";
import { useNavigate } from "react-router-dom";
import Pagination from "react-js-pagination";

const MobileMain = ({user}) => {
    const nav = useNavigate();
    const [page,setPage] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [myFiles, setMyFiles] = useState([]);
    const [file, setFile]=useState(null);
    const [showInputModal, setShowInputModal] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [imageModalSrc, setImageModalSrc] = useState('');
    const [fileName, setFileName] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const [isPublicCloud, setIsPublicCloud] = useState(false);

    //모달 열기
    const openUploadModal = (e) => {
        setFile(e.target.files[0]); 
        e.target.value = null;
        setShowInputModal(true);
    }
    //업로드 하기
    const upload = async (file) => {
        if(file){
            const extension = file.name.split('.')[1];
            await api.post('/main/upload',{file:file,description:fileName+'.'+extension,isPrivate:isPrivate});
            isPublicCloud ? await getPublicFile(page,setMyFiles,setTotalElements): await getMyFile(page,setMyFiles,setTotalElements)
        }
    };
    //다운로드
    const download = async (file) => {
        await downloadFile(file);
        await getFile();
    };
    //삭제
    const delFile = async (fileCode) => {
        await deleteFile(fileCode);
        await getFile();
    };
    //이미지 열기
    const openImage =(file) => {
        console.log(file);
        const ex = file.description.split('.')[1];        
        const isImage = ex==='jpg'||ex==='png'||ex==='jpeg'||ex==='gif'||ex==='webp';
        if(isImage){
            setShowImageModal(true);
            setImageModalSrc(file.fileFullPath);
        } else {
            setShowImageModal(false);
            setImageModalSrc('');
        }
    }
    //공용, 개인에 맞게 파일 가져오기
    const getFile = useCallback(async()=>{
        isPublicCloud? await getPublicFile(page,setMyFiles,setTotalElements): await getMyFile(page,setMyFiles,setTotalElements)
    },[isPublicCloud,page]);

    //page, 공용, 개인이 바뀔 때 마다 파일 가져오기
    useEffect(()=>{getFile();},[page,isPublicCloud,getFile]);
    //공용 개인이 바뀔 때 페이지 초기화하기
    useEffect(()=>{setPage(0);},[isPublicCloud]);
    return(
        <div className={s.container}>
            {isPublicCloud?<h1 style={{textAlign:'center'}}>공용 클라우드</h1>:<h1 style={{textAlign:'center'}}>개인 클라우드</h1>}
            <div className={s.imagePrintContainer}>
                {showImageModal?
                <>
                    <div className={s.imagePrintContainerTitle}>
                        <div>이미지 미리보기</div>
                        <button onClick={()=>setShowImageModal(false)}>X</button>
                    </div>
                    <img height={100} alt="이미지를 불러올 수 없습니다." src={imageModalSrc}/>
                </>:<></>}
            </div>
            <div className={s.customFileUpload}>
                <label htmlFor="fileInput" className={s.customUploadButton}>
                    파일 업로드
                </label>
                <input id="fileInput" type="file" onChange={openUploadModal} />
            </div>
            <div style={{maxHeight:500,overflowY:'auto'}}>
            <table className={s.table}>
                <thead className={s.thead}>
                    <tr className={s.tr}>
                        <th style={{width:'30%'}}>이름</th>
                        {isPublicCloud?<th>유저</th>:<th>권한</th>}
                        <th>용량</th>
                        <th>삭제</th>
                        <th>다운로드</th>
                    </tr>
                </thead>
                <tbody>
                {
                    myFiles.map((file,i)=> {
                        return (
                            <tr key={i}>
                                <td onClick={()=>openImage(file)}>{file.description}</td>
                                {isPublicCloud?<td>{file.uploadedByUser.id}</td>:<td>{file.private?"개인":"공개"}</td>}
                                <td style={{fontSize:10}}>{calcFileSize(file.size)}</td>
                                {user.accountCode===file.uploadedByUser.userCode?<td title="삭제하기" className={s.deleteFile} onClick={delFile}><img alt="Error" width={15} src="/deleteIcon.png"/></td>:<td></td>}
                                <td className={s.download}><button className={s.downloadBtn} onClick={download}>다운로드</button></td>
                            </tr>
                        )
                    })
                }
                </tbody>
            </table>
            </div>
            <div className={s.footer}>
                <button onClick={()=>setIsPublicCloud(false)}>개인 클라우드</button>
                <button onClick={()=>setIsPublicCloud(true)}>공용 클라우드</button>
                <button>게시판(준비중)</button>
                <button onClick={()=>{
                    localStorage.removeItem('token');
                    nav('/');
                }}>로그아웃</button>
            </div>
            <div style={{position:'fixed',bottom:'50%',left:'50%',transform:'translate(-50%, -50%)'}}>
                {showInputModal ? <InputModal setFileName={setFileName} upload={upload} file={file} setShow={setShowInputModal} setIsPrivate={setIsPrivate} isPrivate={isPrivate}/> : <></>}
            </div>
            <div className={s.pagination}>
                    <Pagination
                    activePage={page}
                    itemsCountPerPage={10}
                    totalItemsCount={totalElements}
                    onChange={(page)=>setPage(page - 1)}/>
            </div>

        </div>
    )
}

export default MobileMain;