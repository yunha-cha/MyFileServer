import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Button, View, Text } from "react-native";

export default MainScreen = () => {
    const router = useRouter(); // 페이지 이동을 위한 라우터
    useEffect(()=>{
      console.log(AsyncStorage.getItem('token'));
    },[])
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 24 }}>상세 페이지</Text>
          <Button title="뒤로 가기" onPress={() => router.back()} />
        </View>
      );
}