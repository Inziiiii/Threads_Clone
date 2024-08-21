import { Avatar, Box, Button, Flex, Menu, MenuButton, MenuItem, MenuList, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Portal, Skeleton, SkeletonCircle, Text, VStack, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { BsInstagram } from "react-icons/bs"
import { CgMoreO } from "react-icons/cg"
import { Link } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import userAtom from '../../atoms/userAtom'
import useHandleFollowAndUnfollow from '../../hooks/useHandleFollowAndUnfollow'
import useShowToast from '../../hooks/useShowToast'


function UserHeader({ user }) {
    const toast = useToast()
    const showToast = useShowToast()
    const currentUser = useRecoilValue(userAtom)
    const { handleFollowUnfollow, updating, following } = useHandleFollowAndUnfollow({ user })
    const [loading, setLoading] = useState(true);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [followers,setFollowers]=  useState([])

    const copyURL = () => {
        const currURl = window.location.href;
        navigator.clipboard.writeText(currURl).then(() => {
            showToast("Copied", "URL Copied", "success")
        })
    }
    const handleClose = ()=>{
        onClose(true)
        setLoading(false)
    }
    const getUserFollowers = async () => {
        onOpen(true)
        setLoading(true)
        try {
            const res = await fetch(`/api/users/${user.username}/followers`)
            const data = await res.json()
            if(data.error){
                showToast("Error",data.error,"error")
                return;
            }
            setFollowers(data)
        } catch (error) {
            showToast("Error", error, "error")
        } finally {
            setLoading(false)
        }
    }
    return (
        <>
            <VStack gap={4} alignItems={"start"}>
                <Flex justifyContent={"space-between"} w="full">
                    <Box>
                        <Text fontSize={"2xl"} fontWeight={"bold"}>{user.name}</Text>
                        <Flex gap={2} alignItems={"center"}>
                            <Text fontSize={"sm"}>{user.username}</Text>
                            <Text fontSize={"xs"} bg={"gray.dark"} color={"gray.light"} p={1} borderRadius={"full"}>threads.net</Text>
                        </Flex>
                    </Box>
                    <Box>
                        {user.profilePic && <Avatar
                            name={user.name}
                            src={user.profilePic}
                            size={{
                                base: "md",
                                md: "xl"
                            }}
                        />}
                        {!user.profilePic && <Avatar
                            name="random"
                            src="https://bit.ly/broken-link"
                            size={{
                                base: "md",
                                md: "xl"
                            }}
                        />}
                    </Box>
                </Flex>
                <Text>{user.bio}</Text>
                {currentUser && <>
                    {
                        currentUser._id === user._id && (
                            <Link to='/update'>
                                <Button size={"sm"}>Update Profile</Button>
                            </Link>
                        )
                    }
                    {currentUser._id !== user._id && (
                        <Button isLoading={updating} onClick={handleFollowUnfollow} size={"sm"}>{following ? "Unfollow" : "Follow"}</Button>
                    )}
                </>
                }
                {!currentUser && <>
                    <Button isLoading={updating} onClick={handleFollowUnfollow} size={"sm"}>{following ? "Unfollow" : "Follow"}</Button>
                </>}
                <Flex w={"full"} justifyContent={"space-between"}>
                    <Flex alignItems={"center"} gap={2}>
                        <Text onClick={getUserFollowers} _hover={{ cursor: 'pointer' }} color={"gray.light"}>{user.followers.length} followers</Text>
                        <Box bg={"gray.light"} h={1} w={1} borderRadius={"full"}></Box>
                        <Link style={{ color: "#616161" }}>instagram.com</Link>
                    </Flex>
                    <Flex>
                        <Box className='icon-container'>
                            <BsInstagram size={24} cursor={"pointer"} />
                        </Box>
                        <Box className='icon-container'>
                            <Menu>
                                <MenuButton>
                                    <CgMoreO size={24} cursor={"pointer"} />
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
                <Flex w={"full"}>
                    <Flex flex={1} borderBottom={"1.5px solid white"} justifyContent={"center"} pb="3" cursor={"pointer"}>
                        <Text fontWeight={"bold"}>Threads</Text>
                    </Flex>
                    <Flex flex={1} borderBottom={"1px solid gray"} justifyContent={"center"} color={"#636361"} pb="3" cursor={"pointer"}>
                        <Text fontWeight={"bold"}>Replies</Text>
                    </Flex>
                </Flex>
            </VStack>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent w={{ base: "300px", md: "full" }}>
                    <ModalHeader>Followers</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        {loading &&
                            [0, 1, 2].map((_, idx) => (
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
                                    <Flex w={"full"} flexDirection={"column"} gap={2}>
                                        <Skeleton h={"8px"} w={"80px"} />
                                        <Skeleton h={"8px"} w={"90px"} />
                                    </Flex>
                                    {/* Follow Button */}
                                    <Flex>
                                        <Skeleton h={"20px"} w={"60px"} />
                                    </Flex>
                                </Flex>
                            ))}
                            <Box>
                            {!loading && followers.map((user) => <UserList key={user._id} user={user} />)}
                            </Box>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UserHeader