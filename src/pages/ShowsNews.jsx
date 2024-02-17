import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { UseMainContext } from '../Context/mainContext'

export default function ShowsNews() {
  const navigate = useNavigate()
  const [notDep, setNotDep] = UseMainContext()
  const [notifications, setNotifications] = useState([])
  const [dep, setDep] = useState(false)
  const param = useParams()
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    axios.get("https://65af84f32f26c3f2139b0190.mockapi.io/news")
      .then(res => {
        setNotifications(res.data)
      })
  }, [dep])

  useEffect(() => {
    if (param.id) {
      axios.get(`https://65af84f32f26c3f2139b0190.mockapi.io/news/${param.id}`)
        .then(res => {
          setNotification(res.data)
        })
    }
    else {
      setNotification(null)
    }
  }, [notDep])

  setTimeout(() => {
    setDep(!dep)
  }, 60000);

  return (
    <div className='show-news'>
      <Link to={"/"}><i className="bi bi-arrow-left news-to-home-icon"></i></Link>
      <div className="show-news-row">
        <div className="show-news-col">
          <h1 className='show-news-title'>All Notifications</h1>
          <ul className="show-news-nots">
            {
              notifications?.map((not) =>
                <li key={not.id} onClick={() => { setNotification(not); navigate(`/notifications/${not.id}`) }}>
                  <div className='show-news-nots-title'>{not.title}</div>
                  <div className='show-news-nots-time'><span>{not.day}</span> <span>{not.date}</span> <span>{not.active ? "edited" : ""}</span></div>
                </li>
              )
            }
          </ul>
        </div>
        <div className="show-news-col">
          <div className="show-news-nots">
            <div className='show-news-not-title'>
              <p>{notification?.title}</p>
            </div>
            <div className='show-news-not-time'>
              <span>{notification?.day}</span>
              <span> {notification?.date}</span>
              <span> {notification?.active ? "edited" : ""}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
