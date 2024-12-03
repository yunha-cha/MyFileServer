import { useCallback, useEffect, useRef, useState } from "react";
import s from "./ForumMain.module.css"
import api from "../../common/api";
import { useNavigate } from "react-router-dom";
import DOMPurify from 'dompurify';
import GoToTopButton from "./GoToTopButton";
import WritePostButton from "./WritePostButton";

const ForumMain = () => {

    const nav = useNavigate();

    const [forums, setForums] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true); // 더 불러올 데이터가 있는지 여부

    const loader = useRef(null);

    const getForumList = useCallback(async() => {

        if (!hasMore) return; 

        try{
            const res = await api.get(`/forum?page=${page}`);
            if (res.data.content.length < 5) setHasMore(false); // 가져온 데이터가 5개 미만이면 더 이상 가져올 데이터가 없음
            setForums((prev) => [...prev, ...res.data.content]); // 기존 데이터에 새로 가져온 데이터를 추가
            setPage((prev) => prev + 1); // 다음 페이지로 이동
        } catch (err) {
            console.log(err)
        }

    }, [page, hasMore]);


    useEffect(() => {

        const observer = new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting) {
                getForumList();
              }
            },
            { threshold: 1.0 } // 요소가 모두(100%) 보일 때 콜백함수 실행
          );

          if (loader.current){
            observer.observe(loader.current);
          }
      
          return () => observer.disconnect(); // 완료 되면 옵저버 해제
      }, [getForumList]);




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





    return <div className={s.container}>
        <GoToTopButton/>
        <WritePostButton/>
      <h2 id="forumTitle">자유 게시판</h2>
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
                {/* <p>{SafeHTMLComponent(forum.content.length) > 45 ? SafeHTMLComponent(forum.content).slice(0, 45) + '...' : SafeHTMLComponent(forum.content)}</p> */}
            </div>

            <div className={s.itemWrap}>
                <div>🐹</div>
                <div className={s.author}>{forum.userId}</div>
            </div>
            
            </div>
        ))}


        {hasMore ? (
            // observer와 연결된 loader, true일 때만 나와서 처음에 안나옴
            <div className={s.loader} ref={loader} style={{ height: '30px', backgroundColor: "lightgray" }} />
        ) : (
            // 더 이상 데이터가 없으면 메세지
            <div style={{ height: '30px', color: "rgb(127, 176, 255)"}}>
                마지막 게시글 입니다!🎄
            </div>
        )}

        </div>
        

    </div>



}

export default ForumMain;