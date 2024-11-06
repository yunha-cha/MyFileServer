import { useLocation, useNavigate } from 'react-router-dom';
import s from './SideBar.module.css';
const SideBar = () => {
    const nav = useNavigate();
    const location = useLocation();
    if(location.pathname === '/'){
        return;
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
        <div className={s.title}>사이트 제목</div>
        <button onClick={logout} className={s.logout}>Logout</button>
      </div>
    )
}

export default SideBar;