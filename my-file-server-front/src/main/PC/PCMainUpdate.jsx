import React, { useCallback, useEffect, useState } from 'react';
import api from '../../common/api';

function PCMainUpdate(props) {
    //지금 현재 화면에 렌더링하는 데이터 state
    const [files, setFiles] = useState(null);
    //뒤로가기를 위한 이전 데이터 저장 state
    


    //폴더안에 있는 폴더,파일을 가져오는 함수
    const getMyFileData = useCallback(async (folderCode) =>{
        //만약 폴더 코드를 인자로 주지 않았다면?
        if(!folderCode){
            //최상단 폴더 조회하기
            const {data} = await api.get('/main/root-folder');
            folderCode = data;
        }
        //화면에 렌더링할 파일, 폴더 가져오기
        const myFiles = await api.get(`/main/folder?folderCode=${folderCode}`);
        console.log(myFiles.data);
        setFiles(myFiles.data);
    },[]);


    //폴더 내부로 들어갈 때 호출되는 함수
    const intoFolder = (folderCode) =>{
        console.log(folderCode);
        getMyFileData(folderCode);  //조회하기
    }


    useEffect(()=>{
        getMyFileData();
    },[getMyFileData]);


    return (
        <div>
            {
                //폴더 부터 보여주기
                files&&
                files.folders.map((folder)=>(
                    <div key={folder.folderCode}>
                        <div onClick={()=>intoFolder(folder.folderCode)}>{folder.folderName}</div>
                    </div>
                ))
            }
            {
                //파일 보여주기
                files&&
                files.files.map((file)=>(
                    <div key={file.fileCode}>
                        <div>{file.description}</div>
                    </div>
                ))
            }
        </div>
    );
}

export default PCMainUpdate;