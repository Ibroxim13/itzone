import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { successMessagge } from '../Notifications/successNot';
import { errorMessage } from '../Notifications/errorNot';

export default function FormModalNews({ modal, modalContent, hideModal, setDep, editedNews, setEditedNews }) {
    const day = useRef();
    const newsText = useRef();
    const [EditedNewsDate, setEditedNewsdate] = useState(null)

    useEffect(() => {
        if (editedNews) {
            newsText.current.value = editedNews.title;
            day.current.value = editedNews.day;
            setEditedNewsdate(editedNews.date);
            day.current.disabled = true;
        }
    }, [editedNews])

    const addNews = e => {
        e.preventDefault()
        let date = new Date()
        let newNews = {
            title: newsText.current.value,
            date: (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":" +
                (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()),
            day: day.current.value,
            active: false,
        }

        {
            editedNews === null ?
                axios.post("https://65af84f32f26c3f2139b0190.mockapi.io/news", newNews, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                    .then(() => {
                        setDep(prev => !prev)
                        modal.current.classList.remove("show-modal-form")
                        e.target.reset()
                        successMessagge("Posted new news")
                    })
                    .catch(error => errorMessage(error.message))
                :
                axios.put(`https://65af84f32f26c3f2139b0190.mockapi.io/news/${editedNews.id}`, { ...newNews, active: true, date: EditedNewsDate }, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                    .then(() => {
                        setDep(prev => !prev)
                        modal.current.classList.remove("show-modal-form")
                        e.target.reset()
                        successMessagge("Updated news")
                    })
                    .catch(error => errorMessage(error.message))
        }

    }

    return (
        <div ref={modal} onClick={e => hideModal(e)} className='modal-form'>
            <div ref={modalContent} className="modal-form-content">
                <div className="close-modal-icon"><i className="bi bi-x-circle modal-close-icon"></i></div>
                <h1 className='modal-title'>{editedNews ? "Updating" : "Adding"} News</h1>
                <form onSubmit={(e) => addNews(e)} className="modal-forms">
                    <input ref={day} type="date" disabled={false} />
                    <textarea ref={newsText} className='news-text' cols={3} required placeholder='Write news'></textarea>
                    <div className='form-add-btn-box'><button type='submit' className='add-btn-modal'>{editedNews ? "Update" : "Add"}</button></div>
                </form>
            </div>
        </div>
    )
}
