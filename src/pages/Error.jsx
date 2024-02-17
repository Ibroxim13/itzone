import React from 'react'
import { Link } from 'react-router-dom'

export default function Error() {
  return (
    <div className="error-area">
      <div className="error-content">
        <h1>404</h1>
        <p>Page Not Found</p>
        <Link to='/home'><button className='btn'>Go Home</button></Link>
      </div>
    </div>
  )
}
