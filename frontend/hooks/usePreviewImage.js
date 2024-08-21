import { useState } from 'react'
import useShowToast from './useShowToast'

function usePreviewImage() {
    const showToast =  useShowToast()
    const [imgUrl,setImgUrl] = useState(null)
    const handleImageChange=(e)=>{
        const file = e.target.files[0]
        if(file && file.type.startsWith("image/")){
            const reader = new FileReader()
            reader.onloadend=()=>{
                setImgUrl(reader.result)
            }
            reader.readAsDataURL(file)
        } else {
            showToast("Inavlid file type","Please select an image file","Error")
            setImgUrl(null)
        }
    }
  return { handleImageChange,imgUrl,setImgUrl}
}

export default usePreviewImage