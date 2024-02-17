import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function AboutTeacher() {
    const [teacher] = useState(JSON.parse(localStorage.getItem("teacherAbout")));
    const navigate = useNavigate()

    return (
        <div className='about-teacher'>
            <i onClick={()=>navigate("/teachers")} className="bi bi-arrow-left to-teacher-page"></i>
            <div className="about-teacher-left">
                <img src={teacher.img} className='about-teacher-img' alt='teacher' />
            </div>
            <div className="about-teacher-right">
                <h1 className='about-teacher-title'>Teacher of {teacher.job}</h1>
                <p>{teacher.name} {teacher.surname}</p>
                <div className='about-teacher-skills'><span>Technologies :</span>{teacher.work_skills}</div>
                <div className='about-teacher-description'><span>Description:</span>{teacher.description}</div>
                <a href={"tel:+" + teacher.phone} className='about-teacher-phone'>Phone number : +{teacher.phone}</a>
            </div>
        </div>
    )
}
