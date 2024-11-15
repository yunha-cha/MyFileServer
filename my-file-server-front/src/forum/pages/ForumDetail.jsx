import { useLocation, useParams } from "react-router-dom";
import api from "../../common/api";
import { useEffect, useState } from "react";
import s from "./ForumDetail.module.css"

const ForumDetail = () => {

    const {code} = useParams();

    const [isSliding, setIsSliding] = useState(false);
    const location = useLocation(); // 현재 경로 추적
  
    const [forum, setForum] = useState({});
    const [comments, setComments] = useState([]);

    const getForumDetail = async() => {
        const res = await api.get(`/forum/${code}`);
        setForum(res.data);
    }

    const getCommentList = async() => {
        const res = await api.get(`/comment/${code}?page=0`);
        setComments(res.data.content);
        

    }


    useEffect(() => {
        if(code){
            getForumDetail();
            getCommentList();
        }
        
    }, [])

    useEffect(() => {
        console.log(forum);
        console.log("comments: ", comments);

    }, [forum, comments])


    // 경로가 변할 때마다 애니메이션 상태 설정
    useEffect(() => {
        setIsSliding(true);
      }, [location]); // location이 바뀔 때마다 애니메이션 재시작

    

    // textarea handle
    const handleTextarea = (e) => {
        console.log(e.target.style.height);
        console.log(e.target.scrollHeight);
        
        
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}px`;

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

    return <div className={`${s.forumDetail} ${isSliding? `${s.sliding}` : ``}`}>
        <h2 className={s.pageTitle}>자유 게시판</h2>
        
        <div className={s.container}>
            <h2 className={s.title}>{forum.title}</h2>

            <div className={s.containerHeader}>
                <div>작성자 <b>{forum.userId}</b></div>
                <div>{forum.createAt && formattedDate(forum.createAt)}</div>
            </div>

            <div className={s.containerContent}>
                <div className={s.content}>{forum.content}</div>
            </div>

            <div className={s.containerFooter}>
                <div style={{marginRight: "1em"}}>댓글 <b>{comments.length}</b></div>
                <div>조회수 <b>{forum.views}</b></div>
            </div>


           {/* 댓글 리스트 */}
            <div className={s.containerComment}>

                <div className={s.containerWrite}>
                    <textarea rows="2" placeholder="댓글 작성"
                        onInput={handleTextarea}
                    />
                    <button>확인</button>

                </div>

                {comments.map((comment, idx) => (
                    <div className={s.comment}>
                        <div>{comment.content}</div>

                    </div>
                ))}

            </div>

        </div>


    </div>

}

export default ForumDetail;