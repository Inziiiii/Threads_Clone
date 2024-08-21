  import { Flex, Spinner } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import postsAtom from "../../atoms/postsAtom"
import useGetUserProfile from '../../hooks/useGetUserProfile'
import useShowToast from '../../hooks/useShowToast'
import Post from "../components/Post"
import UserHeader from '../components/UserHeader'
  

  function UserPage() {
    const { username } = useParams()
    const {user,loading} = useGetUserProfile()
    const [fetching,setFetching] = useState(true)
    const [posts,setPosts] = useRecoilState(postsAtom)
    const showToast = useShowToast()
  
    useEffect(() => {
  
      const getPosts = async()=>{
        setFetching(true)
        try {
          const res = await fetch(`/api/posts/user/${username}`)
          const data = await res.json()
          if(data.error){
            showToast("Error",data.error,"error")
            return;
          }
          // console.log(data);
          setPosts(data)
          // console.log(posts);
        } catch (error) {
          showToast("Error",error,"error")
          setPosts([])
          console.log(error);
        } finally {
          setFetching(false)
        }
      }
      getPosts()
    }, [username,showToast,setPosts])
    
    if(!user && loading) {
      return (
        <Flex justifyContent={"center"}>
          <Spinner size={"xl"}/>
        </Flex>
      )
    }
    if(!user && !loading) return <h1>User not found</h1>
    return (
      <>
        <UserHeader user={user}/>
        {!fetching && posts.length===0 && <h1>User has not posted anything.</h1>}
        {fetching && (
          <Flex justifyContent={"center"} my={12}>
            <Spinner size={"xl"}/>
          </Flex>
        )}
        {posts.map((post) => (
          // ... some code
          <Post key={post._id} post={post} postedBy={post.postedBy} />
        ))}
      </>
    )
  }
  
  export default UserPage