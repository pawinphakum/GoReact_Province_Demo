import { Link } from 'react-router-dom'

function Home() {
  const btnStyle = {
    display: "block",
    width: "100%",
    padding: "20px",
    margin: "10px 0",
    fontSize: "1.2rem",
    textAlign: "center",
    textDecoration: "none",
    borderRadius: "10px",
    color: "white",
    fontWeight: "bold"
  }

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", padding: "20px", fontFamily: "sans-serif" }}>
      <h1 style={{ textAlign: "center", color: "#2c3e50" }}>🏠 Home Server Dashboard</h1>
      <p style={{ textAlign: "center", color: "#7f8c8d" }}>เลือกเมนูที่ต้องการใช้งาน</p>

      <div style={{ marginTop: "30px" }}>
        {/* ปุ่มไปหน้าจังหวัด */}
        <Link to="/province" style={{ ...btnStyle, backgroundColor: "#3498db" }}>
           🇹🇭 ดูรายชื่อจังหวัด (Provinces)
        </Link>

        {/* ปุ่มไปหน้าสมาชิก */}
        <Link to="/member" style={{ ...btnStyle, backgroundColor: "#27ae60" }}>
           👥 ระบบจัดการสมาชิก (Members)
        </Link>
      </div>
    </div>
  )
}

export default Home