import { AddIcon } from '@chakra-ui/icons'
import { Button, CloseButton, Flex, FormControl, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Textarea, useColorModeValue, useDisclosure } from '@chakra-ui/react'
import React, { useRef, useState } from 'react'
import { BsFillImageFill } from 'react-icons/bs'
import { useParams } from "react-router-dom"
import { useRecoilState, useRecoilValue } from 'recoil'
import postsAtom from '../../atoms/postsAtom'
import userAtom from '../../atoms/userAtom'
import usePreviewImage from '../../hooks/usePreviewImage'
import useShowToast from '../../hooks/useShowToast'

function CreatePost() {
    const MAX_CHAR = 500
    const user = useRecoilValue(userAtom)
    const ImageRef = useRef(null)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [postText, setpostText] = useState('')
    const { handleImageChange, imgUrl, setImgUrl } = usePreviewImage()
    const [remainingChar, setRemainingChar] = useState(MAX_CHAR)
    const showToast = useShowToast()
    const [loading,setLoading] = useState(false)
    const [posts, setPosts] = useRecoilState(postsAtom)
    const {username} = useParams()


    const handleTextChange = (e) => {
        const inputText = e.target.value
        if (inputText.length > MAX_CHAR) {
            const truncatedText = inputText.slice(0, MAX_CHAR)
            setpostText(truncatedText)
            setRemainingChar(0)
        } else {
            setpostText(inputText)
            setRemainingChar(MAX_CHAR - inputText.length)
        }
    }
    const handleCreatePost = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/posts/create", {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ postedBy: user._id, text: postText, img: imgUrl })
            })
            const data = await res.json()
            if(data.error){
                showToast("Error",data.error,"error")
                return
            }
            showToast("Success","Post Created Successfully","success")
            if(username ===  user.username){
                setPosts([data,...posts])
            }
            setpostText("")
            setImgUrl('')
            onClose()
        } catch (error) {
            showToast("Error",error,"error")
        }finally{
            setLoading(false)
        }
    }
    return (
        <>
            <Button
                position={"fixed"}
                right={5}
                bottom={10}
                bg={useColorModeValue("gray.300", "gray.dark")}
                onClick={onOpen}
                size={{base:"sm",sm:"md"}}
            >
                <AddIcon />
            </Button>
            {/* <h1> Hello</h1> */}
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create Post</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl>
                            <Textarea
                                placeholder='Post goes here...'
                                onChange={handleTextChange}
                                value={postText}
                            />
                            <Text
                                fontSize={"xs"}
                                fontWeight={"bold"}
                                textAlign={"right"}
                                m={"1"}
                                color={"gray.800"}
                            >{remainingChar}/{MAX_CHAR}</Text>
                            <Input type='file' hidden ref={ImageRef} onChange={handleImageChange} />
                            <BsFillImageFill style={{ marginLeft: "5px", cursor: "pointer" }} size={16} onClick={() => ImageRef.current.click()} />
                        </FormControl>
                        {imgUrl && (
                            <Flex mt={5} w={"full"} position={"relative"}>
                                <Image src={imgUrl} alt='Selected Image' />
                                <CloseButton
                                    onClick={() => setImgUrl("")}
                                    bg={"gray.800"}
                                    position={"absolute"}
                                    top={2}
                                    right={2}
                                />
                            </Flex>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={handleCreatePost} isLoading={loading}>
                            Post
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default CreatePost