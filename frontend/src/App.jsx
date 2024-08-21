import { Container } from "@chakra-ui/react"
import { Navigate, Route, Routes, useLocation } from "react-router-dom"
import { useRecoilValue } from "recoil"
import userAtom from "../atoms/userAtom"
import CreatePost from "./components/CreatePost"
import Header from "./components/Header.jsx"
import './index.css'
import AuthPage from "./pages/AuthPage"
import HomePage from "./pages/HomePage"
import PostPage from "./pages/PostPage"
import UpdateProfilePage from "./pages/UpdateProfilePage"
import UserPage from "./pages/UserPage"
function App() {
  const user = useRecoilValue(userAtom)
  const {pathname} = useLocation()
  return (
    <Container maxW={pathname==="/"?{base:"620px",md:"900px"}:"620px"}>
      <Header/>
      <Routes>
          <Route path="/" element={user?<HomePage/>:<Navigate to="/auth"/>}/>
          <Route path="/auth" element={!user?<AuthPage/>:<Navigate to="/"/>}/>
          <Route path="/update" element={user?<UpdateProfilePage/>:<Navigate to="/auth"/>}/>
          <Route path="/:username" element={<UserPage/>}/>
          <Route path="/:username/post/:pid" element={<PostPage/>}/>
      </Routes>
      {user && <CreatePost/>}
    </Container>
  )
}

export default App
