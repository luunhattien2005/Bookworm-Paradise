import { createContext, useState, useEffect } from "react"
import { loginAccount, getMe, registerAccount } from "../api/account"
import api from "../api/axios"


export const  AuthContext = createContext()

export function AuthProvider({children}) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    // const img_url = "https://dummyimage.com/50/000/fff"
    
    // Load từ localStorage khi mở website
    useEffect(() => {
    const initAuth = async () => {
        const savedToken = localStorage.getItem("token")

        if (!savedToken) {
            setLoading(false)
            return
        }

        try {
            api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`
            const user = await getMe(savedToken)
            setUser(user)
        } catch (err) {
            localStorage.removeItem("token")
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    initAuth()
    }, [])


    // Hàm đăng nhập
    const login = async (identity, password) => {
        try {
            const { token, user } = await loginAccount({ identity, password })
            localStorage.setItem("token", token)
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`
            setUser(user)
            return { success: true }
        } catch (err) {
            return { success: false, message: err.response?.data?.message || "Lỗi" }
        }
    }

    // Hàm đăng ký
    const signup = async (formData) => { 
        try {
            const res = await registerAccount(formData)
            return { success: true, message: res.message }
        } catch (err) {
            return { success: false, message: err.response?.data?.message || "Lỗi" }
        }
    }

    //Hàm đăng xuất
    const logout = () => { 
        setUser(null)
        // localStorage.removeItem("user")
        localStorage.removeItem("token") 
        delete api.defaults.headers.common['Authorization'] 
    }

    const value = { user, loading, login, signup, logout };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}