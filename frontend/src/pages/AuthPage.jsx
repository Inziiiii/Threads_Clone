import React from 'react'
import { useRecoilValue } from 'recoil'
import authScreenAtom from '../../atoms/authAtom.js'
import LoginCard from '../components/LoginCard'
import SignupCard from '../components/SignupCard'

function AuthPage() {
    const authScreenState = useRecoilValue(authScreenAtom)
    return (
    <>
        {authScreenState==="login"?<LoginCard/>:<SignupCard/>}
    </>
  )
}

export default AuthPage