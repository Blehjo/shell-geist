import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext({
    setAuth: () => null,
    auth: null,
});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(null);
    const value = { auth, setAuth };

    useEffect(() => {
        const information = async () => {
            await axios({
                mode: 'no-cors',
                method: 'get',
                url: '/api/users/',
                headers: {
                  'Content-Type': 'application/json',
                },
                withCredentials: true
            })
            .then((response) => setAuth(response.data[0]))
        };
        // console.log('data: ', information.data);

        return information;
    }, []);


    return <AuthContext.Provider value={value} >{children}</AuthContext.Provider>
};