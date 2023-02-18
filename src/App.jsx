import './App.css'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import TodoForm from './pages/TodoForm'
import Profile from './pages/Profile'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="todoform" element={<TodoForm />} />
        <Route path="profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  )
  
}

export default App
