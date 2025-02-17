import React, { useEffect, useState } from 'react'
import s from './Tutorial.module.css';
import { useNavigate } from 'react-router-dom';

const Tutorial = () => {
  const nav = useNavigate();
  const [scroll, setScroll] = useState(0);
  useEffect(()=>{
    const handleScroll = () => {
      setScroll(window.scrollY);
    };
    window.addEventListener("scroll",handleScroll);
    return()=>{
      window.removeEventListener("scroll",handleScroll);
    }
  },[]);
  const goService = (e) => {
    nav(`/${e.target.name}`);
  }

  useEffect(()=>{
    console.log(scroll);
  },[scroll])
  return (
    <div className={s.container}>
        <button>뒤로가기</button>
        <h1 className={s.title}>무료 파일 클라우드</h1>
        <h1> 돈 걱정 없이 자유롭게</h1>
        <div style={scroll > 300 ? {position:'fixed', top:10, right:20}:{}} className={s.loginButtonContainer}>
          <button name='' onClick={goService}>Login</button>
          <button name='join' onClick={goService}>Join</button>
        </div>
        <section className={s.section1}>
        <h1 className={s.section1h1} style={{transform: scroll > 300 ? `translateX(0)`:`translateX(-1000%)`}}>개인 클라우드</h1>
        <div className={s.section1Text1} style={{transform: scroll > 300 ? `translateX(0)`:`translateX(-500%)`}}>아무도 열람할 수 없습니다.</div>
        <div className={s.img}style={{
              opacity: scroll > 300 ? 1 : 0,
            }}>
          <img height={1000} style={{borderRadius:10}} src='/tutorial/private.png' alt='error'/>
        </div>
        <div style={{fontSize:'2em',paddingBottom:'30px',paddingTop:30}}>폴더로 관리해보세요.</div>
        <div style={{
        }} className={s.section1List}>
          <div style={{
            transform: scroll > 800 ? `translateX(0)`:`translateX(-1000%)`,
            transition:'all 2.1s ease'
          }}>파일 업로드</div>
          <div style={{
            transform: scroll > 800 ? `translateX(0)`:`translateX(-1000%)`,
            transition:'all 1.4s ease'
          }}>다운로드</div>
          <div style={{
            transform: scroll > 800 ? `translateX(0)`:`translateX(-1000%)`,
            transition:'all 1s ease'
          }}>새 폴더</div>
          <div style={{
            transform: scroll > 800 ? `translateX(0)`:`translateX(-800%)`,
            transition:'all 2s ease'
          }}>삭제</div>
          <div style={{
            transform: scroll > 800 ? `translateX(0)`:`translateX(-1000%)`,
            transition:'all 1.3s ease'
          }}>파일 미리보기</div>
          <div style={{
            transform: scroll > 800 ? `translateX(0)`:`translateX(-1000%)`,
            transition:'all 1.1s ease'
          }}>파일, 폴더 이름 변경</div>
        </div>
        </section>
        <div className={s.sectionDevider}></div>
        <section style={{marginTop:100}} className={s.section2}>
          <h1 className={s.section1h1} style={{transform: scroll > 2000 ? `translateX(0)`:`translateX(-1000%)`}}>공용 클라우드</h1>
          <div className={s.section1Text1} style={{transform: scroll > 2100 ? `translateX(0)`:`translateX(-500%)`}}>자랑스러운 순간을 모두에게 보여주세요.</div>
          <div className={s.img}style={{
              opacity: scroll > 2300 ? 1 : 0,
            }}>
          <img height={1000} style={{borderRadius:10}} src='/tutorial/public.png' alt='error'/>
        </div>
        </section>
    </div>
  )
}

export default Tutorial;