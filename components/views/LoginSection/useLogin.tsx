import { useState } from "react"

export const useLogin = () => {
    const [showPassword, setShowPassword] = useState(false);

    const handleShowPassword = () => {
        setShowPassword(!showPassword)
    }


    return {
        handleShowPassword,
        showPassword
    }
}