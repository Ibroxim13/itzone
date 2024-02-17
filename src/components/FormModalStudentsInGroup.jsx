import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { errorMessage } from '../Notifications/errorNot'
import { successMessagge } from '../Notifications/successNot'

export default function FormModalStudentsInGroup({ modal, modalContent, hideModal, course, data, setGroupDep, id, editedStd }) {
    const name = useRef()
    const surname = useRef()
    const phone = useRef()
    const [editStudentCourse, setEditStudentCourse] = useState(null)
    const [editedStudent, setEditedStudent] = editedStd;;

    useEffect(() => {
        if (editedStudent) {
            name.current.value = editedStudent.student_name;
            surname.current.value = editedStudent.student_surname;
            phone.current.value = editedStudent.student_phone;
            setEditStudentCourse(editedStudent.course);
            course.current.value = editedStudent.course.name;
        }
    }, [editedStudent])

    const addStudent = e => {
        e.preventDefault()
        let newStudent = {
            student_name: name.current.value,
            student_phone: phone.current.value,
            student_surname: surname.current.value,
            uniqId: Date.now(),
            course: {
                name: course.current.value
            },
        }

        if (phone.current.value.length == 12) {
            {
                editedStudent === null ?
                    axios.get("https://65af84f32f26c3f2139b0190.mockapi.io/courses")
                        .then(res => {
                            let cour = res.data.filter(item => {
                                if (item.name === course.current.value) {
                                    return item
                                }
                            })
                            newStudent.course.id = cour[0].id;
                            newStudent.course.img = cour[0].img;
                            data.students.push(newStudent)
                            axios.put(`https://65af84f32f26c3f2139b0190.mockapi.io/group/${id}`, data, {
                                headers: {
                                    "Content-Type": "application/json"
                                }
                            })
                                .then(() => {
                                    setGroupDep(prev => !prev)
                                    modal.current.classList.remove("show-modal-form")
                                    e.target.reset()
                                    successMessagge("Added new student")
                                    phone.current.style.color = "var(--hover-color)"
                                })
                                .catch(error => errorMessage(error.message))
                        })
                    :
                    editStudent(e)
            }
        }
        else {
            phone.current.style.color = "red"
        }
    }

    const editStudent = (e) => {
        let newStudent = {
            student_name: name.current.value,
            student_phone: phone.current.value,
            student_surname: surname.current.value,
            uniqId: editedStudent.uniqId,
            course: editStudentCourse,
        }
        let arr = data.students.filter(item => {
            if (item.uniqId !== editedStudent.uniqId) {
                return item
            }
        })
        arr.push(newStudent)
        data.students = arr
        axios.put(`https://65af84f32f26c3f2139b0190.mockapi.io/group/${id}`, data, {
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(() => {
                setGroupDep(prev => !prev)
                modal.current.classList.remove("show-modal-form")
                e.target.reset()
                successMessagge("Updated student")
                phone.current.style.color = "var(--hover-color)"
            })
    }

    return (
        <div ref={modal} onClick={e => hideModal(e)} className='modal-form'>
            <div ref={modalContent} className="modal-form-content">
                <div className="close-modal-icon"><i className="bi bi-x-circle modal-close-icon"></i></div>
                <h1 className='modal-title'>{editedStudent ? "Changing student data" : "Adding Students"}</h1>
                <form onSubmit={(e) => addStudent(e)} className="modal-forms">
                    <input required ref={name} type="text" placeholder="Enter student's name" />
                    <input required ref={surname} type="text" placeholder="Enter student's surname" />
                    <input required defaultValue={"998"} ref={phone} type="number" placeholder="Enter student's phone number" />
                    <input required ref={course} type="text" disabled />
                    <div className='form-add-btn-box'><button type='submit' className='add-btn-modal'>{editedStudent ? "Update" : "Add"}</button></div>
                </form>
            </div>
        </div>
    )
}
