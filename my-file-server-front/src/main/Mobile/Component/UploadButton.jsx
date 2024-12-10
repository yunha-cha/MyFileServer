import s from './UploadButton.module.css';

const addTestData =         {
    changedName: "da59997f-d22f-4240-8d83-e2baeb135087-스크린샷 2023-03-28 135310.png",
    description: '추가한거.png',
    download_count: 1,
    fileCode: 247,
    fileFullPath: "http://localhost:8080/download/da59997f-d22f-4240-8d83-e2baeb135087-스크린샷 2023-03-28 135310.png",
    private: true,
    size: 16817,
    uploadedAt: [2024, 12, 6, 18, 35, 38],
    uploadedByUser: { id: 'user', userCode: 1, userRole: "ROLE_USER" }
}
const addTestFolderData =         {
    createdAt: [2024, 12, 2, 22, 49, 4],
    folderCode: 10,
    folderName: "생성되는폴더",
    parentFolderCode: 1,
    user: 1
};

function UploadButton({state, setState, addFile, addFolder}) {


    const createNewFolder = () => {
        let input = prompt('폴더 이름을 입력하세요.');
        console.log(input);
        
        //API 통신 구현하고 위에 addTestFolderData 지우셈
        const res = {data: addTestFolderData};

        addFolder(res.data);
    }
    const handelUpload = (e) => {
        let input =prompt('파일 이름을 입력하세요.');
        console.log(input);
        
        //API 통신 구현하고 위에 addTestData 지우셈
        const res = {data:addTestData};
        
        addFile(res.data);

    }
    return (
        <aside style={state ? {
            bottom: 0,
            left: 0,
            width: '100vw',
            borderRadius: 0,
            textAlign: 'left'
        } : {
            width: '20vw'
        }} onClick={() => !state && setState(!state)} className={s.upload}>
            {state ?
                <div className={s.uploadMenuOpen}>
                    <button onClick={() => setState(false)}>X</button>
                    <div className={s.customFileUpload}>
                        <label style={{ fontSize: 18 }} htmlFor="fileInput" className={s.customUploadButton}>파일 업로드</label>
                        <input id="fileInput" type="file" onChange={handelUpload} />
                        <button onClick={createNewFolder}>새 폴더</button>
                    </div>
                </div> : '+'}
        </aside>
    );
}

export default UploadButton;