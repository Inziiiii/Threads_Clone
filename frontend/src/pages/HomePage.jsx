import { Box, Flex, Skeleton, SkeletonCircle } from "@chakra-ui/react"
import { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import postsAtom from "../../atoms/postsAtom"
import userAtom from "../../atoms/userAtom"
import useShowToast from "../../hooks/useShowToast"
import Post from "../components/Post"
import SuggestedUsers from "../components/SuggestedUsers"

function HomePage() {
  const currentUser = useRecoilValue(userAtom)
  const [posts, setPosts] = useRecoilState(postsAtom)
  const [loading, setLoading] = useState(true)
  const showToast = useShowToast()
  useEffect(() => {
    const getFeedPosts = async () => {
      setLoading(true)
      setPosts([])
      try {
        const res = await fetch(`/api/posts/feed/${currentUser._id}`)
        const data = await res.json()
        if (data.error) {
          showToast("Error", data.error, "error")
        }
        setPosts(data)
      } catch (error) {
        showToast("Error", error.message, "error")
      } finally {
        setLoading(false)
      }
    }
    getFeedPosts()
  }, [showToast, setPosts])
  return (
    <>
      <Flex display={{base:"block",md:"none"}}>
        <Box>
        <SuggestedUsers />
        </Box>
      </Flex>
      <Flex gap="10" alignItems={"flex-start"}>
        <Box flex={70} >
          {!loading && posts.length === 0 && <h1>Follow some users to see posts</h1>}
          {loading &&
            [0, 1, 2, 3, 4].map((_, idx) => (
              <Flex
                key={idx}
                gap={2}
                alignItems={"center"}
                p={"1"}
                borderRadius={"md"}
              >
                {/* Avatar */}
                <Box>
                  <SkeletonCircle size={"10"} />
                </Box>
                {/* Username and fullname */}
                <Flex w={"full"} flexDirection={"column"} gap={2} mt={20}>
                  <Skeleton h={"8px"} w={"90px"} />
                  <Skeleton h={"80px"} w={"full"} />
                </Flex>
                {/* Follow Button */}
                {/* <Flex>
                  <Skeleton h={"20px"} w={"60px"} />
                </Flex> */}
              </Flex>
            ))}
          {posts.map((post) => (
            <Post key={post._id} post={post} postedBy={post.postedBy}/>
          ))}
        </Box>
        <Box flex={30} display={{ base: "none", md: "block" }}>
          <SuggestedUsers />
        </Box>
      </Flex>
    </>
  )
}

export default HomePage