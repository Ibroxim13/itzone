import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../pages/Home'
import Courses from '../pages/Courses'
import Groups from '../pages/Groups'
import Teachers from '../pages/Teachers'
import News from '../pages/News'
import Error from '../pages/Error'
import Reception from '../pages/Reception'
import AboutTeacher from './AboutTeacher'
import StudentsInGroup from '../pages/StudentsInGroup'
import ShowsNews from '../pages/ShowsNews'
import TeachersGroup from '../pages/TeachersGroup'
import Settings from '../pages/Settings'

export default function ContentPages() {
    let localUser = JSON.parse(localStorage.getItem("user"))

    return (
        <div className='main-content'>
            {
                localUser.role ?
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='/home' element={<Home />} />
                        <Route path='/reception' element={<Reception />} />
                        <Route path='/courses' element={<Courses />} />
                        <Route path='/groups' element={<Groups />} />
                        <Route path='/teachers' element={<Teachers />} />
                        <Route path='/news' element={<News />} />
                        <Route path='/profile' element={<Settings />} />
                        <Route path='/about-teacher' element={<AboutTeacher />} />
                        <Route path='/group/:id' element={<StudentsInGroup />} />
                        <Route path='*' element={<Error />} />
                    </Routes>
                    :
                    <Routes>
                        <Route path='/' element={<TeachersGroup />} />
                        <Route path='*' element={<Error />} />
                        <Route path='/profile' element={<Settings/>} />
                        <Route path='/group/:id' element={<StudentsInGroup />} />
                        <Route path='/notifications' element={<ShowsNews />} />
                        <Route path='/notifications/:id' element={<ShowsNews />} />
                    </Routes>
            }

        </div>
    )
}
