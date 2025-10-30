// test-db-select.js

// 1. Import connection pool
const db = require('./db'); // *** ตรวจสอบว่ามีไฟล์ db.js อยู่ในโฟลเดอร์นี้ ***

// 2. สร้างฟังก์ชัน async เพื่อดึงข้อมูลตาม logic ของ API GET /my
async function getTestData() {
  console.log('🚀 Attempting to fetch test data (matching API logic)...');

  // 2.5. กำหนด ID ของ User ที่เราต้องการทดสอบ
  const testUserID = 1; // 👈 *** แก้เป็น ID ของ user (EventOrgID) ที่คุณต้องการเทสต์ ***
  
  try {
    // 3. เขียนคำสั่ง SQL SELECT ให้เหมือนกับใน API (GET /my)
    const sql = `
      SELECT * FROM event 
      WHERE EventOrgID = ? 
      AND Status IN ('Draft', 'Pending', 'Approved')
    `;

    // 4. สั่งให้ database ทำงาน
    const [rows] = await db.query(sql, [testUserID]);

    // 5. แสดงผลลัพธ์
    if (rows.length > 0) {
      console.log('✅ Success! Data fetched.');
      console.log(`Found ${rows.length} event(s) for user ID ${testUserID}.`);
      console.table(rows);
    } else {
      console.log(`ℹ️  Query was successful, but no matching events were found for user ID ${testUserID}.`);
    }

  } catch (err) {
    // 6. จัดการกับข้อผิดพลาด
    console.error('❌ Error fetching data:', err.message);
    console.error('Stack Trace:', err.stack);
  } finally {
    // 7. ปิดการเชื่อมต่อทั้งหมดใน pool
    console.log('👋 Closing database connection pool...');
    await db.end();
  }
}

// 8. เรียกฟังก์ชัน
getTestData();
