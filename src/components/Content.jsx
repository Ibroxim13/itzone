import React, { Fragment } from 'react'
import Navbar from './Navbar'
import ContentPages from './ContentPages'
export default function Content(props) {
  return (
    <Fragment>
      <Navbar sidebarMenu={props.sidebarMenu} sidebarMenuIcon={props.sidebarMenuIcon} />
      <ContentPages />
    </Fragment>
  )
}
