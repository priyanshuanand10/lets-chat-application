import React from 'react'
import { Route, Routes } from 'react-router'
import App from '../App'
import ChatRoom from '../components/ChatRoom'

export default function CustomRoutes() {
  return (
    <Routes>
    <Route path='/' element={<App />}/>
    <Route path='/chat-room' element={<ChatRoom/>}/>
    <Route path='*' element={<h1>404 Page not Found</h1>}/>
  </Routes>
  )
}
