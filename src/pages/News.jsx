import axios from 'axios'
import React, { useEffect, useState, useRef } from 'react'
import SpinLoader from '../components/Spin'
import FormModalNews from '../components/FormModalNews'

export default function News() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(false)
  const [editedNews, setEditedNews] = useState(null)
  const [dep, setDep] = useState(false)
  const modal = useRef()
  const modalContent = useRef()

  useEffect(() => {
    setLoading(true)
    axios.get('https://65af84f32f26c3f2139b0190.mockapi.io/news')
      .then(res => {
        setNews(res.data)
        setLoading(false)
      })
  }, [dep])

  const showModal = () => {
    modal.current.classList.add("show-modal-form")
  }

  const hideModal = e => {
    if (e.target.classList.contains("modal-form") ||
      e.target.classList.contains("modal-close-icon")) {
      document.querySelector(".modal-forms").reset()
      modal.current.classList.remove("show-modal-form")
    }
  }

  const removeNews = id => {
    axios.delete(`https://65af84f32f26c3f2139b0190.mockapi.io/news/${id}`)
      .then(() => {
        setDep(!dep)
      })
  }

  const editNews = obj => {
    setEditedNews(obj)
    showModal()
  }

  return (
    <div className='news'>
      <div className="content-header">
        <h1>News</h1>
        <button onClick={showModal}>Add</button>
      </div>
      <div className='news-content'>
        {
          loading ? <SpinLoader height="calc(100vh - 181px)" /> :
            news.map(mes =>
              <div key={mes.id} className="alert">
                <div>
                  <div className='alert-title'>{mes.title}</div>
                  <div className='alert-time'>{mes.day} {mes.date} {mes.active ? <span>edited</span> : ""}</div>
                </div>
                <div>
                  <div className='action-btns'>
                    <span onClick={() => removeNews(mes.id)} className='remove-icon'><i className="bi bi-trash3"></i></span>
                    <span onClick={() => editNews(mes)} className='edit-icon'><i className="bi bi-pen"></i></span>
                  </div>
                </div>
              </div >
            )
        }
      </div>
      <FormModalNews
        modal={modal}
        modalContent={modalContent}
        hideModal={hideModal}
        setDep={setDep}
        editedNews={editedNews}
        setEditedNews={setEditedNews}
      />
    </div >
  )
}
