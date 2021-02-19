import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { userActions } from '../../_actions';

import { Trans, useTranslation } from "react-i18next";

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


    const { t, i18n } = useTranslation();
    const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    };
    let handleChange =(event)=>{
        changeLanguage(event.target.value); 
    }

    return (

        /* <div className="col-lg-8 offset-lg-2">
            <h1>Hi {user.firstName}!</h1>
            <p>You're logged in to Connected Work Force Portal!!</p>
            <h3>All registered users:</h3>
            {users.loading && <em>Loading users...</em>}
            {users.error && <span className="text-danger">ERROR: {users.error}</span>}
            {users.items &&
                <ul>
                    {users.items.map((user, index) =>
                        <li key={user.id}>
                            {user.firstName + ' ' + user.lastName}
                            {
                                user.deleting ? <em> - Deleting...</em>
                                : user.deleteError ? <span className="text-danger"> - ERROR: {user.deleteError}</span>
                                : <span> - <a onClick={() => handleDeleteUser(user.id)} className="text-primary">Delete</a></span>
                            }
                        </li>
                    )}
                </ul>
            }
            <p>
                <Link to="/login">Logout</Link>
            </p>
        </div>*/



        <div className="col-lg-8 offset-lg-2">
            <select onChange={e =>  handleChange(e)} >
                <option value="en">English</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="es">Spanish</option>
            </select>
            <Trans i18nKey="title">
                        Hi John!
            </Trans>
            <div>{t("description")}</div>
            <div>{t("users")}</div>
     
        </div>
    );
}

export { Home };
