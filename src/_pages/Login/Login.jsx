import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { userActions } from '../../_actions';

import './Login.css';
import Event1 from "../../assets/img/event1.svg";
import Event2 from "../../assets/img/event2.svg";
import Logo from "../../assets/img/innovapptive-logo.svg";

function Login() {
    const [inputs, setInputs] = useState({
        username: '',
        password: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const { username, password } = inputs;
    const loggingIn = useSelector(state => state.authentication.loggingIn);
    const dispatch = useDispatch();
    const location = useLocation();

    // reset login status
    useEffect(() => {
        dispatch(userActions.logout());
    }, []);

    function handleChange(e) {
        const { name, value } = e.target;
        setInputs(inputs => ({ ...inputs, [name]: value }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        setSubmitted(true);
        if (username && password) {
            // get return url from location state or default to home page
            const { from } = location.state || { from: { pathname: "/" } };
            dispatch(userActions.login(username, password, from));
        }
    }

    return (
        <div className="row">
        <div className="col-lg-12 header-grid">
            <img src={Logo} alt="" className="inno-logo"/>
            <h2 className="login-heading">Connected Worker Platform</h2>
        </div>
        <div className="row" style={{"margin":"40px 30px 0px 30px","width":"97%"}}>
            <div className="col-lg-6 co-md-6">
                <div className="col-lg-12 col-md-12 left-grid-1">
                    <p className="readnow-content">5 Ways to Drive Front-line Worker Adoption of Mobile Solutions for SAP</p>
                    <button className="readnow-button">Read Now</button>
                </div>
                <div className="col-lg-12 col-md-12 left-grid-2">
                    <p className="upcoming-events">Upcoming Events</p>
                    <p style={{"display":"flex"}}><img src={Event1} alt="events"/><img src={Event2} alt="events"/></p>
                </div>
            </div>
            <div className="col-lg-6 co-md-6 right-grid">
                <h5 className="login-form-heading">Connect & Use</h5>
                <form name="form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input type="email" placeholder="Email ID"  label="email" name="username" value={username} onChange={handleChange} className={'form-control' + (submitted && !username ? ' is-invalid' : '')} />
                        {submitted && !username &&
                            <div className="invalid-feedback">Email ID is required</div>
                        }
                    </div>
                    <div className="form-group">
                        <input type="password" placeholder="Password" name="password" value={password} onChange={handleChange} className={'form-control' + (submitted && !password ? ' is-invalid' : '')} />
                        {submitted && !password &&
                            <div className="invalid-feedback">Password is required</div>
                        }
                    </div>
                    <div className="form-group">
                        <input type="checkbox" id="rememberme" name="rememberme" value="rememberme"/>
                        <label for="rememberme" className="rememberme">Remember Me</label>
                        <span className="forgetpassword">Forget Password?</span>
                    </div>
                    <div className="form-group">
                        <button className="btn btn-primary btn-lg btn-block login-btn">
                                {loggingIn && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                Login
                        </button>
                    </div>
                    <div className="form-group">
                        Did not have any account? <Link to="/register" className="btn btn-link">Register as new user</Link>
                    </div>
                </form>
            </div>
        </div>
        <div className="col-lg-12 footer">
            <a href="www.innovapptive.com"><span className="footer-text">All Rights Reserved. Innovapptive Inc.</span></a>
        </div>
        </div>
    );
}

export { Login };
