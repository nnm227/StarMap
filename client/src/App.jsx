import {Routes, Route, BrowserRouter} from 'react-router-dom'
import './styles/App.css'
import Layout from './Layout'
import Map from './pages/Map'
import NoMatch from './pages/NoMatch'
import Home from './pages/Home'
import Login from './components/auth/Login'
import Register from './components/auth/Register'


function App() {
  return(
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Layout/>}>
        <Route index element={<Home/>} />
        <Route path='/map' element={<Map/>}/>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='*' element={<NoMatch/>}/>
      </Route>
    </Routes>
    </BrowserRouter>
  )

}

export default App
