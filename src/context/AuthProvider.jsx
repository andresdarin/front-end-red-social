import React, { createContext, useEffect, useState } from 'react';
import { Global } from '../helpers/Global';


export const AuthContext = createContext();

const AuthProvider = ({ children }) => {

    const [auth, setAuth] = useState({});
    const [counters, setCounters] = useState({});

    useEffect(() => {
        authUser();
    }, []);

    const authUser = async () => {
        //sacar datos usuario identificado del localstorage
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");

        //comprobar si tengo el token y el user
        if (!token || !user) {
            return false;
        }

        //transformar los datos a un objeto de javascript
        const userObj = JSON.parse(user);
        const userId = userObj._id;


        //peticion ajax al backend que compruebe el token y que me devuelva todos los datos del usuario
        const request = await fetch(Global.url + "user/profile/" + userId, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        });

        const data = await request.json();

        //Peticion para los contadores
        const requestCounters = await fetch(Global.url + "user/counters/" + userId, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        });

        const dataCounters = await requestCounters.json();

        //setear el estado de auth
        setAuth(data.user);
        setCounters(dataCounters)

    }


    return (<AuthContext.Provider
        value={{
            auth,
            setAuth,
            counters
        }}
    >
        {children}
    </AuthContext.Provider>

    );
};

export default AuthProvider