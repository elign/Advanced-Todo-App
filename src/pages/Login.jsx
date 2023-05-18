import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth, loginInWithEmailAndPassword, signInWithGoogle } from "../firebase/firebaseConfig.js";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Login() {

    const navigate = useNavigate()
    const [details, setUser] = useState({
        email: "",
        password: ""
    })
    const [user, loading, error] = useAuthState(auth);

    useEffect(() => {
        if(user) navigate("/profile")
    }, [details, loading, user])


    function handleChange(event) {
        const {name, value} = event.target
        setUser(prevFormData => {
            return {
                ...prevFormData,
                [name]: value
            }
        })
    }

    const loginWithGoogleUser = (e) => {
        e.preventDefault();
        signInWithGoogle();
    }

    const signInWithEmailAndPasswordUpdated = (e) => {

        e.preventDefault();
        loginInWithEmailAndPassword(details.email, details.password)
        
    }

    return (
        <div className='page-center'>
            <h1>Login</h1>
            <form className="input-signup" onSubmit={signInWithEmailAndPasswordUpdated}>
                
                <input
                    className="input-field"
                    type="email"
                    placeholder="Email"
                    onChange={handleChange}
                    name="email"
                    value={details.email}
                />
                <input
                    className="input-field"
                    type="password"
                    placeholder="Password"
                    onChange={handleChange}
                    name="password"
                    value={details.password}
                />
                <button className='login-signup'>Login</button>
            </form>
            <div>
                <button onClick={loginWithGoogleUser} className='login-with-google'>Login With Google</button>
            </div>
            
            <div>
                Don't have an account? <Link to="/signup">Sign Up</Link> Now.
            </div>
        </div>
    )
}
