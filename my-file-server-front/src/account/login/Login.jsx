import axios from 'axios';
import './Login.css';
import React, { useEffect, useState } from 'react';
import {  useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getUser } from '../../reducer/UserDataSlice';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [message,setMessage] = useState('');
  const [id,setId] = useState('');
  const [pw, setPw] = useState('');

  const login = async (e) => {
    if(e.key === 'Enter' || e.type === 'click'){

        const formData = new FormData();
        formData.append('username', id);
        formData.append('password', pw);

        try{
            const response = await axios.post('/api/login', formData);
            // const response = await axios.post('http://localhost:8080/login', formData);
            localStorage.setItem('token', response.headers.get("Authorization"));
            dispatch(getUser());
            navigate('/main');
        }catch(err){
            setMessage(err.response.data.error);
            
        }
    }
  }

  useEffect(() => {
    if(localStorage.getItem('token')){
        navigate('/main');
    }
  }, [navigate]);

  return (
      <section className="login-container">
        <div className="login-input-container">
          <div className="login-input">
            <div className="login-input-text">Login{message? <div className='login-server-message'>{message}</div> :<></>}</div>
            <input className="login-id" placeholder="아이디" value={id} onChange={(e)=>setId(e.target.value)}/>
            <input className="login-pw" placeholder="비밀번호" type="password" value={pw} onChange={(e)=>setPw(e.target.value)} onKeyDown={(e)=>login(e)}/>
            <button onClick={(e)=>login(e)} className="login-button">로그인</button>
            <button onClick={()=>navigate('/join')} className="login-button">회원 가입 신청</button>
            <div className='find-account-container'>
            </div>
          </div>
        </div>
      </section>
  );
}

export default Login;