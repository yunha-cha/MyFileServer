import { useEffect, useRef, useState } from 'react';
import s from './InputModal.module.css';

const InputModal = ({ setFileName, upload, file, setShow }) => {
    const [msg, setMsg] = useState('파일 이름을 입력하세요.');
    const [isSuccess, setIsSuccess] = useState(false);
    const ref = useRef(null);

    const handleKeyDown = (e) => {
        if (e.code === 'Enter') {
            uploadFile();
        } else if(e.code === 'Escape'){
            setShow(false);
        }
    }

    const uploadFile = () => {
        upload(file);
        setMsg("업로드 성공!");
        setIsSuccess(true);
        setTimeout(() => {
            setShow(false);
          }, 1500);
    }
    useEffect(()=>{
        if(ref && ref.current){
            ref?.current.focus();
        }
    },[])

    return (
        <div onKeyDown={handleKeyDown} style={isSuccess?{height:70,background:'white'}:{}} className={s.modalContainer}>
            <div style={isSuccess?{color:'green',padding:30}:{}}>{msg}</div>
            { !isSuccess ? <>
                <input ref={ref} onChange={(e) => setFileName(e.target.value)} />
                <button className={s.confirm} onClick={uploadFile}>입력</button>
                <button className={s.cancle} onClick={() => setShow(false)}>취소</button>
            </> :<></>}
            
        </div>
    )
}

export default InputModal;
