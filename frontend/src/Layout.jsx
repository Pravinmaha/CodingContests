import React from 'react'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div style={{width: "100vw", height: "100vh", background:"rgb(0, 0, 0)"}}>
        <Outlet />
    </div>
  )
}

export default Layout
