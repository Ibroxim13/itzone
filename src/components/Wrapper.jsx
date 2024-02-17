import React, { useRef } from 'react'
import Sidebar from './Sidebar'
import Content from './Content'

export default function Wrapper({ setActive }) {
  const sidebarMenuIcon = useRef();
  const sidebarMenu = useRef();

  return (
    <div className='wrapper'>
      <div className='sidebar' ref={sidebarMenu}>
        <Sidebar setActive={setActive} sidebarMenu={sidebarMenu} />
      </div>
      <main>
        <Content sidebarMenu={sidebarMenu} sidebarMenuIcon={sidebarMenuIcon} />
      </main>
    </div>
  )
}
