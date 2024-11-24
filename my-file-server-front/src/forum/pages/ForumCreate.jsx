import QuillEditor from "./QuillEditor"
import s from "./ForumCreate.module.css";
import { useState } from "react";
import api from "../../common/api";


const ForumCreate = () => {



    const [newForum, setNewForum] = useState({
        forumCode: 0,
        title: "",
        content: ""
    });


    const registForum = async() => {
        const res = await api.post(`/forum`, newForum);
        console.log(res.data);
        
    }





    return <div className={s.forumCreate}>

        <div className={s.containerHeader}>
            <h2 className={s.pageTitle}>게시글 작성</h2>
            <button className={s.submitBtn} onClick={() => registForum()}>제출</button>
        </div>
        
        <div className={s.container}>

            <div style={{marginBottom: "2.5em"}}>
                <div className={s.itemTitle}>제목</div>
                <input name="title" placeholder="" value={newForum.title}
                    onChange={(e) => setNewForum((prev) => ({
                        ...prev,
                        title: e.target.value
                    }))}/>
            </div>

            <div className={s.itemTitle}>내용</div>
            <div className={s.explain}>자유롭게 작성해주세요!🥰</div>
            <div className={s.containerContent}>
                <QuillEditor newForum={newForum} setNewForum={setNewForum}/>
            </div>

        </div>


        {/* 미리보기 */}
        <div className={s.cloud}></div>

    </div>

}

export default ForumCreate;