import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function Member() {
  const [members, setMembers] = useState([])
  
  // สถานะสำหรับโหมดแก้ไข (ถ้าเป็น null คือโหมดสร้างใหม่, ถ้ามีเลขคือโหมดแก้ไข ID นั้น)
  const [editId, setEditId] = useState(null)

  const [formData, setFormData] = useState({ 
    username: '', password: '', first_name: '', last_name: '', 
    phone: '', address_line1: '', sub_district: '', district: '', 
    province: '', zip_code: '' 
  })

  useEffect(() => { fetchMembers() }, [])

  const fetchMembers = () => {
    fetch('http://localhost:3000/api/members')
      .then(res => res.json())
      .then(data => setMembers(data))
  }

  // ฟังก์ชันล้างฟอร์มให้ว่าง
  const resetForm = () => {
      setFormData({ 
        username: '', password: '', first_name: '', last_name: '', 
        phone: '', address_line1: '', sub_district: '', district: '', 
        province: '', zip_code: '' 
      })
      setEditId(null) // กลับสู่โหมดสร้างใหม่
  }

  // --- 1. Logic การบันทึก (Create + Update) ---
  const handleSubmit = (e) => {
    e.preventDefault()
    
    // ถ้า editId เป็น null -> ใช้ POST (สร้าง)
    // ถ้า editId มีค่า -> ใช้ PUT (แก้ไข)
    const method = editId ? 'PUT' : 'POST'
    const url = editId 
        ? `http://localhost:3000/api/members/${editId}` // แก้ไขคนนี้
        : 'http://localhost:3000/api/members'           // สร้างใหม่

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    }).then(res => res.json()).then(data => {
      if(data.status === 'success') { 
          alert(editId ? 'อัปเดตข้อมูลเรียบร้อย!' : 'บันทึกสำเร็จ!')
          fetchMembers() // ดึงข้อมูลใหม่
          resetForm()    // ล้างฟอร์ม
      }
    })
  }

  // --- 2. Logic การแก้ไข (ดึงข้อมูลขึ้นฟอร์ม) ---
  const handleEdit = (member) => {
      setEditId(member.id) // จำไว้ว่ากำลังแก้คนนี้
      setFormData({        // เอาข้อมูลเก่ามายัดใส่ฟอร์ม
          username: member.username,
          password: member.password, // (จริงๆ ไม่ควรส่ง password กลับมา แต่เพื่อความง่ายในการ update ไปก่อน)
          first_name: member.first_name,
          last_name: member.last_name,
          phone: member.phone,
          address_line1: member.address_line1,
          sub_district: member.sub_district,
          district: member.district,
          province: member.province,
          zip_code: member.zip_code
      })
      // เลื่อนหน้าจอขึ้นไปหาฟอร์ม (UX)
      window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // --- 3. Logic การลบ ---
  const handleDelete = (id) => {
      if(!confirm('ยืนยันที่จะลบสมาชิกคนนี้?')) return

      fetch(`http://localhost:3000/api/members/${id}`, {
          method: 'DELETE'
      }).then(res => res.json()).then(data => {
          if(data.status === 'success') {
              fetchMembers() // รีเฟรชตาราง
              // ถ้าลบคนที่กำลังแก้อยู่ ให้ล้างฟอร์มด้วย
              if (editId === id) resetForm()
          }
      })
  }

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  // Styles
  const inputStyle = { padding: '10px', margin: '5px 0', width: '100%', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }
  const btnEditStyle = { backgroundColor: '#f39c12', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' }
  const btnDeleteStyle = { backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }

  return (
    <div style={{ width: "95%", maxWidth: "1200px", margin: "0 auto", padding: "20px", fontFamily: "sans-serif" }}>
      <Link to="/" style={{ textDecoration: "none", color: "#666" }}>← กลับหน้าหลัก</Link>
      
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h1>👥 ระบบสมาชิก</h1>
        {editId && (
            <button onClick={resetForm} style={{backgroundColor:'#95a5a6', color:'white', border:'none', padding:'10px', borderRadius:'5px', cursor:'pointer'}}>
                ยกเลิกการแก้ไข
            </button>
        )}
      </div>

      {/* Form Container */}
      <div style={{ backgroundColor: editId ? "#fff3cd" : "#f9f9f9", padding: "20px", borderRadius: "8px", border: editId ? "2px solid #f39c12" : "1px solid #ddd", transition: "0.3s" }}>
        <h3 style={{marginTop:0}}>{editId ? `✏️ กำลังแก้ไข ID: ${editId}` : '📝 เพิ่มสมาชิกใหม่'}</h3>
        
        <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <input name="username" placeholder="Username" value={formData.username} onChange={handleChange} style={inputStyle} required />
            <input name="password" type="password" placeholder="Password (ต้องกรอกใหม่เมื่อแก้ไข)" value={formData.password} onChange={handleChange} style={inputStyle} required />
            <input name="first_name" placeholder="ชื่อ" value={formData.first_name} onChange={handleChange} style={inputStyle} />
            <input name="last_name" placeholder="นามสกุล" value={formData.last_name} onChange={handleChange} style={inputStyle} />
            <input name="phone" placeholder="เบอร์โทร" value={formData.phone} onChange={handleChange} style={inputStyle} />
            
            <div style={{gridColumn: "span 2", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: "5px"}}>
                <input name="address_line1" placeholder="ที่อยู่" value={formData.address_line1} onChange={handleChange} style={inputStyle} />
                <input name="sub_district" placeholder="ตำบล" value={formData.sub_district} onChange={handleChange} style={inputStyle} />
                <input name="district" placeholder="อำเภอ" value={formData.district} onChange={handleChange} style={inputStyle} />
                <input name="province" placeholder="จังหวัด" value={formData.province} onChange={handleChange} style={inputStyle} />
                <input name="zip_code" placeholder="รหัสปณ." value={formData.zip_code} onChange={handleChange} style={inputStyle} />
            </div>

            <button type="submit" style={{ 
                gridColumn: "span 2", 
                padding: "10px", 
                backgroundColor: editId ? "#f39c12" : "#27ae60", 
                color: "white", 
                border: "none", 
                fontWeight: "bold",
                borderRadius: "5px",
                cursor: "pointer"
            }}>
                {editId ? 'บันทึกการแก้ไข (Update)' : 'เพิ่มสมาชิกใหม่ (Create)'}
            </button>
        </form>
      </div>

      {/* Table */}
      <h3 style={{marginTop:"30px"}}>รายชื่อ ({members.length})</h3>
      <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "white", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
        <thead style={{backgroundColor: "#34495e", color: "white"}}>
            <tr>
                <th style={{padding:"10px", textAlign:"left"}}>ID</th>
                <th style={{padding:"10px", textAlign:"left"}}>User</th>
                <th style={{padding:"10px", textAlign:"left"}}>ชื่อ-สกุล</th>
                <th style={{padding:"10px", textAlign:"left"}}>ที่อยู่</th>
                <th style={{padding:"10px", textAlign:"center"}}>จัดการ</th>
            </tr>
        </thead>
        <tbody>
          {members.map(m => (
            <tr key={m.id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{padding:"10px"}}>{m.id}</td>
              <td style={{padding:"10px", fontWeight:"bold", color:"#2980b9"}}>{m.username}</td>
              <td style={{padding:"10px"}}>{m.first_name} {m.last_name}<br/><small>{m.formatted_phone}</small></td>
              <td style={{padding:"10px"}}>{m.province} {m.zip_code}</td>
              <td style={{padding:"10px", textAlign:"center"}}>
                  <button onClick={() => handleEdit(m)} style={btnEditStyle}>แก้ไข</button>
                  <button onClick={() => handleDelete(m.id)} style={btnDeleteStyle}>ลบ</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{height: "50px"}}></div>
    </div>
  )
}

export default Member