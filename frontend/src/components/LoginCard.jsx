import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    InputGroup,
    InputRightElement,
    Link,
    Stack,
    Text,
    useColorModeValue
} from '@chakra-ui/react'
import { useState } from 'react'
import { useSetRecoilState } from 'recoil'
import authScreenAtom from '../../atoms/authAtom'
import userAtom from '../../atoms/userAtom'
import useShowToast from '../../hooks/useShowToast'

export default function LoginCard() {
    const [showPassword, setShowPassword] = useState(false)
    const setAuthScreen = useSetRecoilState(authScreenAtom)
    const showToast = useShowToast()
    const setUser = useSetRecoilState(userAtom)
    const [loading,setloading] = useState(false)

    const [inputs, setInputs] = useState({
        username: "",
        password: ""
    })
    const handleLogin = async () => {
        setloading(true)
        try {
            const res = await fetch("/api/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(inputs)
            })
            const data = await res.json()

            if (data.error) {
                console.log(data.error);
                showToast("Error",data.error,"error")
                return
            }
            console.log(data);
            localStorage.setItem("user-threads", JSON.stringify(data))
            setUser(data)
        } catch (error) {
            showToast("Error",error,"error")
        } finally {
            setloading(false)
        }
    }
    return (
        <Flex align={'center'} justify={'center'}>
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                <Stack align={'center'}>
                    <Heading fontSize={'4xl'} textAlign={'center'}>
                        Log in
                    </Heading>
                </Stack>
                <Box
                    rounded={'lg'}
                    bg={useColorModeValue('white', 'gray.dark')}
                    boxShadow={'lg'}
                    p={8}
                    w={{
                        base: "full",
                        sm: "400px"
                    }}
                >
                    <Stack spacing={4}>
                        <FormControl isRequired>
                            <FormLabel>Username</FormLabel>
                            <Input type="text" 
                            onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
                            value={inputs.username} />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>Password</FormLabel>
                            <InputGroup>
                                <Input type={showPassword ? 'text' : 'password'} 
                                onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
                                value={inputs.password}
                                />
                                <InputRightElement h={'full'}>
                                    <Button
                                        variant={'ghost'}
                                        onClick={() => setShowPassword((showPassword) => !showPassword)}>
                                        {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                        <Stack spacing={10} pt={2}>
                            <Button
                                loadingText="Logging in"
                                size="lg"
                                bg={useColorModeValue("gray.600", "gray.700")}
                                color={'white'}
                                _hover={{
                                    bg: useColorModeValue("gray.700", "gray.800")
                                }}
                                onClick={handleLogin}
                                isLoading={loading}
                            >
                                Log in
                            </Button>
                        </Stack>
                        <Stack pt={6}>
                            <Text align={'center'}>
                                Don't have an account? <Link onClick={() => setAuthScreen("signup")} color={'blue.400'}>Sign up</Link>
                            </Text>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    )
}