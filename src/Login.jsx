import React, {useEffect, useState} from "react";
import jwtDecode from "jwt-decode";
import axios from "axios";
import {useNavigate} from "react-router-dom";

function Login() {
    const [user, setUser] = useState({})
    const [verification, setVerification] = useState(false);
    const navigate = useNavigate();
    const HOST = "https://api.letuscode.click:8083"

    useEffect(() => {
        checkUserState();
    }, [])

    function renderGoogleButton() {
        /*global google*/
        google.accounts.id.initialize({
            client_id: "274960400690-vq9fiqlvoemtqukheceign0fp0r7anrn.apps.googleusercontent.com",
            callback: handleCredential,
        })
        google.accounts.id.renderButton(document.getElementById("login"), {
            theme: "outline",
            size: "large",
        })

    }

    async function checkUserState() {
        axios.defaults.withCredentials = true;
        await axios.get(`${HOST}/verification`).then((res) => {
            if (res.status === 204) {// If user has not yet logged in.
                renderGoogleButton();
            } else if (res.status === 200) { // If user already signed-in and server-side user verification succeeded
                setVerification(true);
                const sessionUserObj = getSessionUserObj();
                setUser(sessionUserObj);
            }
        }).catch(error => {
            if (error.response.status === 400) {
                setVerification(false);
                setUser({})
                renderGoogleButton();
            } else if(error.response.status !== 400) {
                console.log(error.message)
            }else {
                alert("Something went wrong")
            }
        })
    }

    function getSessionUserObj() {
        // TODO Decode RSA-encrypted jwt user credential
        const jwtUserCredential = window.sessionStorage.getItem("user");
        return jwtDecode(jwtUserCredential);
    }

    async function handleCredential(response) {
        const userCredential = jwtDecode(response.credential);
        await axios.post(`${HOST}/login?token=${response.credential}`)
            .then((res, err) => {
                if (res.status === 200) {
                    setUser(userCredential);
                    // TODO Encrypt jwt with RSA encryption before storing it into session storage.
                    window.sessionStorage.setItem("user", JSON.stringify(response.credential))
                    setVerification(true);
                    setUser(userCredential);
                } else {
                    // TODO Redirect to error page.
                }
            })
    }

    function getCookie(name) {
        return document.cookie.split(';').some(c => {
            return c.trim().startsWith(name + '=');
        });
    }

    function deleteCookie(name, path, domain) {
        if (getCookie(name)) {
            document.cookie = name + "=" +
                ((path) ? ";path=" + path : "") +
                ((domain) ? ";domain=" + domain : "") +
                ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
        }
    }

    const handleSignOut = () => {
        //TODO server-side logout sequence is needed to be implemented
        deleteCookie("user_authed", "/", "localhost")
        window.sessionStorage.clear();
        setVerification(false)
        setUser({});
        window.location.reload();
    }

    function navigateToConsole() {
        navigate("/console", {replace: false})
    }

    return (
        <div className="login-page">
            {verification && Object.keys(user).length !== 0 ?
                <LoggedIn name={user.name} signOutCallback={handleSignOut}/> :
                <div id="login"></div>
            }
            <div onClick={navigateToConsole}>To Console</div>
        </div>
    )
}

function LoggedIn(props) {
    return (<div id="logged-in-page">
            <button onClick={props.signOutCallback}>Sign out</button>
            <h2>Hello {props.name}</h2>
        </div>

    )
}


export default Login;