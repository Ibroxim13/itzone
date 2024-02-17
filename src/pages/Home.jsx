import React, { useState, useEffect, Fragment } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import Calendar from "react-calendar";
import axios from 'axios';
import Carousel from 'better-react-carousel'
import SpinLoader from '../components/Spin'

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Home() {
  let localUser = JSON.parse(localStorage.getItem("user"));
  const [groups, setGroups] = useState([])
  const [allStudents, setAllStudents] = useState(null)
  const [allCourses, setAllCourses] = useState(null)
  const [allTeachers, setAllTeachers] = useState(null)
  const [allNewStudents, setAllNewStudents] = useState(null)
  const [loading, setLoading] = useState(false)
  const [countryName, setCountryName] = useState('')
  const [countryCapital, setCountryCapital] = useState('')
  const [value, setValue] = useState(new Date());
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    setLoading(true)
    axios.get("https://65af84f32f26c3f2139b0190.mockapi.io/group")
      .then(res => {
        setGroups(res.data);
        res.data.filter(item => {
          setAllStudents(prev => prev + item.students.length)
        })
      })

    axios.get("https://65af84f32f26c3f2139b0190.mockapi.io/courses")
      .then(res => {
        setAllCourses(res.data.length)
      })

    axios("https://65af84f32f26c3f2139b0190.mockapi.io/teacher")
      .then(res => {
        setAllTeachers(res.data.length)
      })

    axios.get("https://65af84f32f26c3f2139b0190.mockapi.io/reception")
      .then(res => {
        setAllNewStudents(res.data.length)
      })

    axios.get('https://ipapi.co/json/')
      .then((response) => {
        let data = response.data;
        setCountryName(data.country_name)
        setCountryCapital(data.country_capital)
        setLoading(false)
      })
    const interval = setInterval(() => setValue(new Date()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, [])

  const data = {
    labels: groups.map(g => g.course_name.name),
    datasets: [
      {
        label: 'Students ',
        data: groups.map(g => g.students.length),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
        ]
      },
    ],
  };

  return (
    <div className="home">
      {
        loading ? <SpinLoader /> :
          <Fragment>
            <div className="home-header">
              <div>
                <h1>Hello, {localUser.name}</h1>
                <span>Hope you have a good day</span>
              </div>
              <div className='current-time'>
                <span>
                  {
                    (value.getHours() < 10 ? "0" + value.getHours() : value.getHours()) + ":" +
                    (value.getMinutes() < 10 ? "0" + value.getMinutes() : value.getMinutes()) + ":" +
                    (value.getSeconds() < 10 ? "0" + value.getSeconds() : value.getSeconds())
                  }
                </span>
                <span>{countryName},{countryCapital}</span>
              </div>
            </div>
            <div className="home-content">
              <div className="home-content-col">
                <div className="home-col-content">
                  <ul className="overview-lists">
                    <li className="overview-list">
                      <i className="bi bi-people-fill overview-icon"></i>
                      <div>
                        <h3 className='overview-title'>All students</h3>
                        <span>{allStudents}</span>
                      </div>
                    </li>
                    <li className="overview-list">
                      <i className="bi bi-person-check-fill overview-icon"></i>
                      <div>
                        <h3 className='overview-title'>New students</h3>
                        <span>{allNewStudents}</span>
                      </div>
                    </li>
                    <li className="overview-list">
                      <i className="bi bi-layers-half overview-icon"></i>
                      <div>
                        <h3 className='overview-title'>All courses</h3>
                        <span>{allCourses}</span>
                      </div>
                    </li>
                    <li className="overview-list">
                      <i className="bi bi-person-vcard-fill overview-icon"></i>
                      <div>
                        <h3 className='overview-title'>All teachers</h3>
                        <span>{allTeachers}</span>
                      </div>
                    </li>
                  </ul>
                  <div className="charts">
                    <div className="charts-col">
                      <div className="charts-col-content">
                        <h3 className='charts-col-content-title'>Our groups</h3>
                        <Pie data={data} />
                      </div>
                    </div>
                    <div className="charts-col">
                      <div className="charts-col-content">
                        <Carousel cols={1}
                          showDots
                          rows={1}
                          gap={10}
                          loop={true}
                          dotColorActive={"#6a6464"}
                          autoplay={4000}
                        >
                          <Carousel.Item>
                            <img width="100%" height="100%" src="https://avatars.mds.yandex.net/i?id=03f3974e5c957b223b4df50af497f30b7890729f-10597937-images-thumbs&n=13" />
                          </Carousel.Item>
                          <Carousel.Item>
                            <img width="100%" height="100%" src="https://avatars.mds.yandex.net/i?id=e82e1bdc1d856595abf1634e8dfc29447958ba09-12496425-images-thumbs&n=13" />
                          </Carousel.Item>
                          <Carousel.Item>
                            <img height="100%" width="100%" src="https://avatars.mds.yandex.net/i?id=70ddac147317be49c00e51ba0afc7ea4f4d74983-4455006-images-thumbs&n=13" />
                          </Carousel.Item>
                        </Carousel>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="home-content-col">
                <div className="home-col-content">
                  <Calendar onChange={date => setDate(date)} value={date} />
                </div>
              </div>
            </div>
          </Fragment>
      }

    </div>
  )
}