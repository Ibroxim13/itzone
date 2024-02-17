import axios from 'axios';
import React, { Fragment, useEffect, useRef, useState } from 'react'
import SpinLoader from '../components/Spin'
import { useNavigate } from 'react-router-dom';

export default function Settings() {
    const navigator = useNavigate()
    const [inputTypeChanger, setInputTypeChanger] = useState(false);
    const [loading, setLoading] = useState(false)
    const [courses, setCourses] = useState([]);
    let localUser = JSON.parse(localStorage.getItem("user"));
    const settingsForm = useRef();
    const name = useRef();
    const surname = useRef();
    const job = useRef();
    const phone = useRef();
    const img = useRef();
    const username = useRef();
    const password = useRef();

    useEffect(() => {
        setLoading(true)
        axios("https://65af84f32f26c3f2139b0190.mockapi.io/courses")
            .then(res => {
                setCourses(res.data)
                setLoading(false)
            })
    }, [])

    const showForm = () => {
        settingsForm.current.classList.toggle("settings-row-active");
        job.current.value = localUser.job;
        name.current.value = localUser.name;
        surname.current.value = localUser.surname;
        phone.current.value = localUser.phone;
        img.current.value = localUser.img;
        username.current.value = localUser.username;
        password.current.value = localUser.password;
    }

    const ChangeDataUser = (e) => {
        e.preventDefault();
        let data = {
            ...localUser,
            job: job.current.value,
            name: name.current.value,
            surname: surname.current.value,
            phone: phone.current.value,
            img: img.current.value,
            username: username.current.value,
            password: password.current.value,
        }

        axios.put(`https://65af84f32f26c3f2139b0190.mockapi.io/users/${data.id}`, data, {
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => {
                settingsForm.current.classList.toggle("settings-row-active");
                localStorage.setItem("user", JSON.stringify(res.data))
                if (localUser.role === false) {
                    axios.get(`https://65af84f32f26c3f2139b0190.mockapi.io/teacher`)
                        .then(res => {
                            let arr = res.data.filter(item => {
                                if (item.id === localUser.teacherId) {
                                    return item
                                }
                            })
                            let mentor = {
                                ...arr[0],
                                img: data.img,
                                phone: data.phone,
                                name: data.name,
                                surname: data.surname,
                                job: data.job
                            }
                            axios.put(`https://65af84f32f26c3f2139b0190.mockapi.io/teacher/${localUser.teacherId}`, mentor, {
                                headers: {
                                    "Content-Type": "application/json"
                                }
                            })
                            axios.get(`https://65af84f32f26c3f2139b0190.mockapi.io/group`)
                                .then(res => {
                                    let arr = res.data.filter(item => {
                                        if (item.teacher.id === localUser.teacherId) {
                                            item.teacher = { ...mentor, job: item.teacher.job }
                                            return item
                                        }
                                    })
                                    axios.put(`https://65af84f32f26c3f2139b0190.mockapi.io/group/${arr[0].id}`, arr[0], {
                                        headers: {
                                            "Content-Type": "application/json"
                                        }
                                    })
                                        .then(() => window.location.reload())
                                })
                        })
                }
                else {
                    window.location.reload()
                }
            })
    }

    const typeChanger = () => {
        if (inputTypeChanger) {
            setInputTypeChanger(false)
        } else {
            setInputTypeChanger(true)
        }
    }

    return (
        <Fragment>
            {!loading ?
                <div className='settings'>
                    <div className="content-header">
                        <div className="content-header-left">
                            <i onClick={() => navigator(localUser.role ? "/home" : "/")} className="bi bi-arrow-left"></i>
                            <h1>Profile</h1>
                        </div>
                    </div>
                    <div className="settings-content">
                        <div className="settings-info">
                            <div className="settings-info-left">
                                <img src={localUser.img} alt="" />
                            </div>
                            <div className="settings-info-right">
                                <div className='settings-user-data'>Name - <span>{localUser.name}</span></div>
                                <div className='settings-user-data'>Surname - <span>{localUser.surname}</span></div>
                                <div className='settings-user-data'>Phone Number - <span>+{localUser.phone}</span></div>
                                <div className='settings-user-data'>Job - <span>{localUser.job}</span></div>
                                <button onClick={showForm} className='settings-user-change-info'><i className="bi bi-pencil-fill"></i>Change information</button>
                            </div>
                        </div>
                        <form ref={settingsForm} onSubmit={e => ChangeDataUser(e)} className="settings-row">
                            <div className="settings-col">
                                <label>Name</label>
                                <input ref={name} type="text" />
                            </div>
                            <div className="settings-col">
                                <label>Surname</label>
                                <input ref={surname} type="text" />
                            </div>
                            <div className="settings-col">
                                <label>Job</label>
                                {
                                    localUser.role ? <input ref={job} type="text" /> :
                                        <select ref={job}>
                                            {
                                                courses.map(course =>
                                                    <option key={course.id}>{course.name}</option>
                                                )
                                            }
                                        </select>
                                }
                            </div>
                            <div className="settings-col">
                                <label>Phone Number</label>
                                <input ref={phone} type="number" />
                            </div>
                            <div className="settings-col">
                                <label>Image</label>
                                <input ref={img} type="text" />
                            </div>
                            <div className="settings-col">
                                <label>Username</label>
                                <input ref={username} type="text" />
                            </div>
                            <div className="settings-col">
                                <label>Password</label>
                                <input ref={password} autoComplete='true' type={inputTypeChanger ? "text" : "password"} />
                                <i onClick={typeChanger} className={inputTypeChanger ? "bi bi-eye-fill" : "bi bi-eye-slash-fill"}></i>
                            </div>
                            <div className="settings-col">
                                <button type='submit'>Update</button>
                            </div>
                        </form>
                    </div>
                </div> : <SpinLoader />
            }
        </Fragment>
    )
}
