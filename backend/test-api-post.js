// test-api-post.js
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

// ตัวอย่าง token (ใส่ token จริงของผู้ใช้ที่ authenticate แล้ว)
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhdmF2ZW5zQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzYxODE4MzgwLCJleHAiOjE3NjE5MDQ3ODB9.VZv3uOP-jhc6_XM9jm6Ih_Txch5VCODArkf94lhcgSM";

// ฟังก์ชันทดสอบการยิง API POST
async function testCreateEvent() {
  try {
    const form = new FormData();

    // ใส่ข้อมูลที่ต้องการทดสอบ
    form.append("title", "Test Event from Script");
    form.append("startDateTime", "2025-11-01 10:00:00");
    form.append("endDateTime", "2025-11-01 12:00:00");
    form.append("location", "Main Hall");
    form.append("maxParticipant", 50);
    form.append("maxStaff", 10);
    form.append("eventInfo", "This is a test event created via test script");
    form.append("status", "Draft");

    // ถ้ามีรูปทดสอบ
    if (fs.existsSync("./test.jpg")) {
      form.append("image", fs.createReadStream("./test.jpg"));
    }

    // ส่ง request ไปยัง API
    const res = await axios.post("http://localhost:3000/api/events/create", form, {
      headers: {
        Authorization: `Bearer ${token}`,
        ...form.getHeaders(),
      },
    });

    console.log("✅ Response:");
    console.log(res.data);
  } catch (err) {
    console.error("❌ Error posting event:");
    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Data:", err.response.data);
    } else {
      console.error(err.message);
    }
  }
}

testCreateEvent();
