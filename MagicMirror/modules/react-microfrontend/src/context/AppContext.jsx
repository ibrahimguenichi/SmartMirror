import { useState, useEffect, createContext } from "react";
import { AppConstants } from "../util/constants";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
    axios.defaults.withCredentials = true;

    const backendURL = AppConstants.BACKEND_URL;
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userData, setUserData] = useState(null)

    const getUserData = async () => {
        try {
            const response = await axios.get(`${backendURL}/auth/me`);
            if(response.status === 200) {
                setUserData(response.data);
            } else {
                toast.error("Unable to retrieve the user");
            }
        } catch(err) {
            console.error("getting user failed: ", err.message);
        }
    }

    const contextValue = {
        backendURL,
        isLoggedIn, setIsLoggedIn,
        userData, setUserData,
        getUserData,
    }

    // Listen for face login success event
    useEffect(() => {
        const handleLoginSuccess = (event) => {
            console.log("🎉 Login success event received:", event.detail);
            setUserData(event.detail);
            setIsLoggedIn(true);
        };

        // Don't automatically set login state from window.userData
        // This allows the home page to show login/signup buttons by default
        // Only set login state when the userLoginSuccess event is fired

        // Listen for login success events
        window.addEventListener('userLoginSuccess', handleLoginSuccess);

        return () => {
            window.removeEventListener('userLoginSuccess', handleLoginSuccess);
        };
    }, []);

    useEffect(() => {
        // On mount, check if user is already logged in (cookie/session)
        const checkSession = async () => {
            try {
                const response = await axios.get(`${backendURL}/auth/me`);
                if (response.status === 200 && response.data) {
                    setUserData(response.data);
                    setIsLoggedIn(true);
                }
            } catch (err) {
                setIsLoggedIn(false);
                setUserData(null);
                console.error(err.message);
            }
        };
        checkSession();
    }, [backendURL]);

    return (
        <AppContext.Provider value={contextValue}>
            {props.children}
        </AppContext.Provider>
    )
}