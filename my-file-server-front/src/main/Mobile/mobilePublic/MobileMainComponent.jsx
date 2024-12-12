import React, { useCallback, useEffect, useState } from 'react';
import Sidebar from '../Component/Sidebar';
import s from './MobileMainComponent.module.css';
import api from '../../../common/api';
import Pagination from 'react-js-pagination';
import MobilePublicContent from './MobilePublicContent';
import FileDetailMenu from '../Component/FileDetailMenu';
import MobileHeader from '../Component/MobileHeader';

const MobileMainComponent = () => {
    /**사이드 메뉴 바 출력 여부>*/
    const [menuOpen, setMenuOpen] = useState(false);
    /**서버로부터 받은 공용 클라우드 데이터 */
    const [publicDatas, setPublicDatas] = useState({});
    /**사용자가 선택한 파일 */
    const [fileDetail, setFileDetail] = useState({
        isOpen: false,
        file: {}
    })
    const closeDetailMenu = () => {
        setFileDetail((data)=>{ return{...data, isOpen : false}});
    }
    const [page, setPage] = useState(0);    //현재 페이지
    const [totalElements, setTotalElements] = useState(0);  //총 파일 개수
    
    useEffect(()=> {
        if(publicDatas)console.log("받은 데이터" , publicDatas);
        
    },[publicDatas])
    const getPublicFile = useCallback(async () => { //페이지에 따라 파일 가져오는 함수
        const res = await api.get(`/main/file/public?page=${page}`);
        setTotalElements(res.data.totalElements);        
        setPublicDatas(res.data.content);        
    },[page]);
    
    useEffect(() => {
        getPublicFile();
    }, [getPublicFile])
    return (
        <div style={{minHeight:'100vh',overflow:'auto'}}>
            <MobileHeader title='공용 클라우드'/>
            <div className='facker' style={{marginTop:'5vh'}}></div>
            {/* 콘텐츠 출력 영역 */}
            {publicDatas.length > 0 ?
                publicDatas.map((data)=> (
                    <MobilePublicContent contentData={data} key={data.fileCode} setFileDetail={setFileDetail}/>
                ))
                :
                <p>공용 클라우드에 자료가 없습니다.</p>
            }
            {/* 슬라이드 메뉴바 */}
            {menuOpen && <div className={s.overlay} onClick={() => {setMenuOpen(false)}}></div>}
            <div className={s.pagination}>
                <Pagination
                activePage={page}
                itemsCountPerPage={15}
                totalItemsCount={totalElements}
                onChange={(page)=>setPage(page-1)}/>
            </div>
            {/* 사용자가 터치한 파일 */}
            <FileDetailMenu file={fileDetail.file} setClose={closeDetailMenu} state={fileDetail.isOpen}/>
        </div>
    );
};

export default MobileMainComponent;