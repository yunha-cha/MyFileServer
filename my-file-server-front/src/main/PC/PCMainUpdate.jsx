import React, { useCallback, useEffect, useState } from 'react';
import api from '../../common/api';
import ShowDatas from './ShowDatas';
import s from './PCMain.module.css';
import InputModal from '../Modal/InputModal';
import { calcFileSize, deleteFile, downloadFile, formattedDateTime } from '../function';
import Modal from '../Modal/Modal';

function PCMainUpdate(props) {
    const [history, setHistory] = useState([]);
    const [folderCode, setFolderCode] = useState(null);
    const [isShowFileDetail, setIsShowFileDetail] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedFileImage, setSelectedFileImage] = useState(null);
    //지금 현재 화면에 렌더링하는 데이터 state
    const [files, setFiles] = useState(null);
    //뒤로가기를 위한 이전 데이터 저장 state

    //파일 업로드 관련 state
    const [fileName, setFileName] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const [file, setFile] = useState(null);
    const [deleteFileCode, setDeleteFileCode] = useState(0);
    const [uploadFolderCode, setUploadFolderCode] = useState(null);
    /**모달 관리 state*/
    const [showInputModal, setShowInputModal] = useState(false);
    const [showModal, setShowModal] = useState(false);

    /**모달을 출력하는 함수*/
    const openUploadModal = (e) => {
        setFile(e.target.files[0]);
        e.target.value = null;
        setShowInputModal(true);
    }
    const openDeleteModal = (fileCode) => {
        setShowModal(true);
        setDeleteFileCode(fileCode);
    }
    const createNewFolder = async () => {
        let folderName = prompt('폴더 이름을 입력하세요.');        
        const res = await api.post('/main/folder', { folderName: folderName, folderCode: folderCode });
        setFiles(prev=>({
            ...prev,
            folders:[...prev.folders,res.data]
        }))
    }
    //업로드 하기
    const upload = async (file, setPercent) => {
        if (file) {
            const res = await api.post('/main/upload', { file: file, description: fileName , isPrivate: isPrivate, folderCode: uploadFolderCode }, {
                onUploadProgress: (e) => {
                    const percent = Math.round((e.loaded * 100) / e.total);
                    setPercent(percent);
                }
            });
            setFiles(prev=>({
                ...prev,
                files: [...prev.files, res.data]
            }))
        }
    }
    useEffect(()=>{
        console.log(uploadFolderCode);
        
    },[uploadFolderCode])
    //폴더안에 있는 폴더,파일을 가져오는 함수
    const getMyFileData = useCallback(async (folderCode) => {
        //만약 폴더 코드를 인자로 주지 않았다면?
        if (!folderCode) {
            //최상단 폴더 조회하기
            const { data } = await api.get('/main/root-folder');
            folderCode = data;
            setFolderCode(data.folderCode);
            setUploadFolderCode(data.folderCode);
        }
        //화면에 렌더링할 파일, 폴더 가져오기
        const myFiles = await api.get(`/main/folder?folderCode=${folderCode}`);
        setFolderCode(myFiles.data.folderCode);
        setFiles(myFiles.data);
        setUploadFolderCode(myFiles.data.folderCode)
    }, []);


    //폴더 내부로 들어갈 때 호출되는 함수
    const intoFolder = (folderCode) => {
        setHistory((prev)=>[...prev, folderCode]);
        setIsShowFileDetail(false);
        // getMyFileData(folderCode);  //조회하기
    }
    const back = () => {
        setHistory((prev)=> {
            if(prev.length === 0){
                console.log('스택 비었다!');
                return prev;
            } else {
                return prev.slice(0,-1);
            }
        })
    }
    useEffect(()=>{
        console.log('history :',history);
        
        if(history.length!==0){
            console.log('history로 getData');
            console.log(history[history.length - 1]);
            
            
            getMyFileData(history[history.length - 1]);
        } else {
            getMyFileData();
        }
    },[history])
    //파일 클릭했을 때 디테일 표시하게
    const showDetailOfFile = (file) =>{
        console.log(file);
        setIsShowFileDetail(true);
        setSelectedFile(file);
        const fileType = file.description.split(".").pop();
        setSelectedFileImage(matchFileImage[fileType] || "/defaultImage.png");
    }



    useEffect(() => {
        getMyFileData();
    }, [getMyFileData]);
    const matchFileImage = {
        "hwp" : "/hancom.png",
        "hwpx" : "/hancom.png",
        "pdf" : "/pdf.png",
        "mp4" : "/mp4.png",
        "zip" : "/zip.png"
    }

    return (
        <>
        <div style={{display:'flex',flexDirection:'row',width:'100vw',maxWidth:'100%',justifyContent:'space-between'}}>
        <div className={s.container}>
            <div className={s.customFileUpload}>
                <label htmlFor="fileInput" className={s.customUploadButton}>파일 업로드</label>
                <input id="fileInput" type="file" onChange={openUploadModal} />
                <button onClick={createNewFolder}>새 폴더</button>
                <button onClick={back}>뒤로가기</button>
            </div>
            <div className={s.allFilesContainer}>
                <div className={s.foldersContainer}>
                {
                    //폴더 부터 보여주기
                    files &&
                    files.folders.map((folder) => (
                        <ShowDatas folder={folder} intoFolder={intoFolder} file={null}/>
                    ))
                }
                </div>
                <div className={s.filesContainer}>
                {
                    //파일 보여주기
                    files &&
                    files.files.map((file) => (
                        <ShowDatas folder={null} intoFolder={null} file={file} showDetailOfFile={showDetailOfFile} setSelectedFile={setSelectedFile}/>
                    ))
                }
                </div>
            </div>
        </div>
        {isShowFileDetail&&
            <div className={s.afterFileDetail} style={isShowFileDetail? {}:{display:'none'}}>
                <button className={s.closeButton} onClick={()=>setIsShowFileDetail(false)}>❌</button>
                <div className={s.fileDetail}>
                    <img src={selectedFileImage} style={{width: 64, height: 64}}/>
                    <div className={s.detailButtonContainer}>
                        <button onClick={()=>downloadFile(selectedFile)}>다운로드</button>
                        <button onClick={()=>openDeleteModal(selectedFile.fileCode)}>삭제하기</button>
                    </div>
                    <table className={s.table}>
                        <tbody>
                            <tr>
                                <th>이름 </th>
                                <td>{selectedFile.description}</td>
                            </tr>
                            <tr>
                                <th>용량 </th>
                                <td>{calcFileSize(selectedFile.size)}</td>
                            </tr>
                            <tr>
                                <th>올린 날짜 </th>
                                <td>{formattedDateTime(selectedFile.uploadedAt)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            }
        {showInputModal ?
                <InputModal
                    setFileName={setFileName}
                    upload={upload}
                    file={file}
                    setShow={setShowInputModal}
                    setIsPrivate={setIsPrivate}
                    isPrivate={isPrivate}
                />
                :
                <></>
            }
            {showModal ? <Modal message="삭제하시겠습니까?" setShowModal={setShowModal} callBack={async()=>{
                await deleteFile(deleteFileCode);
                console.log(files);
                let arr = files.files.filter(file=>file.fileCode!==deleteFileCode);
                setFiles((prev)=>({
                    ...prev,
                    files: prev.files.filter(file=>file.fileCode!==deleteFileCode),
                }));
                setIsShowFileDetail(false);

            }}/> : <></>}
            </div>
        </>
    );
}

export default PCMainUpdate;