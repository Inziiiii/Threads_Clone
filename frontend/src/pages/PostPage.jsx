import { DeleteIcon } from '@chakra-ui/icons'
import { Avatar, Box, Button, Divider, Flex, Image, Menu, MenuButton, MenuItem, MenuList, Portal, Spinner, Text } from '@chakra-ui/react'
import { formatDistanceToNow } from 'date-fns'
import React, { useEffect, useState } from 'react'
import { BsThreeDots } from 'react-icons/bs'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import postsAtom from '../../atoms/postsAtom'
import userAtom from '../../atoms/userAtom'
import useGetUserProfile from '../../hooks/useGetUserProfile'
import useShowToast from '../../hooks/useShowToast'
import Actions from '../components/Actions'
import Comment from '../components/Comment'

function PostPage() {
  const currentUser = useRecoilValue(userAtom)
  const { user, loading } = useGetUserProfile()
  const [post, setPost] = useState(null)
  const [posts, setPosts] = useRecoilState(postsAtom)
  const showToast = useShowToast()
  const { pid } = useParams()
  const navigate = useNavigate()
  const currentPost = posts[0]
  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await fetch(`/api/posts/${pid}`)
        const data = await res.json()
        if (data.error) {
          showToast("Error", data.error, "error")
          return
        }
        setPosts([data])
      } catch (error) {
        showToast("Error", error, "error")
      }
    }
    getPost()
  }, [showToast, pid, setPosts])
  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    )
  }

  const copyURL = () => {
    const currURl = window.location.href;
    navigator.clipboard.writeText(currURl).then(() => {
      showToast("Copied", "URl copied", "success")
    })
  }
  if (!currentPost) return null

  const handleDeletePost = async () => {
    try {
      if (!window.confirm("Are you sure you want to delete this post?")) return;
      const res = await fetch(`/api/posts/${currentPost._id}`, {
        method: "Delete"
      })
      const data = await res.json()
      if (data.error) {
        showToast("Error", data.error, "error")
      }
      showToast("Success", "Post deleted", "success")
      navigate(`/${user.username}`)
    } catch (error) {
      showToast("Error", error, "error")
    }
  }

  return (
    <>
      <Flex justifyContent={"space-between"}>
        <Flex alignItems={"center"} w={"Full"} gap={3} as={Link} to={`/${user.username}`}>
          <Avatar src={user.profilePic} size={"md"} name='Mark' />
          <Flex alignItems={"center"}>
            <Text fontSize={"sm"} fontWeight={"bold"}>{user.username}</Text>
            <Image src='/verified.png' h={4} w={4} ml={2} />
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={"center"}>
          <Text fontSize={"xs"} textAlign={"right"} color={"gray.light"}>
            {formatDistanceToNow(new Date(currentPost.createdAt))} ago
          </Text>
          {currentUser?._id === user._id && (
            <DeleteIcon size={20} cursor={"pointer"} onClick={handleDeletePost} />
          )}
          <Box className='icon-container' onClick={(e) => e.preventDefault()}>
            <Menu>
              <MenuButton>
                <BsThreeDots />
              </MenuButton>
              <Portal>
                <MenuList>
                  <MenuItem onClick={copyURL}>Copy Link</MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>
      <Text my={3}>{currentPost.text}</Text>
      {currentPost.img && (
        <Box borderRadius={6} overflow={"hidden"} border={"1px solid gray.light"}>
          <Image src={currentPost.img} w={"full"} />
        </Box>
      )}
      <Flex gap={3} my={3}>
        <Actions post={currentPost} />
      </Flex>
      <Divider my={4} />
      <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2xl"}>👋</Text>
          <Text color={"gray.light"}>Get the app to like, reply and post.</Text>
        </Flex>
        <Button>GET</Button>
      </Flex>
      <Divider my={4} />
      {currentPost.replies.map((reply, index) => (
        <Comment key={reply._id} reply={reply} lastReply={index === currentPost.replies.length - 1} />
      ))}
    </>
  )
}

export default PostPage