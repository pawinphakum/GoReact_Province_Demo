package main

import (
	"database/sql"
	"fmt"

	"github.com/gofiber/fiber/v2"
)

// Struct ของสมาชิก
// json:"field_name" คือการตั้งชื่อ field เวลาส่งข้อมูลแบบ JSON ต้องตั้งให้ตรงกับที่ React ต้องการ
type Member struct {
	Id             int    `json:"id"`
	Username       string `json:"username"`
	Password       string `json:"password"`
	FirstName      string `json:"first_name"`
	LastName       string `json:"last_name"`
	AddressLine1   string `json:"address_line1"`
	SubDistrict    string `json:"sub_district"`
	District       string `json:"district"`
	Province       string `json:"province"`
	ZipCode        string `json:"zip_code"`
	Phone          string `json:"phone"`
	FormattedPhone string `json:"formatted_phone"`
}

// 1. สร้าง Struct สำหรับการตอบกลับ (Response)
// สังเกตบรรทัด Province: มันไม่ใช่ string แล้ว แต่มันคือ Struct Province ทั้งก้อน!
type MemberResponse struct {
	Id             int    `json:"id"`
	Username       string `json:"username"`
	FirstName      string `json:"first_name"`
	LastName       string `json:"last_name"`
	Phone          string `json:"phone"`
	FormattedPhone string `json:"formatted_phone"`

	// นี่คือพระเอกของงาน 1:n
	Province Province `json:"province"`
}

// Helper Function (ใช้เฉพาะในไฟล์นี้ไม่ต้องตัวใหญ่ก็ได้ แต่ตั้งไว้ก็ดี)
func FormatPhoneNumber(phone string) string {
	if len(phone) == 10 {
		return fmt.Sprintf("%s-%s-%s", phone[0:2], phone[2:6], phone[6:10])
	}
	return phone
}

// --- Handler Functions ---

// 2. แก้ฟังก์ชันดึงข้อมูล (GET) ให้ใช้ JOIN
func GetMembers(c *fiber.Ctx) error {
	// SQL JOIN: ดึงข้อมูลสมาชิก + ข้อมูลจังหวัด มาพร้อมกัน
	// COALESCE คือการกันเหนียว: ถ้า province_id เป็น null ให้แสดงเป็นค่าว่าง/0 แทน
	sqlQuery := `
		SELECT 
			m.id, m.username, m.first_name, m.last_name, m.phone,
			p.id, p.name_th, p.name_en, p.abbr_th, p.abbr_en
		FROM members m
		LEFT JOIN provinces p ON m.province_id = p.id
		ORDER BY m.id DESC
	`

	rows, err := db.Query(sqlQuery)
	if err != nil {
		return c.Status(500).SendString(err.Error())
	}
	defer rows.Close()

	var members []MemberResponse // ใช้ Struct ตัวใหม่ที่เราสร้าง

	for rows.Next() {
		var m MemberResponse

		// ตัวแปรสำหรับรับค่าที่อาจจะเป็น Null (Database เรื่องมากนิดนึงครับ)
		var pId sql.NullInt64
		var pNameTh, pNameEn, pAbbrTh, pAbbrEn sql.NullString

		// Scan ยาวๆ ทีเดียวทั้งตารางสมาชิก และ ตารางจังหวัด
		if err := rows.Scan(
			&m.Id, &m.Username, &m.FirstName, &m.LastName, &m.Phone, // ส่วน Member
			&pId, &pNameTh, &pNameEn, &pAbbrTh, &pAbbrEn, // ส่วน Province
		); err != nil {
			return c.Status(500).SendString(err.Error())
		}

		// แปลงค่า Null ให้เป็นค่าปกติ ก่อนยัดใส่ Struct
		if pId.Valid {
			m.Province.Id = int(pId.Int64)
			m.Province.NameTh = pNameTh.String
			m.Province.NameEn = pNameEn.String
			m.Province.AbbrTh = pAbbrTh.String
			m.Province.AbbrEn = pAbbrEn.String
		}

		m.FormattedPhone = FormatPhoneNumber(m.Phone)
		members = append(members, m)
	}
	return c.JSON(members)
}

func CreateMember(c *fiber.Ctx) error {
	m := new(Member)
	if err := c.BodyParser(m); err != nil {
		return c.Status(400).SendString(err.Error())
	}

	sqlStatement := `
		INSERT INTO members (username, password, first_name, last_name, address_line1, sub_district, district, province, zip_code, phone)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
		RETURNING id`

	id := 0
	err := db.QueryRow(sqlStatement,
		m.Username, m.Password, m.FirstName, m.LastName,
		m.AddressLine1, m.SubDistrict, m.District, m.Province, m.ZipCode, m.Phone).Scan(&id)

	if err != nil {
		return c.Status(500).SendString(err.Error())
	}

	return c.JSON(fiber.Map{"status": "success", "message": "User created!", "id": id})
}

// ฟังก์ชันแก้ไขข้อมูลสมาชิก (UPDATE)
func UpdateMember(c *fiber.Ctx) error {
	id := c.Params("id") // รับ id จาก URL
	m := new(Member)

	// แปลง JSON ที่ส่งมาใส่ตัวแปร m
	if err := c.BodyParser(m); err != nil {
		return c.Status(400).SendString(err.Error())
	}

	// SQL Update
	sqlStatement := `
        UPDATE members
        SET username=$1, password=$2, first_name=$3, last_name=$4, phone=$5, 
            address_line1=$6, sub_district=$7, district=$8, province=$9, zip_code=$10
        WHERE id=$11`

	// สั่งรัน SQL
	_, err := db.Exec(sqlStatement,
		m.Username, m.Password, m.FirstName, m.LastName, m.Phone,
		m.AddressLine1, m.SubDistrict, m.District, m.Province, m.ZipCode,
		id) // ตัวสุดท้ายคือ id

	if err != nil {
		return c.Status(500).SendString(err.Error())
	}

	return c.JSON(fiber.Map{"status": "success", "message": "User updated!"})
}

// ฟังก์ชันลบสมาชิก (DELETE)
func DeleteMember(c *fiber.Ctx) error {
	id := c.Params("id")

	// SQL Delete
	_, err := db.Exec("DELETE FROM members WHERE id = $1", id)
	if err != nil {
		return c.Status(500).SendString(err.Error())
	}

	return c.JSON(fiber.Map{"status": "success", "message": "User deleted!"})
}
