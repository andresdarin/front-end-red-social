import React, { useEffect, useState } from 'react';
import { Global } from '../../helpers/Global';
import useAuth from '../../hooks/useAuth';
import { PublicationList } from '../publication/PublicationList';

export const Feed = () => {
    const { auth } = useAuth();

    const [publications, setPublications] = useState([]);
    const [page, setPage] = useState(1);
    const [more, setMore] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchData = async () => {
            setMore(true);
            await getPublication(1, flase);
        };
        fetchData();
    }, []);

    const getPublication = async (nextPage = 1, showNews = false) => {

        if (showNews) {
            setPublications([])
            setPage(1)
            nextPage = 1;
        }


        const request = await fetch(`${Global.url}publication/feed/${nextPage}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });

        const data = await request.json();

        if (data.status === 'success') {
            let newPublications = data.publications;

            if (!showNews && publications.length >= 1) {
                newPublications = [...publications, ...data.publications];
            }

            setPublications(newPublications);

            if (!showNews && data.publications.length < 5) {
                setMore(false);
            }

            if (data.pages <= 1) {
                setMore(false);
            }
        } else {
            setMore(false);
        }
    };

    return (
        <section className="layout__content">

            <header className="content__header">
                <h1 className="content__title">Gente</h1>
                <button className="content__button" onClick={() => getPublication(1, true)}>Mostrar nuevas</button>
            </header>

            <PublicationList
                publications={publications}
                setPublications={setPublications}
                getPublications={getPublication}
                page={page}
                setPage={setPage}
                more={more}
                setMore={setMore}
            />

        </section>
    );
};
