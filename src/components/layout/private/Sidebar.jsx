import React, { useState } from 'react'
import avatar from '../../../assets/img/user.png'
import useAuth from '../../../hooks/useAuth'
import { Global } from '../../../helpers/Global';
import { Link } from 'react-router-dom';
import { useForm } from '../../../hooks/useForm';

export const Sidebar = () => {

    const { auth, counters, setCounters } = useAuth();
    const { form, changed } = useForm({});
    const [stored, setStored] = useState('not_stored')

    const token = localStorage.getItem('token');


    const savePublication = async (e) => {
        e.preventDefault()

        //recoger datos del formulario
        let newPublication = form
        newPublication.user = auth._id

        //hacer request para guardar en la bd
        const request = await fetch(Global.url + 'publication/save', {
            method: 'POST',
            body: JSON.stringify(newPublication),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }
        })

        const data = await request.json();


        //mostar mensaje de exito o error
        if (data.status = 'success') {
            setStored('stored')
            console.log(newPublication)

            const countRequest = await fetch(Global.url + 'publication/user/' + auth._id, {
                method: 'GET',
                headers: {
                    'Authorization': token
                }
            }

            );
            const countData = await countRequest.json();
            if (countData.status === 'success') {
                setCounters(prevCounters => ({
                    ...prevCounters,
                    publications: countData.total
                }));
            }
        } else {
            setStored('error')
        }

        //subir imagen

    }



    return (
        <aside className="layout__aside">

            <header className="aside__header">
                <h1 className="aside__title">Hola, {auth.name}</h1>
            </header>

            <div className="aside__container">

                <div className="aside__profile-info">

                    <div className="profile-info__general-info">
                        <div className="general-info__container-avatar">
                            {auth.image != 'default.png' && <img src={Global.url + 'user/avatar/' + auth.image} className="container-avatar__img" alt="Foto de perfil" />}
                            {auth.image == 'default.png' && <img src={avatar} className="container-avatar__img" alt="Foto de perfil" />}

                        </div>

                        <div className="general-info__container-names">
                            <a href="#" className="container-names__name">{auth.name} {auth.surname}</a>
                            <p className="container-names__nickname">{auth.nick}</p>
                        </div>
                    </div>

                    <div className="profile-info__stats">

                        <div className="stats__following">
                            <Link to={'siguiendo/' + auth._id} className="following__link">
                                <span className="following__title">Siguiendo</span>
                                <span className="following__number">{counters.following}</span>
                            </Link>
                        </div>
                        <div className="stats__following">
                            <Link to={'seguidores/' + auth._id} className="following__link">
                                <span className="following__title">Seguidores</span>
                                <span className="following__number">{counters.followed}</span>
                            </Link>
                        </div>


                        <div className="stats__following">
                            <a href="#" className="following__link">
                                <span className="following__title">Publicaciones</span>
                                <span className="following__number">{counters.publications}</span>
                            </a>
                        </div>


                    </div>
                </div>


                <div className="aside__container-form">
                    {stored == 'stored' ? <strong className='alert alert-success'>Publicada correctamente </strong> : ''}
                    {stored == 'error' ? <strong className='alert alert-danger'>No se ha publicado nada </strong> : ''}

                    <form className="container-form__form-post" onSubmit={savePublication}>

                        <div className="form-post__inputs">
                            <label htmlFor="text" className="form-post__label">¿Que estas pesando hoy?</label>
                            <textarea name="text" className="form-post__textarea" onChange={changed} />
                        </div>

                        <div className="form-post__inputs">
                            <label htmlFor="image" className="form-post__label">Sube tu foto</label>
                            <input type="file" name="image" id='image' className="form-post__image" />
                        </div>

                        <input type="submit" value="Enviar" className="form-post__btn-submit" />

                    </form>

                </div>

            </div>

        </aside>
    )
}
