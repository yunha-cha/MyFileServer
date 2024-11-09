import { useEffect, useState } from "react";
import { calcFileSize, deleteFile, downloadFile, getMyFile, upload } from "./function";
import s from './MobileMain.module.css';
import { jwtDecode } from "jwt-decode";
import InputModal from "./InputModal";
import api from "../common/api";
import { useNavigate } from "react-router-dom";

const MobileMain = () => {
    const nav = useNavigate();
    const [page,setPage] = useState(0);
    const [myFiles, setMyFiles] = useState([]);
    const [user,setUser] = useState(jwtDecode(localStorage.getItem("token")));
    const [file, setFile]=useState(null);
    const [showInputModal, setShowInputModal] = useState(false);
    const [fileName, setFileName] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);

    const upload = async (file) => {
        if(file){
            const extension = file.name.split('.')[1];
            await api.post('/main/upload',{file:file,description:fileName+'.'+extension,isPrivate:isPrivate});
            await getMyFile(page,setMyFiles);
        }
    }
    const openUploadModal = (e) => {
        setFile(e.target.files[0]); 
        e.target.value = null;
        setShowInputModal(true);
    }

    useEffect(()=>{
        getMyFile(page, setMyFiles);
    },[])
    return(
        <div className={s.container}>
            <h1 style={{textAlign:'center'}}>개인 클라우드</h1>
            <div className={s.customFileUpload}>
                <label htmlFor="fileInput" className={s.customUploadButton}>
                    파일 업로드
                </label>
                <input id="fileInput" type="file" onChange={openUploadModal} />
            </div>
            <table className={s.table}>
                <thead className={s.thead}>
                    <tr className={s.tr}>
                        <th style={{width:'30%'}}>이름</th>
                        <th>권한</th>
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
                                <td>{file.description}</td>
                                <td>{file.private?"개인":"공개"}</td>
                                <td style={{fontSize:10}}>{calcFileSize(file.size)}</td>
                                {user.accountCode===file.uploadedByUser.userCode?<td title="삭제하기" className={s.deleteFile} onClick={async()=>{await deleteFile(file.fileCode);await getMyFile(page,setMyFiles);}}><img width={15} src="/deleteIcon.png"/></td>:<></>}
                                <td className={s.download}><button className={s.downloadBtn} onClick={()=>{downloadFile(file);getMyFile(page,setMyFiles);}}>다운로드</button></td>
                            </tr>
                        )
                    })
                }
                </tbody>
            </table>
            <div className={s.footer}>
                <button>개인 클라우드</button>
                <button>공용(준비중)</button>
                <button>게시판(준비중)</button>
                <button onClick={()=>{
                    localStorage.removeItem('token');
                    nav('/');
                }}>로그아웃</button>
            </div>
            <div style={{position:'fixed',bottom:'50%',left:'50%',transform:'translate(-50%, -50%)'}}>
                {showInputModal ? <InputModal setFileName={setFileName} upload={upload} file={file} setShow={setShowInputModal} setIsPrivate={setIsPrivate} isPrivate={isPrivate}/> : <></>}
            </div>

        </div>
    )
}

export default MobileMain;