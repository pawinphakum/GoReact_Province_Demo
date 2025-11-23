### สร้าง .gitignore
```bash
npx gitignore go node
```

### เริ่มเซต หลังบ้าน Go Fiber
```bash
# ออกมาที่ root ก่อน
md server                           # สร้าง Folder server ก่อน
cd server                           # เข้าไปทำงานใน server
go mod init myserver                # สร้างบัตรประชาชนโปรเจกต์
go get github.com/gofiber/fiber/v2  # ติดตั้ง Fiber
go get github.com/lib/pq            # ติดตั้ง Driver PostgreSQL
```

### เริ่มเซต หน้าบ้าน React Vite
```bash
# ออกมาที่ root ก่อน
npm create vite@latest client -- --template react
# คำสั่งนี้จะ md client / npm install / npm run dev เสร็จสรรพ

npm install react-router-dom
```

### Start Backend
```bash
cd server
go run main.go

# หรือ run ทุกไฟล์
go run .
```

### Start Frontend
```bash
cd client
npm run dev
```

### โครงสร้าง Backend
```
server/  
├── main.go               <-- พระเอก: มีหน้าที่แค่ เชื่อม DB และบอกทาง (Routes)  
├── handler_province.go   <-- ผู้ช่วย 1: ดูแลเรื่องจังหวัด  
└── handler_member.go     <-- ผู้ช่วย 2: ดูแลเรื่องสมาชิก  
```

### โครงสร้าง Frontend
```
client/  
├── src/  
│   ├── pages/             <-- สร้างโฟลเดอร์นี้  
│   │   ├── Home.jsx       <-- หน้า Landing Page  
│   │   ├── Province.jsx   <-- หน้าจังหวัด  
│   │   └── Member.jsx     <-- หน้าสมาชิก  
│   ├── App.jsx            <-- ตัวคุมเกม  
│   └── main.jsx  
```