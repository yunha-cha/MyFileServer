import React, { useCallback, useEffect, useState } from 'react';
import api from '../../common/api';
import ShowDatas from './ShowDatas';
import s from './PCMainUpdate.module.css';
import InputModal from '../Modal/InputModal';
import { calcFileSize, deleteFile, downloadFile, formattedDateTime } from '../function';
import Modal from '../Modal/Modal';

function PCMainUpdate() {    
    const [history, setHistory] = useState([]);
    const [folderCode, setFolderCode] = useState(null);
    const [isShowFileDetail, setIsShowFileDetail] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedFileImage, setSelectedFileImage] = useState(null);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [selectedMenuFolderCode, setSelectedMenuFolderCode]= useState(null);
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
    //폴더 만들기
    const createNewFolder = async () => {
        let folderName = prompt('폴더 이름을 입력하세요.');
        if(!folderName) {return;}
        if(folderName && folderName.length>10){
            alert('10글자 이하만 생성 가능합니다.')
            return;
        }
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
        setUploadFolderCode(myFiles.data.folderCode);
        
    }, []);


    //폴더 내부로 들어갈 때 호출되는 함수
    const intoFolder = (folderCode) => {
        setHistory((prev)=>[...prev, folderCode]);
        setIsShowFileDetail(false);
    }
    const back = () => {
        setIsMenuVisible(false);
        setIsShowFileDetail(false);
        setHistory((prev)=> {
            if(prev.length === 0){
                return prev;
            } else {
                return prev.slice(0,-1);
            }
        })
    }
    useEffect(()=>{        
        if(history.length!==0){
            getMyFileData(history[history.length - 1]);
        } else {
            getMyFileData();
        }
    },[history, getMyFileData])
    //파일 클릭했을 때 디테일 표시하게
    const showDetailOfFile = (file) =>{
        const fileType = file.description.split(".").pop();        
        switch(fileType){
            case 'jpg':
            case 'png':
            case 'jpeg':
            case 'gif':
            case 'webp':
                setSelectedFileImage(file.fileFullPath); break;
            default:
                setSelectedFileImage(matchFileImage[fileType] || "/defaultImage.png"); break;
        }

        setIsShowFileDetail(true);
        setSelectedFile(file);
    }
    const openImage = (fileImage) => {
        if(fileImage.startsWith("http")){
            window.open(fileImage, "_blank",'width=500,height=500,menubar=no,toolbar=no,location=no,status=no');
        }
    }


    const handleContextMenu = (event, folderCode) => {
        setSelectedMenuFolderCode(folderCode);
        event.preventDefault(); // 기본 브라우저 컨텍스트 메뉴를 비활성화
        setMenuPosition({ x: event.clientX, y: event.clientY });
        setIsMenuVisible(true);
    };
    const deleteFolder = async () => {
        try{
            await api.delete(`/main/folder?folderCode=${selectedMenuFolderCode}`);
            setFiles((prev)=>({
                ...prev,
                folders: prev.folders.filter(folder=>folder.folderCode!==selectedMenuFolderCode),
            }));
        } catch(e){
            alert('안에 있는 폴더부터 삭제해주세요.');
        }
        
    }
    const changeName = async () =>{
        let input = prompt('');
        if(input){
            await api.post('/main/folder-name',{folderCode: selectedMenuFolderCode, description: input});
            setFiles((prevState) => ({
                ...prevState,
                folders: prevState.folders.map((folder) =>
                  folder.folderCode === selectedMenuFolderCode
                    ? { ...folder, folderName: input }
                    : folder
                )
              }));
        }
    };



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
        
        <div className={s.mainContainer} onClick={()=>setIsMenuVisible(false)}>
            <div className={s.container}>
            <div>
                <h1>개인 클라우드</h1>
                <h5>누구도 볼 수 없습니다.<br/></h5>
            </div>
            <div className={s.customFileUpload}>
                <label htmlFor="fileInput" className={s.customUploadButton}>파일 업로드</label>
                <input id="fileInput" type="file" onChange={openUploadModal} />
                <button onClick={createNewFolder}>새 폴더</button>
                {history.length!==0&&<button onClick={back}>뒤로가기</button>}
            </div>
            <div className={s.hr}></div>
            <div className={s.allFilesContainer}>
                <div className={s.foldersContainer}>
                {
                    //폴더 부터 보여주기
                    files &&
                    files.folders.map((folder) => (
                        <div key={folder.folderCode}>
                        <ShowDatas folder={folder} intoFolder={intoFolder} file={null} handleContextMenu={handleContextMenu}/>
                        </div>
                    ))
                }
                </div>
                <div className={s.filesContainer}>
                {
                    //파일 보여주기
                    files &&
                    files.files.map((file) => (
                        <div key={file.fileCode}>
                        <ShowDatas folder={null} intoFolder={null} file={file} showDetailOfFile={showDetailOfFile} setSelectedFile={setSelectedFile}/>
                        </div>
                    ))
                }
                </div>
            </div>
        </div>
        {isShowFileDetail&&
            <div className={s.afterFileDetail} style={isShowFileDetail? {}:{display:'none'}}>
                <button className={s.closeButton} onClick={()=>setIsShowFileDetail(false)}>❌</button>
                <div className={s.fileDetail}>
                    <div style={{fontSize:13,marginTop:20}}>사진 파일은 클릭하면 크게 볼 수 있습니다.</div>
                    <img onClick={()=>openImage(selectedFileImage)} src={selectedFileImage} style={{width: 64, height: 64}} alt='Error'/>
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
                setFiles((prev)=>({
                    ...prev,
                    files: prev.files.filter(file=>file.fileCode!==deleteFileCode),
                }));
                setIsShowFileDetail(false);

            }}/> : <></>}
                {isMenuVisible && (
                <div className={s.menuContainer} style={{top: menuPosition.y, left: menuPosition.x,}}>
                    <ul className={s.menu}>
                        <li onClick={deleteFolder}>삭제하기</li>
                        <li onClick={changeName}>이름 변경하기</li>
                    </ul>
                </div>
                )}
            </div>
        </>
    );
}

export default PCMainUpdate;