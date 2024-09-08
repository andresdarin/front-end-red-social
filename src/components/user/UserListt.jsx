import React from 'react';
import avatar from '../../assets/img/user.png';
import { Global } from '../../helpers/Global';
import useAuth from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import ReactTimeAgo from 'react-time-ago';

export const UserListt = ({ users, getUsers, following, setFollowing, page, setPage, more, loading }) => {
    const { auth } = useAuth();
    const token = localStorage.getItem('token');

    const follow = async (userId) => {
        const request = await fetch(Global.url + 'follow/save', {
            method: 'POST',
            body: JSON.stringify({ followed: userId }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });

        const data = await request.json();

        if (data.status === 'success') {
            setFollowing([...following, userId]);
        }
    };

    const unfollow = async (userId) => {
        const request = await fetch(Global.url + 'follow/unfollow/' + userId, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });

        const data = await request.json();

        if (data.status === 'success') {
            const filterFollowings = following.filter(followingUserId => userId !== followingUserId);
            setFollowing(filterFollowings);
        }
    };

    const nextPage = () => {
        setPage(prevPage => prevPage + 1);
    };



    const uniqueUsers = Array.from(new Set(users.filter(user => user).map(user => user._id)))
        .map(id => {
            return users.find(user => user && user._id === id);
        });




    return (
        <>
            <div className="content__posts">
                {uniqueUsers.map((user, index) => (
                    <article className="posts__post" key={`${user._id}-${index}`}>
                        <div className="post__container">
                            <div className="post__image-user">
                                <Link to={'/social/perfil/' + user._id} className="post__image-link">
                                    <img src={user.image ? (user.image !== 'default.png' ? Global.url + 'user/avatar/' + user.image : avatar) : avatar} className="post__user-image" alt="Foto de perfil" />
                                </Link>
                            </div>

                            <div className="post__body">
                                <div className="post__user-info">
                                    <Link to={'/social/perfil/' + user._id} className="user-info__name">{user.name} {user.surname}</Link>
                                    <span className="user-info__divider"> | </span>
                                    <Link to={'/social/perfil/' + user._id} className="user-info__create-date"><ReactTimeAgo date={user.created_at} locale='es-ES' /></Link>
                                </div>
                                <h4 className="post__content">{user.bio}</h4>
                            </div>
                        </div>
                        {user._id !== auth._id && (
                            <>
                                {!following.includes(user._id) ? (
                                    <button className="post__button post__button-green" onClick={() => follow(user._id)}>
                                        Seguir
                                    </button>
                                ) : (
                                    <button className='post__button' onClick={() => unfollow(user._id)}>
                                        Dejar de Seguir
                                    </button>
                                )}
                            </>
                        )}
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
    );
};
