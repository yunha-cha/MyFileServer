import { useEffect, useState } from "react";
import api from "../common/api";
import axios from "axios";
import s from "./Main.module.css";
import { useNavigate } from "react-router-dom";
import MobileMain from "./MobileMain";
import { jwtDecode } from "jwt-decode";
import InputModal from "./InputModal";
import Pagination from "react-js-pagination";
import '../common/Pagination.css';

const Main = () => {    
    const nav = useNavigate();
    const [description,setDescription] = useState('');
    const [myFiles, setMyFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isPhone, setIsPhone] = useState(false);
    const [allText,setAllText] = useState(null);
    const [user,setUser] = useState(jwtDecode(localStorage.getItem("token")));
    const [showInputModal, setShowInputModal] = useState(false);
    const [fileName, setFileName] = useState('');
    const [file, setFile]=useState(null);
    const [page,setPage] = useState(0);
    const [totalElements,setTotalElements] = useState(0);

    let token = '';
    const openUploadModal = (e) => {
        setFile(e.target.files[0]);
        e.target.value = null;
        setShowInputModal(true);
    }
    const upload = async (file) => {
        if(file){
            setLoading(true);
            const res = await api.post('/main/upload',{file:file,description:fileName});
            await getMyFile(page);
            setLoading(false);
        }
    }

    const downloadFile = async (file) => {      
        
        await api.post(`/main/download-count/${file.fileCode}`);
        const fileFullPath = file.fileFullPath;
        
        axios({
          url: fileFullPath,
          method: 'GET',
          responseType: 'blob',
          headers: {
            Authorization: localStorage.getItem("token") // JWT 토큰 추가
          },
        })
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', file.originalName); // 다운로드할 파일 이름 설정
          document.body.appendChild(link);
          link.click();
          link.remove();
        })
        .catch((error) => {
          console.error('Error downloading the file:', error);
        });
        await getMyFile(page);
    };


    const formattedDateTime = (uploadedAt) => {
        const [year, month, day, hour, minute, second] = uploadedAt.map((time) => {
            if (time === undefined || time === null) {
                console.log(time);
                return "00";
            } else if (time.toString().length === 1) {
                return `0${time}`;
            } else {
                return time;
            }
        });
        if(second==undefined){
            return `${year}/${month}/${day} | ${hour}:${minute}:00`
        }
        return `${year}/${month}/${day} | ${hour}:${minute}:${second}`;
    };

    const deleteFile = async (fileCode) => {
        const res = await api.delete(`/main/file/${fileCode}`);
        console.log(res);
        await getMyFile(page);        
    }
    const getMyFile = async (page) => { //내 파일들 가져오기
        setLoading(true);
        const res = await api.get(`/main/file?page=${page}`);
        setTotalElements(res.data.totalElements);
        // console.log(res);
        
        
        setLoading(false);
        setMyFiles(res.data.content);
    }
    const handlePageChange = (page) => {
        console.log("씨발 페이지 바뀜! : ",page);
        
        setPage(page-1);
    }
    useEffect(()=>{
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (isMobile) {
            setIsPhone(true);
        }
        token = localStorage.getItem("token");
        if(token){
            // getMyFile(1);
        } else {
            nav("/");
        }
    },[])
    useEffect(()=>{
        console.log("effect page ",page);
        
        getMyFile(page);
    },[page])

    return(
        <div>
            {isPhone ? (
                <MobileMain/>
            )
            :
            (
            <div className={s.container}> 
                <div className={s.pageTitle}>개인 클라우드</div>
                <div className={s.customFileUpload}>
                    <label htmlFor="fileInput" className={s.customUploadButton}>
                        파일 업로드
                    </label>
                    <input id="fileInput" type="file" onChange={openUploadModal} />
                </div>
                <table className={s.myFileContainer}>
                    <thead className={s.thead}>
                            <tr className={s.tr}>
                                <th>파일 이름</th>
                                <th>다운로드 횟수</th>
                                <th>업로드 시간</th>
                                <th>다운로드</th>
                                <th>삭제</th>
                            </tr>
                    </thead>
                    <tbody>
                    {
                        myFiles.map((f,i) => (
                            <tr className={s.file} key={f.fileCode}>
                                {f.description.length>10?<td className={s.title}>{allText===i?f.description:f.description.substring(0,10)+".."}{allText===i?<></>:<button className={s.allText} onClick={()=>{setAllText(i)} }>더보기</button>}</td>:<td className={s.title}>{f.description}</td>}
                                <td className={s.downloadCount}>{f.download_count}회</td>
                                <td className={s.time}>{formattedDateTime(f.uploadedAt)}</td>
                                <td className={s.download}><button className={s.downloadBtn} onClick={()=>downloadFile(f)}>다운로드</button></td>
                                {user.accountCode===f.uploadedByUser.userCode?<td title="삭제하기" className={s.deleteFile} onClick={()=>deleteFile(f.fileCode)}>❌</td>:<></>}
                            </tr>
                        ))
                    }
                    </tbody>
                </table>
                <Pagination
                activePage={page}
                itemsCountPerPage={10}
                totalItemsCount={totalElements}
                onChange={handlePageChange}/>
                </div>
            )}
        {showInputModal ? <InputModal setFileName={setFileName} upload={upload} file={file} setShow={setShowInputModal}/> : <></>}
        </div>
    )
}

export default Main;