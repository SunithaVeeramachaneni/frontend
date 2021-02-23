import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { userActions } from '../../_actions';

import { Trans, useTranslation } from "react-i18next";

import {
    ApolloClient,
    gql, InMemoryCache
} from '@apollo/client';

const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: 'http://localhost:4000/graphql',
    fetchOptions: {
        mode: 'no-cors',
    }
});



function Home() {
    /*const users = useSelector(state => state.users);
    const user = useSelector(state => state.authentication.user);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(userActions.getAll());
    }, []);

    function handleDeleteUser(id) {
        dispatch(userActions.delete(id));
    } */

    const [recipies, setrecipies] = useState([]);
    client
    .query({
        query: gql`
            query GetRecipe1 {
                recipes {
                    title
                    description
                    ratings
                    creationDate
                }
            }
        `
    })
    .then(result => {
        console.log(result);

        let recipiesArr = Object.values(result.data);
        setrecipies(recipiesArr[0]);

    }, err => {
        console.log(err)
    });

    const { t, i18n } = useTranslation();
    const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    };
    let handleChange =(event)=>{
        changeLanguage(event.target.value);
    }

    return (
<>
        <div className="App">
            <div>
                {recipies.map((rate, index) => (
                    <div key={index.toString()}>
                        <span>{rate.title}</span> - <span>{rate.creationDate}</span>
                    </div>
                ))}
            </div>
        </div>


        <div className="col-lg-8 offset-lg-2">
            <select onChange={handleChange}>
                <option selected value="en">English</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="es">Spanish</option>
            </select>
            <hr/>
            <Trans i18nKey="title">
                        Hi John!
            </Trans>
            <div>{t("description")}</div>
            <div>{t("users")}</div>

        </div>
    </>
    );
}

export { Home };
