import { Avatar, Box, Flex, Image, Menu, MenuButton, MenuItem, MenuList, Portal, Text, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { BsThreeDots } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import Actions from './Actions'

function UserPost({ likes, replies, postImg, postTitle }) {
    const [liked, setLiked] = useState(false)
    const toast = useToast()
    const copyURL = () => {
        const currURl = window.location.href;
        navigator.clipboard.writeText(currURl).then(() => {
            toast({
                title: 'Copied URL',
                description: "URL has been copied to clipboard",
                status: 'success',
                duration: 3000,
                isClosable: true,
            })
        })
    }
    return (
        <>
            <Link to={"/mark/post/1"}>
                <Flex gap={3} mb={4} py={5}>
                    <Flex flexDirection={"column"} alignItems={"center"}>
                        <Avatar
                            size="md"
                            name='user'
                            src='/zuck-avatar.png'
                        />
                        <Box w={"1px"} h={"full"} bg={"gray.light"} my={2}></Box>
                        <Box position={"relative"} w={"full"}>
                            <Avatar
                                size="xs"
                                name='John Doe'
                                src='https://bit.ly/dan-abramov'
                                position={'absolute'}
                                top={"0px"}
                                left={"15px"}
                                padding={"2px"}
                            />
                            <Avatar
                                size="xs"
                                name='John Doe'
                                src='https://bit.ly/prosper-baba'
                                position={'absolute'}
                                bottom={"0px"}
                                right={"-5px"}
                                padding={"2px"}
                            />
                            <Avatar
                                size="xs"
                                name='John Doe'
                                src='https://bit.ly/code-beast'
                                position={'absolute'}
                                bottom={"0px"}
                                left={"4px"}
                                padding={"2px"}
                            />
                        </Box>
                    </Flex>
                    <Flex flex={1} flexDirection={"column"} gap={2}>
                        <Flex justifyContent={"space-between"} w={"full"}>
                            <Flex w={"full"} alignItems={"center"}>
                                <Text fontSize={"sm"} fontWeight={"bold"}>markzuckeberg</Text>
                                <Image src='/verified.png' w={4} h={4} ml={1} />
                            </Flex>
                            <Flex gap={4} alignItems={"center"}>
                                <Text fontStyle={"sm"} color={"gray.light"}>1d</Text>
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
                        <Text fontSize={"sm"}>{postTitle}</Text>
                        {postImg && <Box borderRadius={6} overflow={"hidden"} border={"1px solid gray.light"}>
                            <Image src={postImg} w={"full"} />
                        </Box>}
                        <Flex gap={3} my={1}>
                            <Actions liked={liked} setLiked={setLiked} />
                        </Flex>
                        <Flex alignItems={"center"} gap={2}>
                            <Text color={"gray.light"} fontSize={"sm"}>{replies} replies</Text>
                            <Box bg={"gray.light"} h={0.5} w={0.5} borderRadius={"full"}></Box>
                            <Text color={"gray.light"} fontSize={"sm"}>{likes} likes</Text>
                        </Flex>
                    </Flex>
                </Flex>
            </Link>
        </>
    )
}

export default UserPost