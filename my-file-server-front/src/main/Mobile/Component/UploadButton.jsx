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
        <aside onClick={()=>setState(!state)} className={s.upload}>
            <div className={s.text}>{state?'>':'+'}</div>
                <div style={state?{right:'25vw'}:{right:-500}} className={s.uploadMenuOpen}>
                    <div className={s.uploadButtonContainer}>
                        <label style={state?{}:{width:0}} htmlFor="fileInput" className={s.fileUploadButton}>파일 업로드</label>
                        <input id="fileInput" type="file" onChange={handelUpload} />
                        <button style={state?{}:{width:0}} className={s.folderUploadButton} onClick={createNewFolder}>새 폴더</button>
                    </div>
                    {/* <button className={s.closeButton} onClick={() => setState(false)}>{">"}</button> */}
                </div>
        </aside>
    );
}

export default UploadButton;