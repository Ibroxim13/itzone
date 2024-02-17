import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { errorMessage } from '../Notifications/errorNot'
import { successMessagge } from '../Notifications/successNot'

export default function FormModalGroups({ editGroup, modal, modalContent, hideModal, setDep, selectedCourse, setSelectedCourse }) {
    const [teachers, setTeachers] = useState([])
    const [courses, setCourses] = useState([])
    const [editedGroup, setEditedGroup] = editGroup;
    const [students, setStudents] = useState([])
    const name = useRef()
    const teacher = useRef()
    const start_date = useRef()
    const end_date = useRef()
    const course = useRef()

    useEffect(() => {
        if (editedGroup !== null) {
            name.current.value = editedGroup.name;
            start_date.current.value = editedGroup.start_date;
            end_date.current.value = editedGroup.end_date;
            setStudents(editedGroup.students);
            setSelectedCourse(editedGroup.course_name);
            course.current.value = editedGroup.course_name.name;
            teacher.current.value = JSON.stringify(editedGroup.teacher);
        }
    }, [editedGroup])

    useEffect(() => {
        axios("https://65af84f32f26c3f2139b0190.mockapi.io/teacher")
            .then(res => {
                setTeachers(res.data)
            })
            .catch(error => errorMessage(error.message))
    }, [])

    useEffect(() => {
        axios("https://65af84f32f26c3f2139b0190.mockapi.io/courses")
            .then(res => setCourses(res.data))
            .catch(error => errorMessage(error.message))
    }, [])

    const addGroup = (e) => {
        e.preventDefault()
        let newGroup = {
            name: name.current.value,
            teacher: teacher.current.value != "Select teacher" ? JSON.parse(teacher.current.value) : "Select teacher",
            start_date: start_date.current.value,
            end_date: end_date.current.value,
            students: students,
            course_name: selectedCourse,
        }
        if (newGroup.teacher != "Select teacher") {
            {
                editedGroup == null ?
                    axios.post("https://65af84f32f26c3f2139b0190.mockapi.io/group", newGroup, {
                        headers: {
                            "Content-Type": "application/json"
                        }
                    })
                        .then(() => {
                            successMessagge("Group added succesfully")
                            setDep((prev) => !prev)
                            setStudents([])
                            modal.current.classList.remove("show-modal-form")
                            setSelectedCourse(null)
                            e.target.reset()
                        })
                        .catch(error => errorMessage(error.message))
                    :
                    axios.put(`https://65af84f32f26c3f2139b0190.mockapi.io/group/${editedGroup.id}`, newGroup, {
                        headers: {
                            "Content-Type": "application/json"
                        }
                    })
                        .then(() => {
                            setEditedGroup(null)
                            successMessagge("Group updated")
                            setDep((prev) => !prev)
                            setStudents([])
                            modal.current.classList.remove("show-modal-form")
                            setSelectedCourse(null)
                            e.target.reset()
                        })
                        .catch(error => errorMessage(error.message))
            }

        }
    }

    const changeEndTime = () => {
        if (teacher.current.value !== "Select teacher") {
            teacher.current.style.color = "var(--hover-color)"
            let currentDate = new Date(start_date.current.value);
            let endMonth = +selectedCourse.duration + currentDate.getMonth() + 1;
            currentDate.setMonth(endMonth)
            let endTimeYear = currentDate.getMonth() == "00" ? currentDate.getFullYear() - 1 : currentDate.getFullYear();
            let endTimeMonth = currentDate.getMonth() == "00" ? "12" : currentDate.getMonth();
            let endTimeDay = currentDate.getDate();
            let endTime = endTimeYear + "-" + `${endTimeMonth < 10 ? "0" + endTimeMonth : endMonth}` + "-" + `${endTimeDay < 10 ? "0" + endTimeDay : endTimeDay}`;
            end_date.current.value = endTime;
        } else {
            teacher.current.style.color = "red";
        }
    }

    const changeCourse = (mentor) => {
        if (mentor.current.value !== "Select teacher") {
            let teach = JSON.parse(mentor.current.value);
            course.current.value = teach.job;
            let obj = courses.filter(course => {
                if (course.name === teach.job) {
                    return course
                }
            })
            setSelectedCourse(obj[0])
        }
    }

    return (
        <div ref={modal} onClick={e => hideModal(e)} className='modal-form'>
            <div ref={modalContent} className="modal-form-content">
                <div className="close-modal-icon"><i className="bi bi-x-circle modal-close-icon"></i></div>
                <h1 className='modal-title'>Adding groups</h1>
                <form onSubmit={e => addGroup(e)} className="modal-forms">
                    <input ref={name} required type="text" placeholder="Enter group's name" />
                    <select onChange={() => changeCourse(teacher)} ref={teacher}>
                        <option>Select teacher</option>
                        {
                            teachers.map(item =>
                                <option key={item.id} value={JSON.stringify(item)}>{item.name} {item.surname}</option>
                            )
                        }
                    </select>
                    <input ref={course} placeholder='Enter course by choosing teacher' disabled type="text" />
                    <input ref={start_date} onChange={changeEndTime} type="date" laceholder="Enter date of start the group" />
                    <input ref={end_date} disabled type="date" />
                    <div className='form-add-btn-box'><button type='submit' className='add-btn-modal'>{editedGroup ? "Update" : "Add"}</button></div>
                </form>
            </div>
        </div >
    )
}
