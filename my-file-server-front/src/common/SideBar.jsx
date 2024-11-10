import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import s from './SideBar.module.css';
import { useState } from 'react';
const SideBar = () => {
    const nav = useNavigate();
    const location = useLocation();
    const [isPublicCloud, setIsPublicCloud] = useState(false);
    const [user, setUser] = useState(null);

    if(location.pathname === '/'){
        return;
    } else if(location.pathname === '/main'){

    }
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const logout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    }
    return(
        <div>
            {/* 모바일이면 사이드바 안 그림 */}
            {isMobile ? <Outlet/> :      
        <div>   
            <div onClick={()=>nav('/main')} className={s.sidebarContainer}>
                <div className={s.title}><img alt='Error' style={{marginRight:20}} width={50} src='/icon.png'/>Cloud</div>
                <div>
                    <button onClick={logout} className={s.logout}>Logout</button>
                </div>
                <ul className={s.list}>
                    <li onClick={()=>setIsPublicCloud(false)}>개인 클라우드</li>
                    <li onClick={()=>setIsPublicCloud(true)}>공용 클라우드</li>
                    <li>자유 게시판 (미구현)</li>
                </ul>
            </div>
            <Outlet context={{isPublicCloud:isPublicCloud}}/>
        </div>
        }
      </div>
    )
}

export default SideBar;