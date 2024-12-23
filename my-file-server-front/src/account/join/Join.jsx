import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../common/BackButton';

function containsStringAndNumber(input) {
    const hasString = /[a-zA-Z]/.test(input);
    const hasNumber = /\d/.test(input);
    return hasString && hasNumber && input.length>=8;
}
function containsStringNumberAndSpecial(input) {
    
    const check = containsStringAndNumber(input);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(input);
    
    console.log(check && hasSpecial);
    
    return check && hasSpecial;
}
const Join = () => {
    const nav = useNavigate();
    const [id,setId] = useState({value:'',idMsg:'',status:false});
    const [pw, setPw] = useState({value:'',confirmValue:'',pwMsg:'',confirmValueMsg:'',status:false, confirm:false});
  
    const join = async () => {
        if(id.value&&id.status&&pw.value&&pw.confirmValue&&pw.status&&pw.confirm){
            const formData = new FormData();
            formData.append('id', id);
            formData.append('password', pw);
            try{
                // const res = await axios.post(`/api/join`, formData);
                // const res = await axios.post(`http://localhost:8080/join`, formData);
                // nav('/',{state:{message:res.data}})
                console.log('ss');
                
            } catch(err){
                alert(err.response.data);
            }
        } else {
            alert('모두 입력해주세요.');
        }
    }

    useEffect(()=>{
        if(id.value){
            containsStringAndNumber(id.value)?
                setId({...id,status:true,idMsg:'사용가능한 아이디입니다.'})
            :setId({...id, status:false,idMsg:'8자 이상, 영어, 숫자를 포함해야합니다.'})
        } else {
            setId({value:'',idMsg:'',status:false});
        }
    },[id.value])
    
    useEffect(()=>{
        if(pw.value){
            containsStringNumberAndSpecial(pw.value)?
                setPw({...pw, status:true,pwMsg:'사용 가능한 비밀번호입니다.',confirm:false})
            :setPw({...pw,status:false,pwMsg:'8자 이상, 영어, 숫자, 특수문자를 포함해야합니다.',confirm:false});
        } else {
            setPw({value:'',confirmValue:'',pwMsg:'',confirmValueMsg:'',status:false, confirm:false})
        }
    },[pw.value,pw.confirmValue]);
    useEffect(()=>{
        if(pw.value&&pw.confirmValue){
            pw.value===pw.confirmValue?setPw({...pw,confirm:true,confirmValueMsg:'비밀번호가 일치합니다.'}):setPw({...pw,confirm:false});
        }
    },[pw.confirmValue])


    return(
        <section className="login-container">
        <div className="login-input-container">
          <div className="login-input">
            <BackButton moveTo='/'/>
            <div className="login-input-text" style={{marginTop:30}}>Join</div>
            <div>사용하실 아이디, 비밀번호를 입력해주세요.</div>
            <div style={{color:id.status?'green':'red',fontSize:12,paddingTop:7}}>{id.idMsg}</div>
            <input className="login-id" placeholder="아이디" value={id.value} onChange={(e)=>setId({...id, value:e.target.value})}/>
            <div style={{color:pw.status?'green':'red',fontSize:12,paddingTop:7}}>{pw.pwMsg}</div>
            <input className="login-pw" placeholder="비밀번호" type="text" value={pw.value} onChange={(e)=>{setPw({...pw,value:e.target.value}); }}/>
            <div style={{color:pw.confirm?'green':'red',fontSize:12,paddingTop:7}}>{pw.confirmValueMsg}</div>
            {pw.status ? <input className='login-pw' placeholder='비밀번호 확인' type='text' value={pw.confirmValue} onChange={(e)=>setPw({...pw,confirmValue: e.target.value})}/> : <></>}

            {id.value&&id.status&&pw.value&&pw.confirmValue&&pw.status&&pw.confirm && <button onClick={join} className="join-button">가입 신청하기</button>}
          </div>
        </div>
      </section>
    )
}

export default Join;