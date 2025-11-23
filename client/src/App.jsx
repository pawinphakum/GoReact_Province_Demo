import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Province from './pages/Province'
import ProvinceDetail from './pages/ProvinceDetail'
import Member from './pages/Member'

function App() {
  return (
    <BrowserRouter>
      {/* ตรงนี้คือกำหนดเส้นทาง */}
      <Routes>
        {/* เข้ามาหน้าแรก (/) ให้ไปโชว์ไฟล์ Home */}
        <Route path="/" element={<Home />} />
        
        {/* เข้า /province ให้ไปโชว์ไฟล์ Province */}
        <Route path="/province" element={<Province />} />
        <Route path="/province/:id" element={<ProvinceDetail />} />
        
        {/* เข้า /member ให้ไปโชว์ไฟล์ Member */}
        <Route path="/member" element={<Member />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App