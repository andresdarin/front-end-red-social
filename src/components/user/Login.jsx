import React from 'react'
import { useForm } from '../../hooks/useForm'

export const Login = () => {

    const { form, changed } = useForm({})
    const loginUser = async (e) => {
        e.preventDefault();

        //Datos del formulario
        let userToLogin = form;

        //Peticion al backend 

        //Persistir los datos en el navegador

    }

    return (
        <>
            <header className="content__header content__header--public">
                <h1 className="content__title">Login</h1>
            </header>

            <div className="content__posts">
                <form className='form-login' onSubmit={loginUser}>
                    <div className="form-group">
                        <label htmlFor='email'>Email</label>
                        <input type='email' name='email' onChange={changed} />
                    </div>
                    <div className="form-group">
                        <label htmlFor='password'>Constraseña</label>
                        <input type='password' name='password' onChange={changed} />
                    </div>
                    <input type="submit" value='Identificate' className='btn btn-success' />
                </form>

            </div>
        </>
    )
}
