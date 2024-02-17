import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { successMessagge } from '../Notifications/successNot';
import { errorMessage } from '../Notifications/errorNot';

export default function FormModalTeachers({ editedteacher, modal, modalContent, hideModal, setDepTeacher }) {
    const name = useRef();
    const surname = useRef();
    const imageTeacher = useRef();
    const job = useRef();
    const phone = useRef();
    const description = useRef();
    const workSkills = useRef();
    const [editedTeacher, setEditedTeacher] = editedteacher;
    const [editedTeacherLogin, setEditedTeacherLogin] = useState(null);
    const [courses, setCourses] = useState([])

    useEffect(() => {
        axios.get("https://65af84f32f26c3f2139b0190.mockapi.io/courses")
            .then(res => {
                setCourses(res.data)
            })
            .catch(error => errorMessage(error.message))
    }, [])

    useEffect(() => {
        if (editedTeacher !== null) {
            name.current.value = editedTeacher.name;
            surname.current.value = editedTeacher.surname;
            imageTeacher.current.value = editedTeacher.img;
            job.current.value = editedTeacher.job;
            phone.current.value = editedTeacher.phone;
            description.current.value = editedTeacher.description;
            workSkills.current.value = editedTeacher.work_skills;
            axios.get(`https://65af84f32f26c3f2139b0190.mockapi.io/users`)
                .then(data => {
                    setEditedTeacherLogin(data.data.filter(item => {
                        if (item.teacherId === editedTeacher.id) {
                            return item
                        }
                    })[0])
                })
        }
    }, [editedTeacher])

    const teacherAction = e => {
        e.preventDefault();
        let newTeacher = {
            name: name.current.value,
            surname: surname.current.value,
            img: imageTeacher.current.value,
            job: job.current.value,
            phone: phone.current.value,
            description: description.current.value,
            work_skills: workSkills.current.value
        }

        if (newTeacher.phone.length === 12) {
            {
                editedTeacher === null ?
                    axios.post("https://65af84f32f26c3f2139b0190.mockapi.io/teacher", newTeacher, {
                        headers: {
                            "Content-Type": "application/json"
                        }
                    })
                        .then((res) => {
                            phone.current.style.color = "#616a7b"
                            modal.current.classList.remove("show-modal-form")
                            setDepTeacher(dep => !dep)
                            e.target.reset();
                            successMessagge("Added new teacher")
                            let teacher = {
                                phone: res.data.phone,
                                job: res.data.job,
                                name: res.data.name,
                                surname: res.data.surname,
                                username: res.data.name,
                                password: Date.now(),
                                img: res.data.img,
                                role: false,
                                teacherId: res.data.id
                            }
                            axios.post("https://65af84f32f26c3f2139b0190.mockapi.io/users", teacher, {
                                headers: {
                                    "Content-Type": "application/json"
                                }
                            })
                        })
                        .catch(error => errorMessage(error.messgae))
                    :
                    axios.put(`https://65af84f32f26c3f2139b0190.mockapi.io/teacher/${editedTeacher.id}`, newTeacher, {
                        headers: {
                            "Content-Type": "application/json"
                        }
                    })
                        .then(() => {
                            phone.current.style.color = "#616a7b"
                            modal.current.classList.remove("show-modal-form")
                            editTeacherwithGroup(editedTeacher.id, newTeacher)
                            setDepTeacher(dep => !dep)
                            e.target.reset();
                            successMessagge("Updated teacher")
                            let teacherLogin = {
                                ...editedTeacherLogin, name: newTeacher.name, surname: newTeacher.surname, job: newTeacher.job,
                                phone: newTeacher.phone, img: newTeacher.img
                            }
                            axios.put(`https://65af84f32f26c3f2139b0190.mockapi.io/users/${editedTeacherLogin.id}`, teacherLogin, {
                                headers: {
                                    "Content-Type": "application/json"
                                }
                            })
                                .then(data => {
                                    setEditedTeacherLogin(null)
                                    console.log(data.data)
                                })
                        })
                        .catch(error => errorMessage(error.messgae))
            }
        } else {
            phone.current.style.color = "red"
        }
    }

    return (
        <div ref={modal} onClick={(e) => hideModal(e)} className='modal-form'>
            <div ref={modalContent} className="modal-form-content">
                <div className="close-modal-icon"><i className="bi bi-x-circle modal-close-icon"></i></div>
                <h1 className='modal-title'>Adding teachers</h1>
                <form className="modal-forms" onSubmit={e => teacherAction(e)}>
                    <input required ref={name} type="text" placeholder="Enter teacher's name" />
                    <input required ref={surname} type="text" placeholder="Enter teacher's surname" />
                    <input required ref={imageTeacher} type="text" placeholder="Enter teacher image's URL" />
                    <select ref={job}>
                        {
                            courses.map(course =>
                                <option key={course.id}>{course.name}</option>
                            )
                        }
                    </select>
                    <input required ref={phone} defaultValue={"998"} type="number" placeholder="Enter teacher's phone number" />
                    <textarea required ref={workSkills} placeholder="Enter teacher's work skills"></textarea>
                    <textarea required ref={description} placeholder="Enter teacher's description"></textarea>
                    <div className='form-add-btn-box'><button type='submit' className='add-btn-modal'>{editedTeacher === null ? "Add" : "Update"}</button></div>
                </form>
            </div>
        </div>
    )
}


const editTeacherwithGroup = (id, data) => {
    axios.get("https://65af84f32f26c3f2139b0190.mockapi.io/group")
        .then(res => {
            res.data.map(item => {
                if (item.teacher.id == id) {
                    item.teacher = data;
                    item.teacher.id = id;
                    axios.put(`https://65af84f32f26c3f2139b0190.mockapi.io/group/${item.id}`, item, {
                        headers: {
                            "Content-Type": "application/json"
                        }
                    })
                }
            })
        })
        .catch(error => errorMessage(error.message))
}