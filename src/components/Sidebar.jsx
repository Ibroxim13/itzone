import React, { Fragment, useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import axios from 'axios'
import { UseMainContext } from '../Context/mainContext';

export default function Sidebar({ sidebarMenu, setActive }) {
    const localUser = JSON.parse(localStorage.getItem("user"));
    const [groups, setGroups] = useState()
    const [Groupdep, setGroupDep] = UseMainContext()

    useEffect(() => {
        axios.get("https://65af84f32f26c3f2139b0190.mockapi.io/group")
            .then(res => {
                setGroups(res.data.filter(item => item?.teacher?.id == localUser.teacherId))
            })
    }, [])

    const logOut = () => {
        localStorage.removeItem("user")
        setActive(false)
        window.location.href = "/"
    }

    const closeSidebarMenu = () => {
        sidebarMenu.current.style.left = "-100%";
    }

    return (
        <Fragment>
            <i className="bi bi-x-circle sidebar-menu-close-icon" onClick={closeSidebarMenu}></i>
            <Link to={localUser.role ? "/home" : "/"} className='sidebar-logo'>
                <span className='sidebar-logo-icon'><i className="bi bi-code-slash"></i></span>
                <span className='sidebar-logo-text'>IT ZONE</span>
            </Link>

            {
                localUser.role ? <ul className='sidebar-menu'>
                    <li>
                        <NavLink to="/home">
                            <span className='sidebar-menu-icon'><i className="bi bi-house-door-fill"></i></span>
                            <span className='sidebar-menu-text'>Home</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/reception">
                            <span className='sidebar-menu-icon'><i className="bi bi-info-circle-fill"></i></span>
                            <span className='sidebar-menu-text'>Reception</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/courses">
                            <span className='sidebar-menu-icon'><i className="bi bi-layers-half"></i></span>
                            <span className='sidebar-menu-text'>Courses</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/groups">
                            <span className='sidebar-menu-icon'><i className="bi bi-collection-fill"></i></span>
                            <span className='sidebar-menu-text'>Groups</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/teachers" >
                            <span className='sidebar-menu-icon'><i className="bi bi-people-fill"></i></span>
                            <span className='sidebar-menu-text'>Teachers</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/news">
                            <span className='sidebar-menu-icon'><i className="bi bi-volume-up-fill"></i></span>
                            <span className='sidebar-menu-text'>News</span>
                        </NavLink>
                    </li>
                </ul> :
                    <ul className='sidebar-menu'>
                        {groups?.map(item => <li onClick={() => setGroupDep(!Groupdep)} key={item.id}>
                            <NavLink to={'/group/' + item.id}>
                                <span className='sidebar-menu-icon'><i className="bi bi-people-fill"></i></span>
                                <span className='sidebar-menu-text'>{item.name}</span>
                            </NavLink>
                        </li>)
                        }
                    </ul>
            }

            <ul className='sidebar-footer'>
                <li>
                    <NavLink to={'/profile'}>
                        <span className='sidebar-footer-icon'><i className="bi bi-person-fill-gear"></i></span>
                        <span className='sidebar-footer-text'>Profile</span>
                    </NavLink>
                </li>
                <li onClick={logOut}>
                    <a>
                        <span className='sidebar-footer-icon'><i className="bi bi-box-arrow-right"></i></span>
                        <span className='sidebar-footer-text'>Log out</span>
                    </a>
                </li>
            </ul>
        </Fragment>
    )
}
