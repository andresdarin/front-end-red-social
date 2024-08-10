import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { Header } from './Header'
import useAuth from '../../../hooks/useAuth'

export const PublicLayout = () => {
    const { auth } = useAuth();

    return (
        <>
            {/*Layout*/}
            <Header />

            {/*contenido Principal*/}
            <section className='layout__content'>
                {!auth._id ?
                    <Outlet />
                    :
                    <Navigate to={'social'} />
                }

            </section>
        </>
    )
}
