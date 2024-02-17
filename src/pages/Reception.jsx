import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { errorMessage } from '../Notifications/errorNot'
import { successMessagge } from '../Notifications/successNot'
import SpinLoader from '../components/Spin';

export default function Reception() {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [dep, setDep] = useState(false)
  const [editChecker, setEditChecker] = useState(false)
  const [uniqId, setUniqId] = useState(null)
  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(false)
  const name = useRef();
  const surname = useRef();
  const phone = useRef();
  const student_course = useRef();

  useEffect(() => {
    axios.get("https://65af84f32f26c3f2139b0190.mockapi.io/courses")
      .then(res => {
        setCourses(res.data)
      })
      .catch(error => errorMessage(error.message))
  }, [])

  useEffect(() => {
    setLoading(true)
    axios.get("https://65af84f32f26c3f2139b0190.mockapi.io/reception")
      .then(res => {
        setStudents(res.data)
        setLoading(false)
      })
      .catch(error => errorMessage(error.message))
  }, [dep])


  const addStudent = (e) => {
    e.preventDefault()
    let newStudent = {
      student_name: name.current.value,
      student_surname: surname.current.value,
      student_phone: phone.current.value,
      course: JSON.parse(student_course.current.value),
      uniqId: Date.now()
    }

    if (newStudent.student_phone.length === 12) {
      {
        editChecker ?
          axios.put(`https://65af84f32f26c3f2139b0190.mockapi.io/reception/${editId}`, { ...newStudent, UniqId: uniqId }, {
            headers: {
              "Content-Type": "application/json"
            }
          })
            .then(() => {
              phone.current.style.color = `var(--hover-color)`;
              setDep(!dep)
              successMessagge("Student added successfully")
              e.target.reset()
              setEditChecker(false)
              setUniqId(null)
            })
            .catch(error => errorMessage(error.message))
          :
          axios.post("https://65af84f32f26c3f2139b0190.mockapi.io/reception", newStudent, {
            headers: {
              "Content-Type": "application/json"
            }
          })
            .then(() => {
              phone.current.style.color = `var(--hover-color)`;
              setDep(!dep)
              successMessagge("Student added successfully")
              e.target.reset()
            })
            .catch(error => errorMessage(error.message))

      }
    } else {
      phone.current.style.color = "red";
    }
  }

  const removeStudent = id => {
    axios.delete(`https://65af84f32f26c3f2139b0190.mockapi.io/reception/${id}`)
      .then(() => {
        setDep(!dep)
        successMessagge("Student deleted successfully")
      })
      .catch(error => errorMessage(error.message))
  }

  const editStudent = (student, e) => {
    setEditChecker(true)
    e.preventDefault();
    name.current.value = student.student_name;
    surname.current.value = student.student_surname;
    phone.current.value = student.student_phone;
    student_course.current.value = JSON.stringify(student.course);
    setEditId(student.id)
    setUniqId(uniqId)
    console.log(student)
  }

  return (
    <div className='reception'>
      <h1 className="reception-header">Reception</h1>
      <form onSubmit={e => addStudent(e)} className="reception-form-content">
        <div className="reception-col">
          <input ref={name} required type="text" placeholder='Enter Name' />
        </div>
        <div className="reception-col">
          <input ref={surname} required type="text" placeholder='Enter Surname' />
        </div>
        <div className="reception-col">
          <input ref={phone} required type="number" defaultValue={"998"} placeholder='Enter Phone Number' />
        </div>
        <div className="reception-col">
          <select ref={student_course}>
            {
              courses.map(course =>
                <option value={JSON.stringify({ id: course.id, name: course.name, img: course.img })} key={course.id}>{course.name}</option>
              )
            }
          </select>
        </div>
        <div className="reception-col">
          <button className='reception-btn'>{editChecker ? "Update" : "Add"}</button>
        </div>
      </form>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Surname</th>
            <th>Phone</th>
            <th>Course</th>
            <th>-/-</th>
          </tr>
        </thead>
        <tbody>
          {
            loading ? <tr><td colSpan={5}>Loading...</td></tr> :
              students.length > 0 ?
                students.map((student) =>
                  <tr key={student.id}>
                    <td>{student.student_name}</td>
                    <td>{student.student_surname}</td>
                    <td>+{student.student_phone}</td>
                    <td style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                      <img src={student.course.img} alt="" width={40} height={40} style={{ objectFit: "fill" }} />{student.course.name}</td>
                    <td>
                      <div className='action-btns'>
                        <span onClick={() => removeStudent(student.id)} className='remove-icon'><i className="bi bi-trash3"></i></span>
                        <span onClick={(e) => editStudent(student, e)} className='edit-icon'><i className="bi bi-pen"></i></span>
                      </div>
                    </td>
                  </tr>
                ) :
                <tr>
                  <td colSpan={5}>There isn't registered students!</td>
                </tr>
          }
        </tbody>
      </table>
    </div>
  )
}