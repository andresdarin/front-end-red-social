import React, { useState } from 'react'
import { useForm } from '../../hooks/useForm'
import { Global } from '../../helpers/Global'

export const Register = () => {

    const { form, changed } = useForm({})
    const [saved, setSaved] = useState('not_sended')
    const saveUser = async (e) => {
        //prevenir actualizacin de pantalla
        e.preventDefault();

        //recoger datos del formulario
        let newUser = form;

        //guardar usuario en el backend
        const request = await fetch(Global.url + 'user/register', {
            method: 'POST',
            body: JSON.stringify(newUser),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await request.json();

        if (data.status == 'success') {
            setSaved('saved');
        } else {
            setSaved('error')
        }
    }

    return (
        <>
            <header className="content__header content__header--public">
                <h1 className="content__title">Registro</h1>
            </header>

            <div className="content__posts">

                {saved == 'saved' ? <strong className='alert alert-success'>Ususario registado Correctamente </strong> : ''}
                {saved == 'error' ? <strong className='alert alert-danger'>Ususario no registado </strong> : ''}

                <form className='register-form' onSubmit={saveUser}>

                    <div className="form-group">
                        <label htmlFor="name">Nombre</label>
                        <input type="text" name='name' onChange={changed} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="surname">Apellido</label>
                        <input type="text" name='surname' onChange={changed} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="nick">Nick</label>
                        <input type="text" name='nick' onChange={changed} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">eMail</label>
                        <input type="email" name='email' onChange={changed} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input type="password" name='password' onChange={changed} />
                    </div>
                    <input type='submit' value='Registrate' className='btn btn-success'></input>

                </form>

            </div>
        </>
    )
}
