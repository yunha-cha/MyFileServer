import { useEffect, useState } from "react";
import api from "../common/api";
import axios from "axios";
import s from "./Main.module.css";
import { useNavigate } from "react-router-dom";
import MobileMain from "./MobileMain";

const Main = () => {
    console.log('응');
    
    const nav = useNavigate();
    const [description,setDescription] = useState('');
    const [myFiles, setMyFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isPhone, setIsPhone] = useState(false);
    const [allText,setAllText] = useState(null);


    let token = '';
    const upload = async (e) => {
        let fileName = prompt("파일 이름을 입력하세요 (10자 이하)");
        if(fileName && fileName.length > 10){
            alert("10자 이하로 작성해주세요.");
            return;
        }
        const file = e.target.files[0];

        if(file){
            setLoading(true);
            const res = await api.post('/main/upload',{file:file,description:fileName});
            await getMyFile();
            setLoading(false);
        }
    }

    const downloadFile = async (file) => {      
        console.log(file);
        
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
        await getMyFile();
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


    const getMyFile = async () => { //내 파일들 가져오기
        setLoading(true);
        const res = await api.get('/main/file');
        setLoading(false);
        setMyFiles(res.data);
    }
    useEffect(()=>{
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (isMobile) {
            setIsPhone(true);
        }
        token = localStorage.getItem("token");
        if(token){
            getMyFile();
        } else {
            nav("/");
        }
    },[])
    useEffect(()=>{
        console.log(myFiles);
        
    },[myFiles])
    return(
        <div>
            {isPhone ? (
                <MobileMain/>
            )
            :
            (
            <div>
                <div className={s.customFileUpload}>
                    <label htmlFor="fileInput" className={s.customUploadButton}>
                        파일 업로드
                    </label>
                    <input id="fileInput" type="file" onChange={upload} />
                </div>
                <table className={s.myFileContainer}>
                    <thead className={s.thead}>
                            <tr className={s.tr}>
                                <th>파일 이름</th>
                                <th>업로드 시간</th>
                                <th>다운로드 횟수</th>
                                <th>다운로드</th>
                            </tr>
                    </thead>
                    <tbody>
                    {
                        myFiles.map((f,i) => (
                            <tr className={s.file} key={f.fileCode}>
                                {f.description.length>10?<td className={s.title}>{allText===i?f.description:f.description.substring(0,10)+".."}{allText===i?<></>:<button className={s.allText} onClick={()=>{setAllText(i)} }>더보기</button>}</td>:<td className={s.title}>{f.description}</td>}
                                <td className={s.time}>{formattedDateTime(f.uploadedAt)}</td>
                                <td className={s.downloadCount}>{f.download_count}회 다운로드</td>

                                <td className={s.download}><button className={s.downloadBtn} onClick={()=>downloadFile(f)}>다운로드</button></td>
                            </tr>
                        ))
                    }
                    </tbody>
                </table>
            </div>
            )}

        </div>
    )
}

export default Main;