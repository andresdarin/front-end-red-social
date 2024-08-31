import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import useAuth from '../../../hooks/useAuth'

export const PrivateLayout = () => {

    const { auth, loading } = useAuth();

    if (loading) {
        return <h1>Cargando...</h1>
    }

    if (!auth || !auth._id) {
        return <Navigate to='/login' />
    }

    return (
        <>
            {/* Layout */}
            {/* Cabecera de Navegacion */}
            <Header />

            {/* Contenido Principal */}
            <div className='layout__content'>
                <Outlet />
            </div>

            {/* Barra Lateral */}
            <Sidebar />
        </>
    )
}
