import { creataPrivateFile, createFolder } from '../../apiFunction';
import s from './UploadButton.module.css';

function UploadButton({state, setState, addFile, addFolder, folderCode}) {

    const createNewFolder = () => {
        let input = prompt('폴더 이름을 입력하세요.');
        createFolder(input,folderCode,data=>addFolder(data));
    }
    const handelUpload = (e) => {
        let input =prompt('파일 이름을 입력하세요.');
        creataPrivateFile(e.target.files[0],input,folderCode,data=>addFile(data));
    }

    return (
        <aside style={state ? {
            bottom: 0,
            right: 0,
            width: '100vw',
            borderRadius: 0,
        } : {
            width: '20vw'
        }} onClick={() => !state && setState(!state)} className={s.upload}>
            {state ? 
                <div className={s.uploadMenuOpen}>
                    <div className={s.customFileUpload}>
                        <label htmlFor="fileInput" className={s.customUploadButton}>파일 업로드</label>
                        <input id="fileInput" type="file" onChange={handelUpload} />
                        <button className={s.newFolder} onClick={createNewFolder}>새 폴더</button>
                        <button className={s.closeButton} onClick={() => setState(false)}>{">"}</button>
                    </div>
                </div> : <div className={s.plusText}>+</div>}
        </aside>
    );
}

export default UploadButton;