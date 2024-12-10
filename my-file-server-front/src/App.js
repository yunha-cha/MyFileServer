import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./account/login/Login";
import Main from "./main/Main";
import SideBar from "./common/SideBar";
import ForumMain from "./forum/pages/ForumMain";
import UserPage from "./user-page/UserPage";
import ForumDetail from "./forum/pages/ForumDetail";
import JoinMember from "./admin/JoinMember";
import Join from "./account/join/Join";
import ForumCreate from "./forum/pages/ForumCreate";
import PCMainPublic from "./main/PC/PCMainPublic";
import NotFound from "./common/NotFound";


function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true}}>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/join" element={<Join/>}/>
        <Route element={<SideBar/>}>
          <Route path="main" element={<Main/>}/>
          <Route path="/main/public" element={<PCMainPublic/>}/>
          <Route path="user/:id" element={<UserPage/>}/>
          <Route path="admin" element={<JoinMember/>}/>
          <Route path="/forum" element={<ForumMain/>} />
          <Route path="/forum/:code" element={<ForumDetail/>} />
          <Route path="/forum/write" element={<ForumCreate />} />
        </Route>
        <Route path="*" element={<NotFound/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
