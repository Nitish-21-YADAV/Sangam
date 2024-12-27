import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import {BrowserRouter,Router,Routes,Route} from 'react-router-dom'
import './App.css'
import LandingPage from './pages/LandingPage'
import SignUp from './pages/SignUp'
import LoginUp from './pages/LoginUp'
import {toast,ToastContainer } from 'react-toastify';
import 'react-toastify/ReactToastify.css';
import VideoMeetComponent from './pages/VideoMeet'
import Home from './pages/Home'
import History from './pages/History'
import Summary from './pages/Summary'
import Features from './pages/Features'
import AboutPage from './pages/About'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
      <ToastContainer/>
        <Routes>

          <Route path='/' element={<Summary/>}/>
          <Route path='/SignUp' element={<SignUp/>}/>
          <Route path='/LoginUp' element={<LoginUp/>}/>
          <Route path='/:url' element={<VideoMeetComponent/>}/>
          <Route path='/home' element={<Home/>}/>
          <Route path='/history' element={<History/>}/>
        </Routes>
          
      </BrowserRouter>    
       
    </>
  ) 
}
 

export default App
 