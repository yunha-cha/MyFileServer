import axios from 'axios';
import './Login.css';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {message} = location.state || {};
  const [id,setId] = useState('');
  const [pw, setPw] = useState('');

  const login = async (e) => {
    if(e.key === 'Enter' || e.type === 'click'){

        const formData = new FormData();
        formData.append('username', id);
        formData.append('password', pw);

        try{
            const response = await axios.post('/api/login', formData);
            localStorage.setItem('token', response.headers.get("Authorization"));
            navigate('/main');
        }catch(err){
            alert("로그인에 실패하였습니다. \n다시 시도해주시기 바랍니다.", err);
        }
    }
  }

  useEffect(() => {
    if(localStorage.getItem('token')){
        navigate('/main');
    }
  }, []);

  return (
      <section className="login-container">
        <div className="login-input-container">
          <div className="login-input">
            <div className="login-input-text">Login{message? <div className='login-server-message'>{message}</div> :<></>}</div>
            <input className="login-id" placeholder="아이디" value={id} onChange={(e)=>setId(e.target.value)}/>
            <input className="login-pw" placeholder="비밀번호" type="password" value={pw} onChange={(e)=>setPw(e.target.value)} onKeyDown={(e)=>login(e)}/>
            <button onClick={(e)=>login(e)} className="login-button">로그인</button>
            <div className='find-account-container'>
            </div>
          </div>
        </div>
      </section>
  );
}

export default Login;