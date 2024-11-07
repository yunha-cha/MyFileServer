import { useLocation, useNavigate } from 'react-router-dom';
import s from './SideBar.module.css';
import { useState } from 'react';
const SideBar = () => {
    const nav = useNavigate();
    const location = useLocation();
    if(location.pathname === '/'){
        return;
    } else if(location.pathname === '/main'){

    }
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
        return;
    }
    const logout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    }
    return(
        <div onClick={()=>nav('/main')} className={s.sidebarContainer}>
        <div className={s.title}><img style={{marginRight:20}} width={50} src='/icon.png'/>Cloud</div>
        <div>
            <button onClick={logout} className={s.logout}>Logout</button>
            <button className={s.logout}>Mypage</button>
        </div>
        <ul className={s.list}>
            <li>개인 클라우드</li>
            <li>공용 클라우드</li>
            <li>자유 게시판</li>
        </ul>
      </div>
    )
}

export default SideBar;