import { useState } from 'react'
import './App.css'
import toast, { Toaster } from 'react-hot-toast';
import JoinChatComponent from './components/JoinChatComponent';
function App() {
  const [count, setCount] = useState(0)

  return (
    <JoinChatComponent/>
  )
}

export default App
