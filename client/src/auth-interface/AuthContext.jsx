import { createContext, useState, useEffect, useCallback } from "react"
import { loginAccount, getMe, registerAccount } from "../api/account"
import api from "../api/axios"

export const AuthContext = createContext()

export function AuthProvider({children}) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // 1. Hàm làm mới user (được bọc useCallback để tránh render lại liên tục)
    const refreshUser = useCallback(async () => {
        const savedToken = localStorage.getItem("token")
        if (!savedToken) {
            setUser(null)
            setLoading(false)
            return
        }

        try {
            // Set header token mặc định cho mọi request
            api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`
            const userData = await getMe(savedToken)
            setUser(userData)
        } catch (err) {
            console.error("Lỗi xác thực:", err)
            localStorage.removeItem("token")
            delete api.defaults.headers.common['Authorization']
            setUser(null)
        } finally {
            setLoading(false)
        }
    }, [])

    // 2. Chạy 1 lần duy nhất khi web bật lên
    useEffect(() => {
        refreshUser()
    }, [refreshUser])

    const login = async (identity, password) => {
        try {
            const { token } = await loginAccount({ identity, password })
            localStorage.setItem("token", token)
            // Gọi refreshUser để cập nhật state user ngay lập tức
            await refreshUser() 
            return { success: true }
        } catch (err) {
            return { success: false, message: err.response?.data?.message || "Lỗi đăng nhập" }
        }
    }

    const signup = async (formData) => { 
        try {
            const res = await registerAccount(formData)
            return { success: true, message: res.message }
        } catch (err) {
            return { success: false, message: err.response?.data?.message || "Lỗi đăng ký" }
        }
    }

    const logout = () => { 
        setUser(null)
        localStorage.removeItem("token") 
        delete api.defaults.headers.common['Authorization'] 
    }

    // 3. Quan trọng: Phải đưa refreshUser vào value để Profile gọi được
    const value = { user, loading, login, signup, logout, refreshUser };
    
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}