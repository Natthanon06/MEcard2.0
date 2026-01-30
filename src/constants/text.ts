// src/constants/text.ts

export type LangType = "th" | "en";

export const TEXT = {
  // --- Common ---
  confirmDelete: { th: "ต้องการลบนามบัตรใบนี้ใช่หรือไม่?", en: "Are you sure you want to delete this card?" },
  loading: { th: "กำลังโหลด...", en: "Loading..." },

  // --- Navbar ---
  nav_home: { th: "หน้าหลัก", en: "Home" },
  nav_login: { th: "เข้าสู่ระบบ", en: "Login" },
  nav_logout: { th: "ออกจากระบบ", en: "Logout" },
  nav_profile: { th: "หน้าโปรไฟล์", en: "Profile" },
  nav_exchange: { th: "แลกเปลี่ยน", en: "Exchange" },
  nav_create: { th: "สร้างนามบัตรฟรี +", en: "Create Free +" },
  nav_logged_in_as: { th: "เข้าสู่ระบบเป็น", en: "Logged in as" },
  nav_logout_confirm: { th: "ต้องการออกจากระบบใช่หรือไม่?", en: "Are you sure you want to logout?" },

  // --- Landing Page ---
  hero_tag: { th: " นามบัตรดิจิทัลยุคใหม่", en: " Next-Gen Digital Card" },
  hero_desc: { th: "เปลี่ยนนามบัตรกระดาษเดิมๆ เป็นลิงก์เดียวที่รวมทุกตัวตนของคุณ แชร์ง่ายผ่าน QR Code ไม่ต้องโหลดแอป", en: "Replace paper cards with a single link showcasing your identity. Easily share via QR Code, no app required." },
  btn_start: { th: "เริ่มสร้างเลย  ", en: "Get Started  " },
  btn_mycard: { th: "ดูนามบัตรของฉัน", en: "My Cards" },
  footer_rights: { th: "© 2025 MEcard. สงวนลิขสิทธิ์.", en: "© 2025 MEcard. All rights reserved." },
  footer_privacy: { th: "นโยบายความเป็นส่วนตัว", en: "Privacy Policy" },
  footer_terms: { th: "เงื่อนไขการใช้งาน", en: "Terms of Service" },

  // --- Exchange Page ---
  exchange_header: { th: "MEcard Exchange", en: "MEcard Exchange" },
  tab_myqr: { th: "QR ของฉัน", en: "My QR" },
  tab_inbox: { th: "กระเป๋านามบัตร", en: "Inbox" },
  mode_work: { th: "ติดต่องาน", en: "Work" },
  mode_party: { th: "ปาร์ตี้", en: "Party" },
  card_position_party: { th: "Let's Hangout! 🍻", en: "Let's Hangout! 🍻" },
  scan_hint_work: { th: "สแกนเพื่อรับข้อมูลติดต่องาน", en: "Scan for work contact info" },
  scan_hint_party: { th: "สแกนเพื่อรับ Social Media (โหมดปาร์ตี้)", en: "Scan for Social Media (Party Mode)" },
  select_card_label: { th: "เลือกนามบัตรที่จะส่ง:", en: "Select card to share:" },
  no_card_title: { th: "คุณยังไม่มีนามบัตร", en: "No cards available" },
  no_card_link: { th: "สร้างนามบัตรก่อน", en: "Create a card first" },
  empty_inbox_title: { th: "ยังไม่มีนามบัตรในกระเป๋า", en: "Inbox is empty" },
  empty_inbox_desc: { th: "ไปสแกนเลย", en: "Scan QR" },
  btn_scan: { th: "สแกน", en: "Scan" },
  
  // Share Buttons (ที่เคยแดง)
  btn_share: { th: "แชร์ผ่าน Bluetooth / AirDrop", en: "Share via Bluetooth / AirDrop" },
  hint_share: { th: "กดปุ่มเพื่อเปิดเมนูแชร์ของเครื่อง", en: "Tap to open native sharing options" },
  share_text_prefix: { th: "นี่คือนามบัตรดิจิทัลของฉัน", en: "Here is my digital business card" },
  copy_link_success: { th: "คัดลอกลิงก์เรียบร้อย!", en: "Link copied to clipboard!" },

  // --- Profile Page ---
  profile_member: { th: "สมาชิก (Member)", en: "Member" },
  profile_total_cards: { th: "นามบัตรทั้งหมด", en: "Total Cards" },
  profile_collection: { th: "คลังนามบัตรของฉัน", en: "My Card Collection" },
  profile_create_new: { th: "+ สร้างใบใหม่", en: "Create New +" },
  profile_no_card: { th: "ยังไม่มีนามบัตรที่บันทึกไว้", en: "No saved cards yet" },
  profile_create_first: { th: "ไปสร้างนามบัตรใบแรกกันเถอะ", en: "Let's create your first card!" },
  profile_created_at: { th: "สร้างเมื่อ:", en: "Created on:" },
  
  // Status Labels
  status_online: { th: "ว่าง / ออนไลน์", en: "Online" },
  status_busy: { th: "ไม่ว่าง / ยุ่ง", en: "Busy" },
  status_meeting: { th: "ประชุมอยู่", en: "In Meeting" },
  status_offline: { th: "ออฟไลน์", en: "Offline" },

  // --- Create Page (Steps) ---
  create_header_step1: { th: "1. เลือกสไตล์", en: "1. Choose Style" },
  create_desc_step1: { th: "ธีมที่สะท้อนความเป็นคุณ", en: "Pick a theme that represents you" },
  
  create_header_step2: { th: "2. ช่องทางติดต่อ", en: "2. Select Platforms" },
  create_desc_step2: { th: "คุณใช้อะไรบ้าง?", en: "What platforms do you use?" },
  
  create_header_step3: { th: "3. ใส่ข้อมูลลิ้งค์", en: "3. Fill Links" },
  create_desc_step3: { th: "กรอก ID หรือ URL ของคุณ", en: "Enter your username or URL" },
  
  create_header_step4: { th: "4. ข้อมูลส่วนตัว", en: "4. Profile Info" },
  create_desc_step4: { th: "อัปโหลดรูปและใส่ชื่อ", en: "Upload photo and enter name" },

  create_header_step5: { th: "5. ตรวจสอบ", en: "5. Preview" },
  create_desc_step5: { th: "นามบัตรของคุณพร้อมแล้ว!", en: "Your card is ready!" },

  btn_next: { th: "ถัดไป →", en: "Next →" },
  btn_back: { th: "←", en: "←" },
  btn_save: { th: "บันทึกนามบัตร ", en: "Save Card " },
  
  alert_incomplete: { th: "ข้อมูลไม่ครบถ้วน กรุณาย้อนกลับไปแก้ไข", en: "Incomplete data. Please go back and edit." },
  alert_login_save: { th: "กรุณาเข้าสู่ระบบก่อนบันทึก", en: "Please login before saving." },
  alert_success: { th: "✅ สร้างนามบัตรเรียบร้อย!", en: "✅ Card created successfully!" },

  // Platform Labels
  plat_phone: { th: "เบอร์โทรศัพท์", en: "Phone" },
  plat_email: { th: "อีเมล", en: "Email" },
  plat_facebook: { th: "Facebook", en: "Facebook" },
  plat_instagram: { th: "Instagram", en: "Instagram" },
  plat_line: { th: "LINE", en: "LINE" },
  plat_tiktok: { th: "TikTok", en: "TikTok" },
  plat_website: { th: "เว็บไซต์", en: "Website" },
  
  // Placeholders
  ph_phone: { th: "081-234-5678", en: "081-234-5678" },
  ph_email: { th: "name@example.com", en: "name@example.com" },
  ph_fb: { th: "Facebook URL / Username", en: "Facebook URL / Username" },
  ph_ig: { th: "Instagram Username", en: "Instagram Username" },
  ph_line: { th: "LINE ID", en: "LINE ID" },
  ph_tiktok: { th: "TikTok Username", en: "TikTok Username" },
  ph_web: { th: "www.yoursite.com", en: "www.yoursite.com" },
  
  default_name: { th: "ชื่อของคุณ", en: "Your Name" },
  default_bio: { th: "คำแนะนำตัว", en: "Your Bio" },

  // Profile Form Labels (ที่เคยแดงในหน้า Create)
  label_fullname: { th: "ชื่อที่ใช้แสดง", en: "Display Name" },
  placeholder_fullname: { th: "เช่น สมชาย ใจดี", en: "e.g. John Doe" },
  label_position: { th: "คำอธิบาย / ตำแหน่ง", en: "Bio / Position" },
  placeholder_position: { th: "เช่น Digital Creator...", en: "e.g. Digital Creator..." },
};