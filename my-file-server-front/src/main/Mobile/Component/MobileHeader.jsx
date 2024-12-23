import React, { useEffect, useState } from 'react';
import s from './MobileHeader.module.css';
import Sidebar from './Sidebar';
const MobileHeader = ({title,handleOpen=null}) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [background,setBackground] = useState(true);
    useEffect(()=>{
        setBackground(menuOpen);
    },[menuOpen])
    return (
        <header className={s.header}>
            <div className={s.title}>{title}</div>
            <div className={s.headerButtonContainer}>
                <button className={s.hambuger} onClick={() => 
                    setMenuOpen(handleOpen?handleOpen:!menuOpen)
                }>☰</button>
            </div>
            {/* 사이드 바 */}
            <Sidebar state={menuOpen}/>
            {/* 반투명 오버레이 */}
            {menuOpen && <div style={background?{opacity:1}:{opacity:0}} className={s.overlay} onClick={() => {setMenuOpen(false)}}></div>}
        </header>

    );
};


export default MobileHeader;