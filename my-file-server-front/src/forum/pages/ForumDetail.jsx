import { useLocation, useParams } from "react-router-dom";
import api from "../../common/api";
import { useEffect, useState } from "react";
import s from "./ForumDetail.module.css"
import { useSelector } from "react-redux";
import DOMPurify from 'dompurify';


const ForumDetail = () => {

    const {code} = useParams();

    const {data} = useSelector((state) => state.user);

    const [isSliding, setIsSliding] = useState(false);
    const location = useLocation(); // 현재 경로 추적

    const [forum, setForum] = useState({});
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState({
        content: "",
        ip_address: ""
    });


    // 댓글 onInput 변화 감지 함수
    const handleTextarea = (e) => {
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}px`;


        setNewComment((prev) => ({
            ...prev,
            content: e.target.value
        }));
        console.log("댓글 작성중.. ",newComment);

        
    }

    const getForumDetail = async() => {
        const res = await api.get(`/forum/${code}`);
        setForum(res.data);
    }
    

    const countViews = async() => {

        try{
            const res = await api.post(`/views/${code}`);
            console.log("countviews: ", res.data);

        }catch(err){
            console.log(err.message);
            console.log(err.response);

            
        }
        
    }

    const getCommentList = async() => {
        const res = await api.get(`/comment/${code}?page=0`);
        setComments(res.data.content);

    }


    const registComment = async() => {
        try{
            await api.post(`/comment/${code}`, newComment);
            alert("댓글이 등록되었습니다!🎉");
            setNewComment({
                content: "",
                ip_address: ""
            });
        } catch(err){
            console.log(err); 
        }
        getCommentList();
    }


    const deleteComment = async(code) => {
        try{
            if(window.confirm("댓글을 삭제하시겠습니까?")){
                alert("삭제되었습니다.");
                await api.delete(`/comment/${code}`);
            } else {
                alert("삭제가 취소되었습니다.");
            }

        } catch(err){
            console.log(err, "삭제 실패");
            
        }
        getCommentList();

    }


    useEffect(() => {
        if(code){
            // countViews();
            getForumDetail();
            getCommentList();
        }
        
        
    }, [])



    // 경로가 변할 때마다 애니메이션 상태 설정
    useEffect(() => {
        setIsSliding(true);
      }, [location]); // location이 바뀔 때마다 애니메이션 재시작




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



    // HTML 안전하게 렌더링
    const SafeHTMLComponent = (content) => {
        
        const cleanHTML = DOMPurify.sanitize(content);
        //위험이 없어진 HTML 태그를 렌더링 한다.
        return <div dangerouslySetInnerHTML={{ __html: cleanHTML }} />;
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
                <div className={s.content}>{forum.content && SafeHTMLComponent(forum.content)}</div>
            </div>

            <div className={s.containerFooter}>
                <div style={{marginRight: "1em"}}>댓글 <b>{comments.length}</b></div>
                <div>조회수 <b>{forum.views}</b></div>
            </div> 


           {/* 댓글 리스트 */}
            <div className={s.containerComment}>

                <div className={s.containerWrite}>
                    <textarea rows="2" placeholder="댓글 작성"
                        name="content"
                        onInput={handleTextarea}
                        value={newComment.content}
                    />
                    <button onClick={() => registComment()}>확인</button>
                </div>


                {comments.map((comment, idx) => (
                    <div className={s.comment}>
                        <div className={s.commentHeader}>
                            <div>{comment.user.id}</div>
                            <div style={{marginLeft:"0.5em", marginRight:"0.5em"}}>•</div>
                            <div className={s.commentDate}> {comment.createAt && formattedDate(comment.createAt)}</div>
                            
                            { comment?.user?.userCode === data?.userCode ?
                            <div className={s.deleteBtn} onClick={() => deleteComment(comment.commentCode)}>
                                <img alt="delete" width={15} src="/deleteIcon.png"/>
                            </div> : <></>
                            }   
                        </div>
                        <div className={s.commentContent}>{comment.content}</div>

                    </div>
                ))}

            </div>
        </div>


    </div>

}

export default ForumDetail;