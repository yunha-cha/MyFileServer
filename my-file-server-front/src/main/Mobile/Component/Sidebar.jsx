import React from 'react';
import s from './Sidebar.module.css'
import { useNavigate } from 'react-router-dom';
function Sidebar({state}) {
    const nav = useNavigate();
    return (
        <aside style={state ? { right: 0 } : { right: -250 }} className={s.sideMenu}>
            <ol>
                <li onClick={()=>nav('/main/public')}>공용 클라우드</li>
                <li onClick={()=>nav('/main')}>개인 클라우드</li>
                <li onClick={()=>nav('/')}>게시판</li>
            </ol>
            <div className={s.userButton}>
                <button onClick={()=>nav('/')}>마이페이지</button>
                <button onClick={()=>nav('/')}>로그아웃</button>
            </div>
        </aside>
    );
}

export default Sidebar;