import { createContext, useState, useEffect } from "react"

export const  AuthContext = createContext()

export function AuthProvider({children}) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const img_url = "https://dummyimage.com/50/000/fff"
    const [logoutToHome, setLogoutToHome] = useState(false)
    
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
        const fakeUser = { username, img_url }; // ví dụ thôi

        setUser(fakeUser);
        localStorage.setItem("user", JSON.stringify(fakeUser));
        console.log(`Inject fake user ${JSON.stringify(fakeUser)}`)
    };

    // Hàm đăng ký
    const signup = async (username, email, password) => {
        const fakeUser = { username, img_url }; // ví dụ thôi

        setUser(fakeUser);
        localStorage.setItem("user", JSON.stringify(fakeUser));
        console.log(`Inject fake user ${JSON.stringify(fakeUser)}`)
    }

    // Hàm đăng xuất
    const logout = (callback) => {
        setUser(null);
        setLogoutToHome(true);
        localStorage.removeItem("user");

        setTimeout(() => setLogoutToHome(false), 10);
    };

    const value = { user, loading, logoutToHome, login, signup, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}