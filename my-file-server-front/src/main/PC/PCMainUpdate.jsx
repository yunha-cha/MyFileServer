import React, { useCallback, useEffect, useState } from 'react';
import api from '../../common/api';
import ShowDatas from './ShowDatas';
import s from './PCMain.module.css';
import InputModal from '../Modal/InputModal';

function PCMainUpdate(props) {
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

    //업로드 하기
    const upload = async (file, setPercent) => {
        if (file) {
            // const extension = file.name.split('.')[1];
            await api.post('/main/upload', { file: file, description: fileName , isPrivate: isPrivate, folderCode: uploadFolderCode }, {
                onUploadProgress: (e) => {
                    const percent = Math.round((e.loaded * 100) / e.total);
                    setPercent(percent);
                }
            });
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
            // console.log(data)
            setUploadFolderCode(data.folderCode);
        }
        //화면에 렌더링할 파일, 폴더 가져오기
        const myFiles = await api.get(`/main/folder?folderCode=${folderCode}`);
        console.log(myFiles.data);
        setFiles(myFiles.data);
        setUploadFolderCode(myFiles.data.folderCode)
    }, []);


    //폴더 내부로 들어갈 때 호출되는 함수
    const intoFolder = (folderCode) => {
        console.log(folderCode);
        getMyFileData(folderCode);  //조회하기
    }


    useEffect(() => {
        getMyFileData();
    }, [getMyFileData]);


    return (
        <div>
            <div className={s.customFileUpload}>
                <label htmlFor="fileInput" className={s.customUploadButton}>파일 업로드</label>
                <input id="fileInput" type="file" onChange={openUploadModal} />
            </div>
            {/* <ShowDatas/> */}
            {
                //폴더 부터 보여주기
                files &&
                files.folders.map((folder) => (
                    <ShowDatas folder={folder} intoFolder={intoFolder} file={null} />
                ))
            }
            {
                //파일 보여주기
                files &&
                files.files.map((file) => (
                    <ShowDatas folder={null} intoFolder={null} file={file} />
                ))
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

        </div>
    );
}

export default PCMainUpdate;