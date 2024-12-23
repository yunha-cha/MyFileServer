import React from 'react';
import s from './Sidebar.module.css'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
function Sidebar({state}) {
    const nav = useNavigate();
    const {data} = useSelector((st)=>st.user);

    const logout = () =>{
        localStorage.removeItem('token');
        nav('/');
    }
    return (
        <aside style={state ? { right: 0 } : { right: -1000 }} className={s.sideMenu}>
            <div style={{display:'flex',paddingTop:20}}>
                <img height={60} width={70} src='/icon.png' alt='Error'/>
                <h3 style={{paddingLeft:10}}>파일 클라우드</h3>
            </div>
            <ol>
                <li onClick={()=>nav('/main/public')}>공용 클라우드</li>
                <li onClick={()=>nav('/main')}>개인 클라우드</li>
                <li onClick={()=>nav('/forum')}>게시판</li>
                {data&&data.userRole==="ROLE_ADMIN"&&<li onClick={()=>nav('/admin/user')}>관리자</li>}
            </ol>
            <div className={s.userButton}>
                <button onClick={()=>nav(`/user/${data.userCode}`)}>마이페이지</button>
                <button onClick={logout}>로그아웃</button>
            </div>
        </aside>
    );
}

export default Sidebar;