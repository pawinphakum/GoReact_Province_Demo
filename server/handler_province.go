package main

import (
	"database/sql"

	"github.com/gofiber/fiber/v2"
)

// Struct ของจังหวัด
type Province struct {
	Id     int    `json:"id"`
	NameTh string `json:"name_th"`
	NameEn string `json:"name_en"`
	AbbrTh string `json:"abbr_th"`
	AbbrEn string `json:"abbr_en"`
}

// ฟังก์ชันดึงจังหวัด (ย้ายมาจาก main เดิม)
func GetProvinces(c *fiber.Ctx) error {
	// เรียกใช้ db ตัวใหญ่จาก main.go ได้เลย
	rows, err := db.Query("SELECT id, name_th, name_en, abbr_th, abbr_en FROM provinces ORDER BY id ASC")
	if err != nil {
		return c.Status(500).SendString(err.Error())
	}
	defer rows.Close()

	var provinces []Province
	for rows.Next() {
		var p Province
		if err := rows.Scan(&p.Id, &p.NameTh, &p.NameEn, &p.AbbrTh, &p.AbbrEn); err != nil {
			return c.Status(500).SendString(err.Error())
		}
		provinces = append(provinces, p)
	}

	return c.JSON(provinces)
}

func GetProvinceById(c *fiber.Ctx) error {
	id := c.Params("id") // รับค่า id จาก URL (เช่น /api/provinces/1)

	var p Province

	// Query แบบมีเงื่อนไข WHERE id = $1
	row := db.QueryRow("SELECT id, name_th, name_en, abbr_th, abbr_en FROM provinces WHERE id = $1", id)

	// Scan ข้อมูลแถวเดียว
	err := row.Scan(&p.Id, &p.NameTh, &p.NameEn, &p.AbbrTh, &p.AbbrEn)
	if err != nil {
		// ถ้าหาไม่เจอ หรือ Error
		if err == sql.ErrNoRows {
			return c.Status(404).JSON(fiber.Map{"error": "Province not found"})
		}
		return c.Status(500).SendString(err.Error())
	}

	return c.JSON(p)
}
