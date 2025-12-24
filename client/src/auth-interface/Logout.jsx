import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { useQueryClient } from '@tanstack/react-query';

export default function Logout() {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    useEffect(() => {
        logout();
        queryClient.removeQueries({ queryKey: ['cart'] });
        navigate("/home", { replace: true });
    }, []);

    return null;
}
