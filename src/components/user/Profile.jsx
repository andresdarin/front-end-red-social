import React, { useEffect, useState } from 'react';
import avatar from '../../assets/img/user.png';
import { GetProfile } from '../../helpers/GetProfile';
import { Link, useParams } from 'react-router-dom';
import { Global } from '../../helpers/Global';
import useAuth from '../../hooks/useAuth';

export const Profile = () => {
    const [user, setUser] = useState({});
    const { auth, counters, setCounters } = useAuth();
    const [iFollow, setIFollow] = useState(false);
    const [publication, setPublication] = useState([]);
    const [page, setPage] = useState(1);
    const [more, setMore] = useState(true);
    const params = useParams();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchData = async () => {
            await getCounters();
            await getDataUser();
            await getPublication(1, true);
        };
        fetchData();
    }, [params.userId]);

    const getDataUser = async () => {
        try {
            let dataUser = await GetProfile(params.userId, setUser);

            if (Array.isArray(dataUser.followInfo)) {
                const isFollowing = dataUser.followInfo.includes(String(auth._id));
                setIFollow(isFollowing);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const getCounters = async () => {
        const request = await fetch(`${Global.url}user/counters/${params.userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });
        const data = await request.json();

        if (data.following !== undefined) {
            setCounters(data);
        }
    };

    const follow = async (userId) => {
        const request = await fetch(`${Global.url}follow/save`, {
            method: 'POST',
            body: JSON.stringify({ followed: userId }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });

        const data = await request.json();

        if (data.status === 'success') {
            setIFollow(true);
            setCounters((prev) => ({
                ...prev,
                followed: prev.followed + 1,
            }));
        }
    };

    const unfollow = async (userId) => {
        const request = await fetch(`${Global.url}follow/unfollow/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });

        const data = await request.json();

        if (data.status === 'success') {
            setIFollow(false);
            setCounters((prev) => ({
                ...prev,
                followed: prev.followed - 1,
            }));
        } else {
            console.error('Unfollow failed:', data);
        }
    };

    const getPublication = async (nextPage = 1, newProfile = false) => {
        const request = await fetch(`${Global.url}publication/user/${params.userId}/${nextPage}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });

        const data = await request.json();

        if (data.status === 'success') {
            let newPublications = data.publications;

            if (!newProfile && publication.length >= 1) {
                newPublications = [...publication, ...data.publications];
            }

            setPublication(newPublications);

            if (data.publications.length < 5) {
                setMore(false);
            }
        } else {
            setMore(false);
        }
    };

    const nextPage = () => {
        let next = page + 1;
        setPage(next);
        getPublication(next);
    };

    return (
        <section className="layout__content">
            <header className="aside__profile-info">
                <div className="profile-info__general-info">
                    <div className="general-info__container-avatar">
                        {user.image && user.image !== 'default.png' ? (
                            <img src={`${Global.url}user/avatar/${user.image}`} className="container-avatar__img" alt="Foto de perfil" />
                        ) : (
                            <img src={avatar} className="container-avatar__img" alt="Foto de perfil" />
                        )}
                    </div>

                    <div className="general-info__container-names">
                        <div className="container-names__header">
                            <h1>{user.name} {user.surname}</h1>

                            {user._id !== auth._id && (
                                iFollow ?
                                    <button className="content__button content__button-right post__button" onClick={() => unfollow(user._id)}>Dejar de Seguir</button>
                                    :
                                    <button className="content__button content__button-right" onClick={() => follow(user._id)}>Seguir</button>
                            )}
                        </div>
                        <h2 className="container-names__nickname">{user.nick}</h2>
                        <p>Biografía</p>
                    </div>
                </div>

                <div className="profile-info__stats">
                    <div className="stats__following">
                        <Link to={`/social/siguiendo/${user._id}`} className="following__link">
                            <span className="following__title">Siguiendo</span>
                            <span className="following__number">{counters.following >= 1 ? counters.following : 0}</span>
                        </Link>
                    </div>
                    <div className="stats__following">
                        <Link to={`/social/seguidores/${user._id}`} className="following__link">
                            <span className="following__title">Seguidores</span>
                            <span className="following__number">{counters.followed >= 1 ? counters.followed : 0}</span>
                        </Link>
                    </div>

                    <div className="stats__following">
                        <Link to={`/social/perfil/${user._id}`} className="following__link">
                            <span className="following__title">Publicaciones</span>
                            <span className="following__number">{counters.publications >= 1 ? counters.publications : 0}</span>
                        </Link>
                    </div>
                </div>
            </header>

            <div className="content__posts">
                {publication.length > 0 ? (
                    publication.map((pub, index) => (
                        <article className="posts__post" key={index}>
                            <div className="post__container">
                                <div className="post__image-user">
                                    <Link to={`/social/perfil/${pub.user._id}`} className="post__image-link">
                                        <img src={pub.user.image && pub.user.image !== 'default.png' ? `${Global.url}user/avatar/${pub.user.image}` : avatar} className="post__user-image" alt="Foto de perfil" />
                                    </Link>
                                </div>

                                <div className="post__body">
                                    <div className="post__user-info">
                                        <a href="#" className="user-info__name">{pub.user.name} {pub.user.surname}</a>
                                        <span className="user-info__divider"> | </span>
                                        <a href="#" className="user-info__create-date">{pub.created_at}</a>
                                    </div>
                                    <h4 className="post__content">{pub.text}</h4>
                                </div>
                            </div>

                            {auth._id === pub.user._id &&
                                <div className="post__buttons">
                                    <a href="#" className="post__button">Eliminar</a>
                                </div>
                            }
                        </article>
                    ))
                ) : (
                    <p>No hay publicaciones para mostrar.</p>
                )}

                {more && (
                    <div className="content__container-btn">
                        <button className="content__btn-more-post" onClick={nextPage}>Ver más publicaciones</button>
                    </div>
                )}
            </div>
        </section>
    );
};
