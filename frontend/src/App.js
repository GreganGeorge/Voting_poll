import './App.css';
import CompletedPolls from './components/CompletedPolls';
import CreatePoll from './components/CreatePoll';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Polls from './components/Polls';
import {Toaster} from 'react-hot-toast';
import {BrowserRouter,Route,Routes, useLocation} from 'react-router-dom';
function AppContent() {
  const location=useLocation();
  const isLoginPage=location.pathname==='/';
  return (
    <>
    {!isLoginPage && <Navbar/>}
      <Routes>
        <Route exact path='/' element={<Login/>}/>
        <Route exact path='/polls' element={<Polls/>}/>
        <Route exact path='/completedpolls' element={<CompletedPolls/>}/>
        <Route exact path='/createpoll' element={<CreatePoll/>}/>
      </Routes>
    </> 
  );
}

function App(){
  return(
  <BrowserRouter>
  <Toaster/>
    <AppContent/>
  </BrowserRouter>
  );
}

export default App;
