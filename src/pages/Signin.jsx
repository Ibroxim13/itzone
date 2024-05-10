import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { successMessagge } from '../Notifications/successNot';
import { errorMessage } from '../Notifications/errorNot';

export default function Signin({ setActive }) {
    const [inputTypeChanger, setInputTypeChanger] = useState(false);
    const username = useRef();
    const password = useRef();
    const [users, setUsers] = useState([])

    useEffect(() => {
        axios("https://65af84f32f26c3f2139b0190.mockapi.io/users")
            .then(res => setUsers(res.data))
    }, [])

    const signin = e => {
        e.preventDefault();
        let user_name = username.current.value;
        let user_password = password.current.value;

        let checkedUser = users.filter(user => user.username === user_name && user.password == user_password)
        if (checkedUser.length > 0) {
            localStorage.setItem("user", JSON.stringify(checkedUser[0]))
            setActive(true)
            successMessagge("Entered to system succesfully")
        } else {
            errorMessage("User not found")
            e.target.reset()
        }
    }

    const typeChanger = () => {
        if (inputTypeChanger) {
            setInputTypeChanger(false)
        } else {
            setInputTypeChanger(true)
        }
    }

    return (
        <div className='sign-in'>
            <div className="sign-in-content">
                <h2 className='sign-in-title'>Sign In</h2>
                <p className='sign-in-text'>Enter your username and password for review: username: admin , parol: admin</p>
                <form onSubmit={(e) => signin(e)} className='sign-in-form'>
                    <input required ref={username} type="text" placeholder='Enter username' />
                    <div>
                        <input autoComplete="true" required ref={password} type={inputTypeChanger ? "text" : "password"} placeholder='Enter password' />
                        <i onClick={typeChanger} className={inputTypeChanger ? "bi bi-eye-fill" : "bi bi-eye-slash-fill"}></i>
                    </div>
                    <button type='submit' className='sign-in-btn'>Sign In</button>
                </form>
            </div>
        </div>
    )
}
