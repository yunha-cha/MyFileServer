import React, { useCallback, useEffect, useState } from 'react';
import Sidebar from '../Component/Sidebar';
import s from './MobileMainComponent.module.css';
import api from '../../../common/api';
import Pagination from 'react-js-pagination';
import MobilePublicContent from './MobilePublicContent';

const MobileMainComponent = () => {
    /**사이드 메뉴 바 출력 여부>*/
    const [menuOpen, setMenuOpen] = useState(false);
    /**서버로부터 받은 공용 클라우드 데이터 */
    const [publicDatas, setPublicDatas] = useState({});

    const [page, setPage] = useState(0);    //현재 페이지
    const [totalElements, setTotalElements] = useState(0);  //총 파일 개수
    useEffect(() => {
        getPublicFile();
    }, [])
    useEffect(()=> {
        if(publicDatas)console.log("받은 데이터" , publicDatas);
        
    },[publicDatas])
    const getPublicFile = useCallback(async () => { //페이지에 따라 파일 가져오는 함수
        const res = await api.get(`/main/file/public?page=${page}`);
        setTotalElements(res.data.totalElements);        
        setPublicDatas(res.data.content);        
    },[page]);
    return (
        <div>
            <header className={s.header}>
                <div>공용 클라우드</div>
                <div>
                    <button>돋보기</button>
                    <button onClick={() => setMenuOpen(true)}>☰</button>
                </div>
            </header>
            {/* 콘텐츠 출력 영역 */}
            {publicDatas.length > 0 ?
                publicDatas.map((data)=> (
                    <MobilePublicContent contentData={data} key={data.fileCode}/>
                ))
                :
                <p>공용 클라우드에 자료가 없습니다.</p>
            }
            {/* 사이드 바 */}
            <Sidebar state={menuOpen}/>
            {/* 슬라이드 메뉴바 */}
            {menuOpen && <div className={s.overlay} onClick={() => {setMenuOpen(false)}}></div>}
            <div className={s.pagination}>
                <Pagination
                activePage={page}
                itemsCountPerPage={15}
                totalItemsCount={totalElements}
                onChange={(page)=>setPage(page-1)}/>
            </div>
        </div>
    );
};

export default MobileMainComponent;