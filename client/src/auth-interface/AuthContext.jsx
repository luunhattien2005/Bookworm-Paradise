import { createContext, useState, useEffect } from "react"

export const  AuthContext = createContext()

export function AuthProvider({children}) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // Load từ localStorage khi mở website
    useEffect(() => {
        const savedUser = localStorage.getItem("user")
        if (savedUser) {
            setUser(JSON.parse(savedUser))
        }

        setLoading(false) //Load xong user
    }, [])

    // Hàm đăng nhập
    const login = async (username, password) => {
        // gọi API login
        // const res = await fetch(…)
        const fakeUser = { username }; // ví dụ thôi

        setUser(fakeUser);
        localStorage.setItem("user", JSON.stringify(fakeUser));
        console.log(`Inject fake user ${JSON.stringify(fakeUser)}`)
    };

    // Hàm đăng ký
    const signup = async (username, email, password) => {
        const fakeUser = { username }; // ví dụ thôi

        setUser(fakeUser);
        localStorage.setItem("user", JSON.stringify(fakeUser));
        console.log(`Inject fake user ${JSON.stringify(fakeUser)}`)
    }

    // Hàm đăng xuất
    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    const value = { user, loading, login, signup, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}