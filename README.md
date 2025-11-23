### สร้าง .gitignore
```bash
npx gitignore go node
```

### เริ่มเซต หลังบ้าน Go Fiber
```bash
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
cd client
npm install
```