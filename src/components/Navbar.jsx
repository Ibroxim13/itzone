import React, { useEffect, useRef, useState } from 'react'
import PageController from './PageController'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UseMainContext } from '../Context/mainContext'

export default function Navbar(props) {
  let localUser = JSON.parse(localStorage.getItem("user"));
  const [notDep, setNotDep] = UseMainContext()
  const [notifications, setNotifications] = useState([])
  const navigate = useNavigate()
  const location = useLocation()
  const modeChanger = useRef();
  const notIcon = useRef();
  const notContent = useRef()
  const [dep, setDep] = useState(false)
  const [notContentChanger, setNotContentChanger] = useState(false)
  const [mode, setMode] = useState(JSON.parse(localStorage.getItem("mode") == "light") ? true : false)

  const openSidebarMenu = () => {
    props.sidebarMenu.current.style.left = "0";
  }

  useEffect(() => {
    axios.get('https://65af84f32f26c3f2139b0190.mockapi.io/news')
      .then(res => setNotifications(res.data))
  }, [dep])

  setTimeout(() => {
    setDep(!dep)
  }, 60000);

  const changeMode = () => {
    if (localStorage.getItem("mode") === "dark") {
      document.querySelector("body").classList.remove("mode-active")
      localStorage.setItem("mode", "light")
      setMode(true)
    }
    else {
      if (mode) {
        document.querySelector("body").classList.add("mode-active")
        localStorage.setItem("mode", "dark")
        setMode(false)
      }
      else {
        document.querySelector("body").classList.remove("mode-active")
        localStorage.setItem("mode", "light")
        setMode(true)
      }
    }
  }

  if ((localStorage.getItem('mode')) === "dark") {
    document.querySelector("body").classList.add("mode-active")
  }
  if ((localStorage.getItem('mode')) === "light") {
    document.querySelector("body").classList.remove("mode-active")
  }

  const openNots = () => {
    if (notContentChanger == false) {
      notContent.current.style.opacity = "1";
      notContent.current.style.visibility = "visible";
      setNotContentChanger(!notContentChanger)
    }
    else {
      hideNots()
      setNotContentChanger(!notContentChanger)
    }
  }

  const hideNots = () => {
    notContent.current.style.opacity = "0";
    notContent.current.style.visibility = "hidden"
  }

  return (
    <div className='navbar'>
      <div className="navbar-left">
        <div onClick={openSidebarMenu} className="sidebar-menu-open-icon" ref={props.sidebarMenuIcon}><i className="bi bi-list"></i></div>
        {
          location.pathname === "/home" || location.pathname === "/" ?
            <div className='navbar-logo'>
              <i className="bi bi-code-slash navbar-logo-icon"></i>
              <span>IT ZONE Education System</span>
            </div>
            : <PageController />
        }
      </div>
      <div className="navbar-right">
        <div className="search-input">
          <i className="bi bi-search filter-search-icon" ></i>
          <input type="search" placeholder='Search...' />
        </div>
        {
          localUser.role ? "" :
            <div className='notification-box'>
              <i ref={notIcon} onClick={openNots} className="bi bi-bell-fill notification-icon"></i>
              <div ref={notContent} className="notification-box-content">
                <h5>Notifications</h5>
                <ul className="notifications-content">
                  {
                    notifications.map(not =>
                      <li onClick={() => { setNotDep(!notDep); navigate(`/notifications/${not.id}`); hideNots() }} key={not.id}>
                        <div className='notification-title'>{not.title}</div>
                        <div className='notification-time'><span>{not.date}</span><span>{not.day}</span></div>
                      </li>
                    )
                  }
                </ul>
                <Link to={"/notifications"} onClick={() => { hideNots(); setNotDep(!dep) }}><button>View all</button></Link>
              </div>
            </div>
        }

        <i ref={modeChanger} onClick={changeMode} className={mode ? `bi bi-moon-fill mode-icon` : "bi bi-brightness-high-fill mode-icon"}></i>
      </div>
    </div >
  )
}

