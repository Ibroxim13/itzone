import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { errorMessage } from '../Notifications/errorNot';
import FormModalStudentsInGroup from '../components/FormModalStudentsInGroup';
import { UseMainContext } from '../Context/mainContext';


export default function StudentsInGroup() {
    let localUser = JSON.parse(localStorage.getItem("user"))
    const [data, setData] = useState({})
    const [loading, setLoading] = useState(false)
    const [Groupdep, setGroupDep] = UseMainContext()
    const [receptionStudents, setReceptionStudents] = useState([])
    const [editedStudent, setEditedStudent] = useState(null)
    const param = useParams();
    const navigator = useNavigate()
    const modal = useRef()
    const modalContent = useRef()
    const courseName = useRef()

    useEffect(() => {
        setLoading(true)
        axios.get(`https://65af84f32f26c3f2139b0190.mockapi.io/group/${param.id}`)
            .then(res => {
                setData(res.data)
                checker(res.data)
            })
    }, [Groupdep])

    function checker(group) {
        axios.get('https://65af84f32f26c3f2139b0190.mockapi.io/reception')
            .then(res => {
                let arr = res.data.filter(item => {
                    if (item.course.id === group?.course_name?.id) {
                        return item
                    }
                })
                setReceptionStudents(arr)
                setLoading(false)
            })
    }

    const AcceptStudent = student => {
        data.students.push(student);
        axios.put(`https://65af84f32f26c3f2139b0190.mockapi.io/group/${param.id}`, data, {
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(() => {
                axios.delete(`https://65af84f32f26c3f2139b0190.mockapi.io/reception/${student.id}`)
                    .then(() => setGroupDep(!Groupdep))
            })
            .catch(error => errorMessage(error.message))
    }

    const removeStudent = (id) => {
        data.students = data.students.filter(student => {
            if (student.uniqId !== id) {
                return student
            }
        })
        axios.put(`https://65af84f32f26c3f2139b0190.mockapi.io/group/${param.id}`, data, {
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(() => {
                setGroupDep(!Groupdep)
            })
            .catch(error => errorMessage(error.message))
    }

    const editStudent = student => {
        setEditedStudent(student)
        modal.current.classList.add("show-modal-form")
    }

    const showModal = () => {
        modal.current.classList.add("show-modal-form")
        courseName.current.value = data?.course_name?.name;
    }

    const hideModal = e => {
        if (e.target.classList.contains("modal-form") ||
            e.target.classList.contains("modal-close-icon")) {
            modal.current.classList.remove("show-modal-form")
            setEditedStudent(null)
            document.querySelector(".modal-forms").reset()
        }
    }

    return (
        <div className='details'>
            <div className="content-header">
                <div className='content-header-left'>
                    <i onClick={() => navigator(`${localUser.role ? "/groups" : "/"}`)} className="bi bi-arrow-left"></i>
                    <h1>Course details</h1>
                </div>
                {localUser.role ? <button onClick={showModal}>Add</button> : ""}
            </div>
            <div className='details-row'>
                <div className='details-col'>
                    <div className='detail-content registered-students-in-group'>
                        <h5 className='registered-title'>Registered students to this course</h5>
                        <div className="registered-students">
                            {loading ?
                                <table>
                                    <tbody><tr><td colSpan={3}>Loading...</td></tr></tbody>
                                </table> :
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Surname</th>
                                            <th>-/-</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {receptionStudents.length > 0 ?
                                            receptionStudents.map(item =>
                                                <tr key={item.id}>
                                                    <td>{item.student_name}</td>
                                                    <td>{item.student_surname}</td>
                                                    <td><button className='accept-btn' onClick={() => localUser.role ? AcceptStudent(item) : ""}><i className="bi bi-person-fill-check"></i></button></td>
                                                </tr>
                                            ) :
                                            <tr><td colSpan={3}>Didn't register students for this course.</td></tr>
                                        }
                                    </tbody>
                                </table>
                            }
                        </div>
                    </div>
                </div>
                <div className='details-col'>
                    <div className='detail-content students-in-group'>
                        <h4 className='group-name'>Group name - <span>{data.name}</span></h4>
                        <h3 className='group-teacher'>{data?.course_name?.name} - {data?.teacher?.name} {data?.teacher?.surname}</h3>
                        <div className='group-price'>Price - <span>{data?.course_name?.price}</span> UZS/Month</div>
                        <div className='group-duration'>Duration - <span>{data?.course_name?.duration} Month</span> from <b>{data.start_date}</b> to <b>{data.end_date}</b></div>
                        <div className='students-count'>Students : {data?.students?.length}</div>
                        <div className="students-table">
                            {loading ?
                                <table>
                                    <tbody><tr><td colSpan={3}>Loading...</td></tr></tbody>
                                </table> :
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Surname</th>
                                            <th>Phone</th>
                                            <th>-/-</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            data?.students?.length > 0 ?
                                                data?.students?.map(item =>
                                                    <tr key={item.student_phone}>
                                                        <td>{item.student_name}</td>
                                                        <td>{item.student_surname}</td>
                                                        <td>{item.student_phone}</td>
                                                        <td>
                                                            <span onClick={() => localUser.role ? removeStudent(item.uniqId) : ""} className='remove-icon'><i className='bi bi-trash3'></i></span>
                                                            <span onClick={() => localUser.role ? editStudent(item) : ""} className="edit-icon"><i className="bi bi-pen"></i></span>
                                                        </td>
                                                    </tr>
                                                )
                                                :
                                                <tr><td colSpan={4}>Students haven't been added to this group yet!</td></tr>
                                        }
                                    </tbody>
                                </table>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <FormModalStudentsInGroup
                modal={modal}
                modalContent={modalContent}
                hideModal={hideModal}
                course={courseName}
                data={data}
                setGroupDep={setGroupDep}
                id={param.id}
                editedStd={[editedStudent, setEditedStudent]}
            />
        </div>
    )
}
