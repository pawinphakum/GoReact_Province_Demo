import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom' // เรียก useParams

function ProvinceDetail() {
  const { id } = useParams() // ดึงค่า id จาก URL (เช่น /province/5 -> id=5)
  const [province, setProvince] = useState(null) // เริ่มต้นเป็น null (ยังไม่มีของ)

  useEffect(() => {
    // ยิงไปหา API เส้นใหม่ที่เราเพิ่งทำ
    fetch(`http://localhost:3000/api/provinces/${id}`)
      .then(res => {
          if (!res.ok) throw new Error("Not Found")
          return res.json()
      })
      .then(data => setProvince(data))
      .catch(err => console.error(err))
  }, [id]) // ใส่ [id] แปลว่า "ถ้า id เปลี่ยน ให้ดึงใหม่นะ" (Safety ไว้ก่อน)

  if (!province) return <div style={{padding: "20px"}}>กำลังโหลด...</div>

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", padding: "20px", border: "1px solid #ddd", borderRadius: "10px", fontFamily: "sans-serif", textAlign: "center" }}>
      <Link to="/province" style={{ textDecoration: "none", color: "#888", display: "block", marginBottom: "20px" }}>← กลับหน้ารวม</Link>
      
      <h1 style={{ fontSize: "3rem", color: "#2c3e50", margin: "10px 0" }}>{province.name_th}</h1>
      <h2 style={{ color: "#7f8c8d", marginTop: 0 }}>{province.name_en}</h2>
      
      <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "30px" }}>
        <div style={{ padding: "20px", backgroundColor: "#ecf0f1", borderRadius: "10px" }}>
            <div style={{ fontSize: "0.9rem", color: "#555" }}>อักษรย่อไทย</div>
            <div style={{ fontSize: "2rem", fontWeight: "bold" }}>{province.abbr_th}</div>
        </div>
        <div style={{ padding: "20px", backgroundColor: "#3498db", borderRadius: "10px", color: "white" }}>
            <div style={{ fontSize: "0.9rem", opacity: 0.8 }}>Code (EN)</div>
            <div style={{ fontSize: "2rem", fontWeight: "bold" }}>{province.abbr_en}</div>
        </div>
      </div>
    </div>
  )
}

export default ProvinceDetail