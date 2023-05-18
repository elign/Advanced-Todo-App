import React from 'react'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthState } from "react-firebase-hooks/auth";
import {
    auth,
    registerWithEmailAndPassword,
    signInWithGoogle,
  } from "../firebase/firebaseConfig"
// import {v4 as uuidv4} from 'uuid'

export default function SignUp() {

    const navigate = useNavigate()
    const [details, setUser] = useState({
        name: "",
        email: "",
        password: ""
    })
    const [user, loading, error] = useAuthState(auth);
    // const history = useHistory();

    const register = (e) => {
        e.preventDefault();
        if (!details.name) alert("Please enter name");
        registerWithEmailAndPassword(details.name, details.email, details.password)
    };

    useEffect(() => {
        if (user) {
            navigate("/profile");
        }
    }, [user]);

    function handleChange(event) {
        const {name, value} = event.target
        setUser(prevFormData => {
            return {
                ...prevFormData,
                [name]: value
            }
        })
    }
    


    return (
        <div className='page-center'>
            <h1>Sign Up</h1>
            <form className="input-signup" onSubmit={register}>
                <input
                    className="input-field"
                    type="text"
                    placeholder="Name"
                    onChange={handleChange}
                    name="name"
                    value={details.name}
                />
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
                <button className='login-signup'>Sign Up</button>
            </form>
            <div>
                <button onClick={signInWithGoogle} className='login-with-google'>Sign Up With Google</button>
            </div>
            <div>
                Already have an account? <Link to="/">Login</Link> now.
            </div>
        </div>
    )
}


