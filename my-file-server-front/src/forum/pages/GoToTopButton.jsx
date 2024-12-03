import React, { useEffect, useState } from 'react';
import { IoIosArrowDropup } from "react-icons/io";

const GoToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    // 스크롤 이벤트 핸들러
    const handleScroll = () => {
        if (window.scrollY > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    const handleScrollToTop = () => {
        // 부드럽게 화면 상단으로 스크롤
        window.scrollTo({
            top: 0,
            behavior: "smooth", // 스크롤 애니메이션 활성화
        });
    };

    return isVisible ? (
        <div style={{ position: 'fixed', bottom: '20px', left: '60%', zIndex: '5' }}>
            <button onClick={handleScrollToTop} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <IoIosArrowDropup size={40} />
            </button>
        </div>
    ) : null;
};

export default GoToTopButton;
