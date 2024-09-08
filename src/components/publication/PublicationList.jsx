import React from 'react';
import avatar from '../../assets/img/user.png';
import { Link } from 'react-router-dom';
import { Global } from '../../helpers/Global';
import useAuth from '../../hooks/useAuth';
import ReactTimeAgo from 'react-time-ago';

export const PublicationList = ({ publications, setPublications, getPublications, page, setPage, more, setMore }) => { // Añadido getPublications aquí
    const { auth } = useAuth();
    const token = localStorage.getItem('token');

    const nextPage = () => {
        let next = page + 1;
        setPage(next);
        getPublications(next); // Usar getPublications pasada como prop
    };

    const deletePublication = async (publicationId) => {
        const request = await fetch(`${Global.url}publication/remove/${publicationId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });

        const data = await request.json();

        if (data.status === 'success') {
            // Eliminar publicación de la lista
            setPublications(prevPublications =>
                prevPublications.filter(publication => publication._id !== publicationId)
            );
        } else {
            console.error("Error al eliminar la publicación:", data);
        }
    };

    return (
        <>
            <div className="content__posts">
                {publications.length > 0 ? (
                    publications.map((pub, index) => (
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
                                        <a href="#" className="user-info__create-date"><ReactTimeAgo date={pub.created_at} locale='es-ES' /></a>
                                    </div>
                                    <h4 className="post__content">{pub.text}</h4>

                                    {pub.file && <img src={`${Global.url}publication/media/${pub.file}`} alt="Publicación" />}
                                </div>
                            </div>

                            {auth._id === pub.user._id &&
                                <div className="post__buttons">
                                    <button onClick={() => deletePublication(pub._id)} className="post__button">
                                        <i className='fa-solid fa-trash-can'></i>
                                    </button>
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
        </>
    );
};
