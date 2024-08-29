import React, { useEffect, useState } from 'react';
import { Global } from '../../helpers/Global';
import { UserListt } from '../user/UserListt';
import { useParams } from 'react-router-dom';
import { GetProfile } from '../../helpers/GetProfile';

export const Following = () => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [more, setMore] = useState(true);
    const [following, setFollowing] = useState([]);
    const [loading, setLoading] = useState(false); // Estado para manejar carga
    const [userProfile, setUserProfile] = useState({});

    const params = useParams();
    const token = localStorage.getItem('token');

    useEffect(() => {
        getUsers();
        GetProfile(params.userId, setUserProfile);
    }, [page]); // Ejecuta `getUsers` cada vez que `page` cambie

    const getUsers = async () => {
        if (loading) return; // Evita solicitudes duplicadas

        setLoading(true);

        const userId = params.userId;

        try {
            const request = await fetch(Global.url + 'follow/following/' + userId + '/' + page, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            });

            if (!request.ok) {
                throw new Error(`HTTP error! status: ${request.status}`);
            }

            const data = await request.json();


            let cleanUsers = []
            //recorrer y limpiar follows para quedarme con followed
            if (Array.isArray(data.follow)) {
                cleanUsers = data.follow.map(follow => follow.followed);
            }

            data.users = cleanUsers

            console.log('Clean Users:', cleanUsers);

            if (data.users && data.status === 'success') {
                const newUsers = [...users, ...data.users]; // Agrega nuevos usuarios a la lista existente
                setUsers(newUsers);
                setFollowing(data.user_following);

                if (newUsers.length >= data.total) {
                    setMore(false);
                }

            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="layout__content">
            <header className="content__header">
                <h1 className="content__title">Usuarios que sigue {userProfile.name} {userProfile.surname}</h1>
            </header>

            <UserListt
                users={users}
                getUsers={getUsers}
                following={following}
                setFollowing={setFollowing}
                page={page}
                setPage={setPage}
                more={more}
                loading={loading}
            />
        </section>
    );
};
