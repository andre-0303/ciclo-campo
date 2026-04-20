import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useUserStore } from "../store/useUserStore";

export function PrivateRoute({ children }: { children: JSX.Element }) {
    const { loading } = useContext(AuthContext)
    const userId = useUserStore((state) => state.userId)

    if(loading) return <div>Carregando...</div>

    if(!userId) return <Navigate to="/login" replace/>

    return children
}