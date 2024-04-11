import './App.css';
import EditorPage from './component/EditorPage';
import Home from './component/Home';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {Toaster} from 'react-hot-toast';

function App() {
  return (
    <>
    <Toaster position='top-center'/>
      <BrowserRouter>

        <Routes>

          <Route path='/' element={<Home />}></Route>
          <Route path='/editor/:roomId' element={<EditorPage />}></Route>

        </Routes>

      </BrowserRouter>
    </>
  );
}

export default App;
