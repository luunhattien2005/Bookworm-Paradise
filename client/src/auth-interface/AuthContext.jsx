import { createContext, useState, useEffect } from "react"
import axios from "axios" // thêm

export const  AuthContext = createContext()

export function AuthProvider({children}) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    // const img_url = "https://dummyimage.com/50/000/fff"
    const API_URL = "http://localhost:5000/api/accounts" // thêm
    
    // Load từ localStorage khi mở website
    useEffect(() => {
        const savedUser = localStorage.getItem("user")
        const savedToken = localStorage.getItem("token") // thêm
        if (savedUser && savedToken) { // sửa
            setUser(JSON.parse(savedUser))
            axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}` // thêm
        }

        setLoading(false) //Load xong user
    }, [])

    // Hàm đăng nhập
    const login = async (username, password) => { // sửa toàn bộ hàm
        try {
            const res = await axios.post(`${API_URL}/login`, { username, password })
            const { token, user: userData } = res.data
            setUser(userData)
            localStorage.setItem("user", JSON.stringify(userData))
            localStorage.setItem("token", token)
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
            return { success: true }
        } catch (err) {
            return { success: false, message: err.response?.data?.message || "Lỗi" }
        }
    }

    // Hàm đăng ký
    const signup = async (formData) => { // sửa toàn bộ hàm
        try {
            const res = await axios.post(`${API_URL}/register`, formData)
            return { success: true, message: res.data.message }
        } catch (err) {
            return { success: false, message: err.response?.data?.message || "Lỗi" }
        }
    }

    //Hàm đăng xuất
    const logout = () => { // sửa
        setUser(null)
        localStorage.removeItem("user")
        localStorage.removeItem("token") // thêm
        delete axios.defaults.headers.common['Authorization'] // thêm
    }

    const value = { user, loading, login, signup, logout };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}