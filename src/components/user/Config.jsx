import React, { useState } from 'react'
import useAuth from '../../hooks/useAuth'
import { Global } from '../../helpers/Global'
import { SerializeForm } from '../../helpers/SerializeForm'

export const Config = () => {

    const { auth } = useAuth()
    const [saved, setSaved] = useState('not_saved')

    const updateUser = (e) => {
        e.preventDefault();

        //recoger datos del formulario
        let newDataUser = SerializeForm(e.target)

        //borrar propiedad innecesaria
        delete newDataUser.file0

        //Actualizar usuario en la base de datos

    }


    return (
        <>
            <header className="content__header content__header--public">
                <h1 className="content__title">Ajustes</h1>
            </header>

            <div className="content__posts">

                {saved == 'saved' ? <strong className='alert alert-success'>Ususario registado Correctamente </strong> : ''}
                {saved == 'error' ? <strong className='alert alert-danger'>Ususario no registado </strong> : ''}

                <form className='config-form' onSubmit={updateUser}>

                    <div className="form-group">
                        <label htmlFor="name">Nombre</label>
                        <input type="text" name='name' defaultValue={auth.name} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="surname">Apellido</label>
                        <input type="text" name='surname' defaultValue={auth.nick} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="nick">Nick</label>
                        <input type="text" name='nick' defaultValue={auth.surname} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="bio">Bio</label>
                        <textarea name='bio' defaultValue={auth.bio} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">eMail</label>
                        <input type="email" name='email' defaultValue={auth.email} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input type="password" name='password' />
                    </div>
                    <div className="form-group">
                        <label htmlFor="image">Avatar</label>
                        <div className="general-info__container-avatar">
                            {auth.image != 'default.png' && <img src={Global.url + 'user/avatar/' + auth.image} className="container-avatar__img" alt="Foto de perfil" />}
                            {auth.image == 'default.png' && <img src={avatar} className="container-avatar__img" alt="Foto de perfil" />}

                        </div>
                        <br />
                        <input type="file" name='image' id='file' />
                    </div>
                    <br />
                    <input type='submit' value='Confirmar Cambios' className='btn btn-success'></input>

                </form>

            </div>


        </>
    )
}
