package main

import (
	"database/sql"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	_ "github.com/lib/pq"
)

// ประกาศตัวแปร db ไว้ตรงกลาง (Global) เพื่อให้ไฟล์อื่นเรียกใช้ได้
var db *sql.DB

func main() {
	// 1. เชื่อมต่อ Database (แก้รหัสให้ตรงเครื่องคุณ)
	var err error
	connStr := "postgres://dev_user:123456@localhost:5432/thailand_db?sslmode=disable"
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// 2. Setup Fiber
	app := fiber.New()
	app.Use(cors.New())

	// --- 3. ROUTES (จุดรวมพล) ---
	// เรียกใช้ฟังก์ชันจากไฟล์อื่นได้เลย ไม่ต้อง import เพราะ package เดียวกัน

	// Group: Province
	app.Get("/api/provinces", GetProvinces)
	app.Get("/api/provinces/:id", GetProvinceById) // (Dynamic Route)

	// Group: Member
	app.Get("/api/members", GetMembers)
	app.Post("/api/members", CreateMember)
	app.Put("/api/members/:id", UpdateMember)
	app.Delete("/api/members/:id", DeleteMember)

	// 4. Start Server
	log.Println("Server running on port 3000")
	log.Fatal(app.Listen(":3000"))
}
