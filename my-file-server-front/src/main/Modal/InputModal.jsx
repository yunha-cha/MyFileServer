import { useEffect, useRef, useState } from 'react';
import s from './InputModal.module.css';

const InputModal = ({ setFileName, upload, file, setShow, setIsPrivate, isPrivate }) => {
    const [msg, setMsg] = useState('파일 이름을 입력하세요.');
    const [isSuccess, setIsSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const ref = useRef(null);
    

    const handleKeyDown = (e) => {
        if (e.code === 'Enter') {
            uploadFile();
        } else if(e.code === 'Escape'){
            setShow(false);
        }
    }

    const uploadFile = async () => {
        setLoading(true);
        setMsg("업로드 중..");
        await upload(file);
        setMsg("업로드 성공!");
        setLoading(false);
        setIsSuccess(true);
        setIsPrivate(false);
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
            <div style={isSuccess?{color:'green',padding:30}:loading?{padding:30}:{}}>{msg}</div>
            { !isSuccess && !loading ? <>
                <input ref={ref} onChange={(e) => setFileName(e.target.value)} />
                <div classs={s.buttonContainer}>
                    <article>
                    <span>개인 클라우드 저장</span>
                    <input value={isPrivate} onChange={()=>setIsPrivate(!isPrivate)} type='checkbox'/>
                    </article>
                    <button disabled={loading} className={s.confirm} onClick={uploadFile}>입력</button>
                    <button disabled={loading} className={s.cancle} onClick={() => setShow(false)}>취소</button>
                </div>
            </> :<></>}
            
        </div>
    )
}

export default InputModal;
