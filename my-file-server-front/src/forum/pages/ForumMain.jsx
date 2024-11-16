import { useEffect, useRef, useState } from "react";
import s from "./ForumMain.module.css"
import api from "../../common/api";
import { useNavigate } from "react-router-dom";

const ForumMain = () => {

    const nav = useNavigate();
    const [curpage, setCurPage] = useState('forumMain');
    const [transitioning, setTransitioning] = useState(false);

    const [forums, setForums] = useState([]);
    const [page, setPage] = useState(0);

    const getForumList = async() => {
        const res = await api.get(`/forum?page=${page}`);
        setForums(res.data.content);

    }


    // 날짜 포맷팅 함수
    const formattedDate = (createAt) => {

        const today = new Date();

        const formattedDate = `${createAt[0]}-${String(createAt[1]).padStart(2, '0')}-${String(createAt[2]).padStart(2, '0')}T${String(createAt[3]).padStart(2, '0')}:${String(createAt[4]).padStart(2, '0')}:${String(createAt[5]).padStart(2, '0')}`;
        const createDate = new Date(formattedDate);

        
        const diffMs = today - createDate;
        const diffInMinutes = Math.floor(diffMs / (1000 * 60));
        const diffInHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
        if (diffInMinutes < 1) return "방금 전";
        if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
        if (diffInHours < 24) return `${diffInHours}시간 전`;
        if (diffInDays < 1) return `${diffInDays}일 전`;

        return `${createAt[0]}.${String(createAt[1]).padStart(2, '0')}.${String(createAt[2]).padStart(2, '0')} ${String(createAt[3]).padStart(2, '0')}:${String(createAt[4]).padStart(2, '0')}`;
    }



      useEffect(() => {
        getForumList();
      }, [])


    return <div className={s.container}>

      <h2>자유 게시판</h2>
        <div className={s.forum}>
            
        {forums.map((forum, idx) => (
            <div
            key={forum.forumCode}
            className={s.item}
            onClick={() => nav(`/forum/${forum.forumCode}`)}
            >
            <div className={s.date}>{formattedDate(forum.createAt)}</div>
            <div className={s.itemContent}>
                <h3>{forum.title}</h3>
                <p>{forum.content.length > 45 ? forum.content.slice(0, 45) + '...' : forum.content}</p>
            </div>

            <div className={s.itemWrap}>
                <div>🐹</div>
                <div className={s.author}>{forum.userId}</div>
            </div>
            
            </div>
        ))}

        </div>

        <div className={s.pagination}>
        {/* <Pagination
        activePage={page}
        itemsCountPerPage={10}
        totalItemsCount={totalElements}
        onChange={(page)=>setPage(page-1)}/> */}

        </div>

    </div>



}

export default ForumMain;