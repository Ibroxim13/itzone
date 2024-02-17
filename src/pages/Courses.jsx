import axios from 'axios'
import React, { Fragment, useEffect, useState, useRef } from 'react'
import FormModalCourses from '../components/FormModalCourses'
import { errorMessage } from '../Notifications/errorNot'
import { successMessagge } from '../Notifications/successNot'
import SpinLoader from '../components/Spin'

export default function Courses() {
  const modalCourse = useRef()
  const [loading, setLoading] = useState(false)
  const modalCourseContent = useRef()
  const [courses, setCourses] = useState([])
  const [depCourse, setDepCourse] = useState(false)
  const [editCourse, setEditCourse] = useState(null)

  useEffect(() => {
    setLoading(true)
    axios.get("https://65af84f32f26c3f2139b0190.mockapi.io/courses")
      .then((res) => {
        setCourses(res.data)
        setLoading(false)
      })
      .catch(error => errorMessage(error.messgae))
  }, [depCourse])

  const showModalCourse = () => {
    modalCourse.current.classList.add("show-modal-form")
  }

  const hideModalCourse = e => {
    if (e.target.classList.contains("modal-form") ||
      e.target.classList.contains("modal-close-icon")) {
      modalCourse.current.classList.remove("show-modal-form")
      document.querySelector(".modal-forms").reset();
    }
  }

  const removeCourse = id => {
    axios.delete(`https://65af84f32f26c3f2139b0190.mockapi.io/courses/${id}`)
      .then(res => {
        setDepCourse(!depCourse)
        successMessagge("Deleted course successfully")
      })
      .catch(error => errorMessage(error.messgae))
  }

  const editingCourse = (course) => {
    setEditCourse(course)
    showModalCourse()
  }

  return (
    <Fragment>
      <div className='courses'>
        <div className="content-header">
          <h1>Popular courses</h1>
          <button onClick={showModalCourse}>Add</button>
        </div>
        <div className="courses-cards-content">
          {loading ? <SpinLoader height='calc(100vh - 221px)'/> :
            courses.map((course) =>
              <div key={course.id} className="course-card">
                <div className="course-card-header">
                  <img src={course.img} alt="" />
                  <div className='course-actions'>
                    <i className="bi bi-three-dots-vertical course-info-dropdown"></i>
                    <ul className="course-actions-list">
                      <li onClick={() => editingCourse(course)}><i className="bi bi-pencil-fill"></i></li>
                      <li onClick={() => removeCourse(course.id)}><i className="bi bi-trash-fill"></i></li>
                    </ul>
                  </div>
                </div>
                <h1 className='course-name'>{course.name}</h1>
                <div className='course-info'>
                  <div className="course-duration">
                    <span>Duration:</span>
                    <span>{course.duration} Month</span>
                  </div>
                  <div className="course-price">
                    <span>Price:</span>
                    <span>{course.price}UZS/Month</span>
                  </div>
                </div>
                <div className="course-about">{course.description}</div>
              </div>
            )
          }
        </div>
      </div>
      <FormModalCourses
        modalCourse={modalCourse}
        modalCourseContent={modalCourseContent}
        hideModalCourse={hideModalCourse}
        setDepCourse={setDepCourse}
        editCourse={[editCourse, setEditCourse]}
      />
    </Fragment>
  )
}
