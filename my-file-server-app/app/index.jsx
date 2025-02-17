import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, Button, TextInput, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Page() {
  const router = useRouter(); // 페이지 이동을 위한 라우터
  const [id,setId] = useState('');
  const [pw, setPw] = useState('');
  const [message, setMessage] = useState('');
  const login = async ()=>{
    const formData = new FormData();
    formData.append('username', id);
    formData.append('password', pw);
    try{
      const response = await axios.post('http://localhost:8080/login', formData); 
      AsyncStorage.setItem('token', response.headers["authorization"]);
      router.push('/main');
    } catch(e){
      console.log(e);
      
      setMessage(e.response.data.error);
    }
  }
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{alignSelf:'center',backgroundColor:'white',width:450,height:450,borderRadius:50,display:'flex',alignItems:'center',justifyContent:'center'}}>
        <View style={{display:'flex',flexDirection:'column'}}>
          <View><Text style={{color:'#282c34',marginBottom:15,marginTop:-20,fontSize:32,fontWeight:'bold'}}>Login</Text></View>
          {message?<Text style={{color:'red',fontSize:12}}>{message}</Text>:<></>}
          <TextInput value={id} onChangeText={(v)=>setId(v)} style={styles.input} placeholder='아이디'/>
          <TextInput value={pw} onChangeText={(v)=>setPw(v)} style={styles.input} placeholder='비밀번호'/>
          <TouchableOpacity onPress={login} style={styles.button}>
            <Text style={styles.buttonText}>로그인</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>회원가입</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = {
  input:{
    backgroundColor: 'rgb(231,231,231)',
    fontSize:15,
    width:300,
    marginTop:15,
    paddingLeft:15,
    paddingTop:10,
    paddingBottom:10,
    border:'none',
    borderRadius:5,
    outline:'none',
  },
  button:{
    backgroundColor:'#282c34',
    borderRadius:5,
    marginTop:20,
    height:40,
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
  },
  buttonText:{
    color:'rgb(241, 241, 241)',
    fontSize:19,
    fontWeight:'bold',
  }
}