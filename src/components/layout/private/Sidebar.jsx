import React, { useState, useEffect } from 'react';
import avatar from '../../../assets/img/user.png';
import useAuth from '../../../hooks/useAuth';
import { Global } from '../../../helpers/Global';
import { Link } from 'react-router-dom';
import { useForm } from '../../../hooks/useForm';

export const Sidebar = () => {
    const { auth, counters, setCounters } = useAuth();
    const { form, changed } = useForm({});
    const [stored, setStored] = useState('not_stored');
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchUserPublications = async () => {
            const countRequest = await fetch(Global.url + 'publication/user/' + auth._id, {
                method: 'GET',
                headers: {
                    'Authorization': token
                }
            });
            const countData = await countRequest.json();
            if (countData.status === 'success') {
                setCounters(prevCounters => ({
                    ...prevCounters,
                    publications: countData.total
                }));
            }
        };

        fetchUserPublications();
    }, [auth._id, setCounters, token]);

    const savePublication = async (e) => {
        e.preventDefault();

        let newPublication = form;
        newPublication.user = auth._id;

        const request = await fetch(Global.url + 'publication/save', {
            method: 'POST',
            body: JSON.stringify(newPublication),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });

        const data = await request.json();

        if (data.status === 'success') {
            setStored('stored');

            const countRequest = await fetch(Global.url + 'publication/user/' + auth._id, {
                method: 'GET',
                headers: {
                    'Authorization': token
                }
            });

            const countData = await countRequest.json();
            if (countData.status === 'success') {
                setCounters(prevCounters => ({
                    ...prevCounters,
                    publications: countData.total
                }));
            } else {
                console.error("Error al obtener el conteo de publicaciones:", countData.message);
            }

            const fileInput = document.querySelector('#file');
            if (fileInput.files[0]) {
                const formData = new FormData();
                formData.append('image', fileInput.files[0]);

                const uploadRequest = await fetch(Global.url + 'publication/upload/' + data.publicationStored._id, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Authorization': token
                    }
                });

                const uploadData = await uploadRequest.json();
                if (uploadData.status === 'success') {
                    setStored('stored');
                } else {
                    console.error("Error al subir la imagen:", uploadData.message);
                    setStored('error');
                }
            }

            if (data.status === 'success' && (!fileInput.files[0] || uploadData.status === 'success')) {
                const myForm = document.querySelector('#publication-form');
                if (myForm) {
                    myForm.reset();
                }
            }
        } else {
            console.error("Error al guardar la publicación:", data.message);
            setStored('error');
        }
    };



    return (
        <aside className="layout__aside">
            <header className="aside__header">
                <h1 className="aside__title">Hola, {auth.name}</h1>
            </header>

            <div className="aside__container">
                <div className="aside__profile-info">
                    <div className="profile-info__general-info">
                        <div className="general-info__container-avatar">
                            {auth.image !== 'default.png' ? (
                                <img src={Global.url + 'user/avatar/' + auth.image} className="container-avatar__img" alt="Foto de perfil" />
                            ) : (
                                <img src={avatar} className="container-avatar__img" alt="Foto de perfil" />
                            )}
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
                    {stored === 'stored' && <strong className="alert alert-success">Publicada correctamente</strong>}
                    {stored === 'error' && <strong className="alert alert-danger">No se ha publicado nada</strong>}

                    <form id='publication-form' className="container-form__form-post" onSubmit={savePublication}>
                        <div className="form-post__inputs">
                            <label htmlFor="text" className="form-post__label">¿Qué estás pensando hoy?</label>
                            <textarea name="text" className="form-post__textarea" onChange={changed} />
                        </div>
                        <div className="form-post__inputs">
                            <label htmlFor="file" className="form-post__label">Sube tu foto</label>
                            <input type="file" name="image" id="file" className="form-post__image" />
                        </div>
                        <input type="submit" value="Enviar" className="form-post__btn-submit" />
                    </form>
                </div>
            </div>
        </aside>
    );
};
