import axios from 'axios'
import React, { useEffect, useState, useRef } from 'react'
import FormModalGroups from '../components/FormModalGroups'
import { successMessagge } from '../Notifications/successNot'
import { errorMessage } from '../Notifications/errorNot'
import { useNavigate } from 'react-router-dom'

export default function Groups() {
  const navigate = useNavigate()
  const modal = useRef()
  const modalContent = useRef()
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [dep, setDep] = useState(false)
  const [groups, setGroups] = useState([])
  const [editedGroup, setEditedGroup] = useState(null);

  useEffect(() => {
    setLoading(true)
    axios.get("https://65af84f32f26c3f2139b0190.mockapi.io/group")
      .then(res => {
        setGroups(res.data)
        setLoading(false)
      })
  }, [dep])

  const showModal = () => {
    modal.current.classList.add("show-modal-form")
  }

  const hideModal = e => {
    if (e.target.classList.contains("modal-form") ||
      e.target.classList.contains("modal-close-icon")) {
      setSelectedCourse(null)
      setEditedGroup(null)
      document.querySelector(".modal-forms").reset()
      modal.current.classList.remove("show-modal-form")
    }
  }

  function removeGroup(id) {
    axios.delete(`https://65af84f32f26c3f2139b0190.mockapi.io/group/${id}`)
      .then(() => {
        setDep(!dep)
        successMessagge("Group deleted")
      })
      .catch(error => errorMessage(error.message))
  }

  const toEditGroup = (group) => {
    setEditedGroup(group)
    showModal()
  }

  return (
    <div className='groups'>
      <div className="content-header">
        <h1>Our Groups</h1>
        <button onClick={showModal}>Add</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Group </th>
            <th>Course</th>
            <th>Teacher</th>
            <th>Duration</th>
            <th>-/-</th>
          </tr>
        </thead>
        <tbody>
          {loading ? <tr><td colSpan={5}>Loading...</td></tr> :
            groups.length > 0 ?
              groups.map(group => {
                return (
                  <tr key={group.id}>
                    <td>{group.name}</td>
                    <td>
                      <div style={{ "display": "flex", "alignItems": "center", "gap": "10px", "justifyContent": "center" }}>
                        <img width="40px" height="40px" src={group.course_name.img} alt="" />
                        <span>{group.course_name.name}</span>
                      </div>
                    </td>
                    <td>{group.teacher.name}</td>
                    <td>{group.start_date} -- {group.end_date}</td>
                    <td>
                      <div className='action-btns'>
                        <span onClick={() => navigate(`/group/${group.id}`)} className='show-more-icon' style={{ "fontSize": "20px" }}><i className="bi bi-person-fill-add"></i></span>
                        <span onClick={() => removeGroup(group.id)} className='remove-icon'><i className="bi bi-trash3"></i></span>
                        <span onClick={() => toEditGroup(group)} className='edit-icon'><i className="bi bi-pen"></i></span>
                      </div>
                    </td>
                  </tr>
                )
              })
              :
              <tr><td colSpan={5}>There isn't groups yet!</td></tr>
          }
        </tbody>
      </table>
      <FormModalGroups
        hideModal={hideModal}
        modal={modal}
        modalContent={modalContent}
        setDep={setDep}
        setSelectedCourse={setSelectedCourse}
        selectedCourse={selectedCourse}
        editGroup={[editedGroup, setEditedGroup]}
      />
    </div>
  )
}
