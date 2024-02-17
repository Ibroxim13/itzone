import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import FormModalTeachers from '../components/FormModalTeachers'
import { errorMessage } from '../Notifications/errorNot'
import { useNavigate } from 'react-router-dom'
import SpinLoader from '../components/Spin'

export default function Teachers() {
  const [loading, setLoading] = useState(false)
  const [teachers, setTeachers] = useState([])
  const [depTeacher, setDepTeacher] = useState(false)
  const [editedTeacher, setEditedTeacher] = useState(null)
  const modal = useRef()
  const modalContent = useRef()
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    axios("https://65af84f32f26c3f2139b0190.mockapi.io/teacher")
      .then(res => {
        setTeachers(res.data)
        setLoading(false)
      })
  }, [depTeacher])

  const showModal = () => {
    modal.current.classList.add("show-modal-form")
  }

  const hideModal = e => {
    if (e.target.classList.contains("modal-form") ||
      e.target.classList.contains("modal-close-icon")) {
      setEditedTeacher(null)
      document.querySelector(".modal-forms").reset()
      modal.current.classList.remove("show-modal-form")
    }
  }

  const removeTeacher = (id) => {
    axios.delete(`https://65af84f32f26c3f2139b0190.mockapi.io/teacher/${id}`)
      .then(() => {
        setDepTeacher(!depTeacher)
      })
      .catch(error => errorMessage(error.message))
  }

  const editTeacher = (teacher) => {
    setEditedTeacher(teacher)
    showModal()
  }

  const navigateToAboutTeacher = (teacher) => {
    localStorage.setItem("teacherAbout", JSON.stringify(teacher))
    navigate("/about-teacher")
  }

  return (
    <div className='teacher'>
      <div className="content-header">
        <h1>Our teachers</h1>
        <button onClick={showModal}>Add</button>
      </div>
      {loading ? <SpinLoader /> :
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Fullname</th>
              <th>Profession</th>
              <th>Phone Number</th>
              <th>-/-</th>
            </tr>
          </thead>
          <tbody>
            {
              teachers.length > 0 ?
                teachers.map((teacher) =>
                  <tr key={teacher.id}>
                    <td>
                      <div className='table-user-img'>
                        <img width="80px" height="80px" src={teacher.img} alt="" />
                      </div>
                    </td>
                    <td>{teacher.name} {teacher.surname}</td>
                    <td>{teacher.job}</td>
                    <td>+{teacher.phone}</td>
                    <td>
                      <div className='action-btns'>
                        <span onClick={() => navigateToAboutTeacher(teacher)} className='show-more-icon'><i className="bi bi-info-circle-fill"></i></span>
                        <span onClick={() => removeTeacher(teacher.id, teacher.full_name)} className='remove-icon'><i className="bi bi-trash3"></i></span>
                        <span onClick={() => editTeacher(teacher)} className='edit-icon'><i className="bi bi-pen"></i></span>
                      </div>
                    </td>
                  </tr>
                ) :
                <tr>
                  <td colSpan={5}>There isn't teachers yet!</td>
                </tr>
            }
          </tbody>
        </table>
      }

      <FormModalTeachers
        modal={modal}
        modalContent={modalContent}
        hideModal={hideModal}
        setDepTeacher={setDepTeacher}
        editedteacher={[editedTeacher, setEditedTeacher]}
      />
    </div>
  )
}
