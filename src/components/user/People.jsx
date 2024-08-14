import React, { useEffect, useState } from 'react';
import { Global } from '../../helpers/Global';
import { UserListt } from './UserListt';

export const People = () => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [more, setMore] = useState(true)
    const [following, setFollowing] = useState([])
    const [loading, setLoading] = useState(false); // Estado para manejar carga

    const token = localStorage.getItem('token');

    useEffect(() => {
        getUsers();
    }, [page]); // Ejecuta `getUsers` cada vez que `page` cambie

    const getUsers = async () => {
        if (loading) return; // Evita solicitudes duplicadas

        setLoading(true);

        try {
            const request = await fetch(Global.url + 'user/list/' + page, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            });

            const data = await request.json();

            //if de clase optimizado
            if (data.users && data.status === 'success') {
                let newUsers = [...users, ...data.users]; // Agrega nuevos usuarios a la lista existente
                setUsers(newUsers);
                setFollowing(data.user_following)
            }

            if (users.length >= (data.total - data.users.length)) {
                setMore(false)
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
                <h1 className="content__title">Gente</h1>
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
            /*props sacadas del api*/

            />


        </section>
    )
}
