import axios from 'axios';
import React, { useEffect, useRef } from 'react'
import { successMessagge } from '../Notifications/successNot';
import { errorMessage } from '../Notifications/errorNot';

export default function FormModalCourses({ modalCourse, modalCourseContent, hideModalCourse, setDepCourse, editCourse }) {
    const name = useRef();
    const imageCourse = useRef();
    const price = useRef();
    const duration = useRef();
    const description = useRef();

    useEffect(() => {
        if (editCourse[0] !== null) {
            name.current.value = editCourse[0].name
            imageCourse.current.value = editCourse[0].img
            price.current.value = editCourse[0].price.split(' ').join('');
            duration.current.value = editCourse[0].duration
            description.current.value = editCourse[0].description
        }
    }, [editCourse[0]])


    const courseAction = e => {
        e.preventDefault();
        let newCourse = {
            name: name.current.value,
            img: imageCourse.current.value,
            price: price.current.value,
            duration: duration.current.value,
            description: description.current.value,
        }

        {
            editCourse[0] == null ?
                axios.post(`https://65af84f32f26c3f2139b0190.mockapi.io/courses`, newCourse, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                    .then(() => {
                        modalCourse.current.classList.remove("show-modal-form");
                        setDepCourse((item) => !item)
                        e.target.reset();
                        successMessagge("Added new course")
                    })
                    .catch(error => errorMessage(error.messgae))
                :
                axios.put(`https://65af84f32f26c3f2139b0190.mockapi.io/courses/${editCourse[0].id}`, newCourse, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                    .then(() => {
                        modalCourse.current.classList.remove("show-modal-form");
                        editCourse[1](null)
                        successMessagge("Updated successfully")
                        setDepCourse((item) => !item)
                        e.target.reset();
                    })
                    .catch(error => errorMessage(error.messgae))
        }

    }

    return (
        <div ref={modalCourse} onClick={e => hideModalCourse(e)} className='modal-form'>
            <div ref={modalCourseContent} className="modal-form-content">
                <div className="close-modal-icon"><i className="bi bi-x-circle modal-close-icon"></i></div>
                <h1 className='modal-title'>Adding courses</h1>
                <form className="modal-forms" onSubmit={(e) => courseAction(e)}>
                    <input required ref={name} type="text" placeholder="Enter course's name" />
                    <input required ref={imageCourse} type="text" placeholder="Enter course image's URL" />
                    <input required ref={price} type="number" placeholder="Enter course's price: UZS" />
                    <input required ref={duration} type="number" placeholder="Enter course's duration: Month" />
                    <textarea required ref={description} placeholder="Course's description"></textarea>
                    <div className='form-add-btn-box'><button type='submit' className='add-btn-modal'>{editCourse[0] == null ? "Add" : "Save"}</button></div>
                </form>
            </div>
        </div>
    )
}
