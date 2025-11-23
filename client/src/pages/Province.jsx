import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function Province() {
  const [provinces, setProvinces] = useState([])

  useEffect(() => {
    fetch('http://localhost:3000/api/provinces')
      .then(res => res.json())
      .then(data => setProvinces(data))
  }, [])

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px", fontFamily: "sans-serif" }}>
      <Link to="/" style={{ textDecoration: "none", color: "#666" }}>← กลับหน้าหลัก</Link>
      <h1 style={{ textAlign: "center" }}>🇹🇭 รายชื่อจังหวัด</h1>
      
      <div style={{ display: "grid", gap: "10px" }}>
        {provinces.map((p) => (
          <Link to={`/province/${p.id}`} key={p.id} style={{ textDecoration: "none", color: "inherit" }}>
            <div key={p.id} style={{ display: "flex", justifyContent: "space-between", padding: "15px", border: "1px solid #ddd", borderRadius: "8px" }}>
              <div>
                <strong>{p.name_th}</strong> <small style={{color:"#777"}}>({p.name_en})</small>
              </div>
              <div>
                <span style={{ marginRight: "5px", padding: "3px 8px", backgroundColor: "#eee", borderRadius: "4px" }}>{p.abbr_th}</span>
                <span style={{ padding: "3px 8px", backgroundColor: "#3498db", color: "white", borderRadius: "4px" }}>{p.abbr_en}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Province