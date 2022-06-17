import { useState, useEffect, createContext, useContext} from "react";
import { auth } from "../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import Loading from "../components/Loading";
const Auth = createContext();
const AuthContext = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            setUser(user)
            setLoading(false)
        })
    }, []);

    if(loading) {
        return <Loading/>
    }

    return (
        <Auth.Provider value={{ user, loading}}>
            {children}
        </Auth.Provider>
    )
}

export default AuthContext;

export const UserAuth = () => {
    return useContext(Auth)
}