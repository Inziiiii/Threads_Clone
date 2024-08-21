import { useState } from 'react'
import { useRecoilValue } from 'recoil'
import userAtom from '../atoms/userAtom'
import useShowToast from './useShowToast'


const useHandleFollowAndUnfollow = ({user}) => {
    const currentUser = useRecoilValue(userAtom)
    const [following, setFollowing] = useState(currentUser && user.followers.includes(currentUser._id))
    const [updating, setUpdating] = useState(false)
    const showToast = useShowToast()
    const handleFollowUnfollow = async () => {
        if (!currentUser) {
            showToast("Error", "Please login to follow", "error")
            return
        }
        if (updating) return
        setUpdating(true)
        try {
            const res = await fetch(`/api/users/follow/${user._id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            const data = await res.json()
            if (data.error) {
                showToast("Error", data.error, "error")
                // console.log(data.error);
                return
            }
            if (following) {
                showToast("Success", `User unfollowed ${user.name}`, "success")
                user.followers.pop()
            } else {
                showToast("Success", `User followed ${user.name}`, "success")
                user.followers.push(currentUser._id)
            }
            setFollowing(!following)
            // console.log(data);
        } catch (error) {
            showToast("Error", error, "error")
        } finally {
            setUpdating(false)
        }
    }
    return {handleFollowUnfollow,updating,following}
}

export default useHandleFollowAndUnfollow