//compartir una infromacion que tenemos de manera global, con el resto de los componentes
import React, { useState, useEffect, createContext } from 'react'

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [compartido, setCompartido] = useState('Compartido con todos los componentes')
    return (
        <AuthContext.Provider
            value={{ compartido }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;
