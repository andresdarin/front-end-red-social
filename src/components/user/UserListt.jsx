
import React, { useEffect, useState } from 'react';
import avatar from '../../assets/img/user.png';
import { Global } from '../../helpers/Global';
import useAuth from '../../hooks/useAuth';

export const UserListt = ({ users, getUsers, following, setFollowing, page, setPage, more, loading }) => {
    const { auth } = useAuth();
    const token = localStorage.getItem('token');



    const nextPage = () => {
        setPage(prevPage => prevPage + 1); // Incrementa la página
    }

    const follow = async (userId) => {
        //Peticion al backend para guardar el follow
        const request = await fetch(Global.url + 'follow/save', {
            method: 'POST',
            body: JSON.stringify({ followed: userId }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        })

        const data = await request.json();

        //Cuando esté todo correcto
        if (data.status == 'success') {
            //Actualizar estado del following agregando el nuevo follow
            setFollowing([...following, userId])
        }


    }

    const unfollow = async (userId) => {
        //Peticion al backend para borrar el follow
        const request = await fetch(Global.url + 'follow/unfollow/' + userId, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        })

        const data = await request.json();

        //Cuando esté todo correcto
        if (data.status == 'success') {
            //Actualizar estado del following filtrando los datos para eliminar el antiguo user id que acabo de dejar de seguir
            let filterFollowings = following.filter(followingUserId => userId !== followingUserId)
            setFollowing(filterFollowings)
        }


    }
    return (
        <>
            <div className="content__posts">

                {users.map(user => (
                    <article className="posts__post" key={user._id}>
                        <div className="post__container">
                            <div className="post__image-user">
                                <a href="#" className="post__image-link">
                                    {user.image !== 'default.png' && <img src={Global.url + 'user/avatar/' + user.image} className="post__user-image" alt="Foto de perfil" />}
                                    {user.image === 'default.png' && <img src={avatar} className="post__user-image" alt="Foto de perfil" />}
                                </a>
                            </div>

                            <div className="post__body">
                                <div className="post__user-info">
                                    <a href="#" className="user-info__name">{user.name} {user.surname}</a>
                                    <span className="user-info__divider"> | </span>
                                    <a href="#" className="user-info__create-date">{user.created_at}</a>
                                </div>
                                <h4 className="post__content">{user.bio}</h4>
                            </div>
                        </div>

                        {!following.includes(user._id) &&
                            <button className="post__button post__button-green"
                                onClick={() => follow(user._id)}>
                                Seguir
                            </button>}
                        {following.includes(user._id) &&
                            <button className='post__button'
                                onClick={() => unfollow(user._id)}>
                                Dejar de Seguir
                            </button>}

                    </article>
                ))}
            </div>
            {more &&
                <div className="content__container-btn">
                    <button className="content__btn-more-post" onClick={nextPage} disabled={loading}>
                        {loading ? 'Cargando...' : 'Ver más personas'}
                    </button>
                </div>
            }
        </>
    )
}
