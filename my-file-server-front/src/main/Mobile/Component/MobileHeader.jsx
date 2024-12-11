import React, { useState } from 'react';
import s from './MobileHeader.module.css';
import Sidebar from './Sidebar';
const MobileHeader = ({title,handleOpen}) => {
    const [menuOpen, setMenuOpen] = useState(false);
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
            {menuOpen && <div className={s.overlay} onClick={() => {setMenuOpen(false)}}></div>}
        </header>

    );
};

MobileHeader.defaultProps = {
    handleOpen: null
}

export default MobileHeader;