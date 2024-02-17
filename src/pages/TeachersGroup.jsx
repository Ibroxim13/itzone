import React, { Fragment, useEffect, useState } from 'react'
import axios from 'axios';



export default function TeachersGroup() {
    let localUser = JSON.parse(localStorage.getItem("user"));
    const [countryName, setCountryName] = useState('')
    const [countryCapital, setCountryCapital] = useState('')
    const [value, setValue] = useState(new Date());

    useEffect(() => {
        axios.get('https://ipapi.co/json/')
            .then((response) => {
                let data = response.data;
                setCountryName(data.country_name)
                setCountryCapital(data.country_capital)
            })
        const interval = setInterval(() => setValue(new Date()), 1000);
        return () => {
            clearInterval(interval);
        };
    }, [])

    return (
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
        </Fragment>
    )
}
