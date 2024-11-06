import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../common/api";
import axios from "axios";
import s from './MobileMain.module.css';
import { width } from "@fortawesome/free-brands-svg-icons/fa42Group";

const MobileMain = () => {
    const nav = useNavigate();
    const [loading, setLoading] = useState(false);
    const [description,setDescription] = useState('');
    const [myFiles, setMyFiles] = useState([]);
    let token = '';

    const logout = () => {
        localStorage.removeItem('token');
        nav('/');
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
        return `${year}/${month}/${day}  ${hour}:${minute}:${second}`;
    };
    const upload = async (e) => {
        const file = e.target.files[0];
        if(file){
            setLoading(true);
            const res = await api.post('/main/upload',{file:file,description:description});
            await getMyFile();
            setLoading(false);
        }
    }
    const getMyFile = async () => { //내 파일들 가져오기
        setLoading(true);
        const res = await api.get('/main/file');
        setLoading(false);
        setMyFiles(res.data);
    }
    useEffect(()=>{
        token = localStorage.getItem("token");
        if(token){
            getMyFile();
        } else {
            nav("/");
        }
    },[])
    return(
    <div className={s.mobileContainer}>
        <h1 className={s.header}>모바일</h1>
        <div className={s.customFileUpload}>
            <label htmlFor="fileInput" className={s.customUploadButton}>
                파일 업로드
            </label>
            <input id="fileInput" type="file" onChange={upload}/>
        </div>
        <table className={s.table}>
            <thead className={s.thead}>
                <tr>
                    <th>파일이름</th>
                    <th>업로드 시긴</th>
                    <th>다운로드 횟수</th>
                    <th>다운로드</th>
                </tr>
            </thead>
            <tbody>
            {
            myFiles.map((file) => (
                <tr key={file.fileCode}>
                    <td><b>{file.originalName}</b></td>
                    <td className={s.time}>{formattedDateTime(file.uploadedAt)}</td>
                    <td style={{textAlign:'center',width:80}}>{file.download_count}</td>

                    <td><button onClick={()=>downloadFile(file)}>다운로드</button></td>
                </tr>
                ))
            }
            </tbody>
        </table>
        <div className={s.footer}>
            <button className={s.logout} onClick={logout}>로그아웃</button>
        </div>
    </div>
    )
}

export default MobileMain;