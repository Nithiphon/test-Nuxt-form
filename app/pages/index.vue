<template>
  <div class="container">
    <div class="form-card">
      <h1>📝 ฟอร์มลงทะเบียนแข่งขัน</h1>
      
      <form @submit.prevent="submitForm">
        <!-- ชื่อ -->
        <div class="form-group">
          <label>ชื่อ - นามสกุล <span class="required">*</span></label>
          <input 
            v-model="formData.fullName" 
            type="text" 
            placeholder="กรอกชื่อ-นามสกุล"
            required
          >
        </div>

        <!-- ชื่อเล่น -->
        <div class="form-group">
          <label>ชื่อเล่น <span class="required">*</span></label>
          <input 
            v-model="formData.nickname" 
            type="text" 
            placeholder="กรอกชื่อเล่น"
            required
          >
        </div>

        <!-- อายุ -->
        <div class="form-group">
          <label>อายุ <span class="required">*</span></label>
          <input 
            v-model.number="formData.age" 
            type="number" 
            placeholder="กรอกอายุ"
            min="1"
            max="100"
            required
          >
        </div>

        <!-- รุ่นที่แข่ง -->
        <div class="form-group">
          <label>รุ่นที่จะแข่ง <span class="required">*</span></label>
          <div class="radio-group">
            <label class="radio-label">
              <input 
                v-model="formData.ageGroup" 
                type="radio" 
                value="น้อยกว่า 18 ปี"
                required
              >
              <span>น้อยกว่า 18 ปี</span>
            </label>
            <label class="radio-label">
              <input 
                v-model="formData.ageGroup" 
                type="radio" 
                value="มากกว่า 18 ปี"
                required
              >
              <span>มากกว่า 18 ปี</span>
            </label>
          </div>
        </div>

        <!-- สถานที่ -->
        <div class="form-group">
          <label>สถานที่(เลือกสนามในจังหวัดที่ท่านต้องการแข่งขัน) <span class="required">*</span></label>
          <select v-model="formData.location" required>
            <option value="" disabled>เลือกสถานที่</option>
            <option value="อุบลราชธานี">เซ็นทรัลอุบลราชธานี</option>
            <option value="อำนาจเจริญ">อำนาจเจริญ</option>
            <option value="นครราชสีมา">เซ็นทรัลนครราชสีมา</option>
          </select>
        </div>

        <!-- ปุ่มส่งฟอร์ม -->
        <button type="submit" class="submit-btn" :disabled="isSubmitting">
          {{ isSubmitting ? 'กำลังส่ง...' : 'ส่งฟอร์ม' }}
        </button>
      </form>

      <!-- ข้อความแจ้งเตือน -->
      <div v-if="successMessage" class="success-message">
        ✅ {{ successMessage }}
      </div>
      <div v-if="errorMessage" class="error-message">
        ❌ {{ errorMessage }}
      </div>
    </div>

    <!-- แสดงรายการผู้สมัคร -->
    <div class="registrants-card">
      <h2>👥 รายชื่อผู้สมัครทั้งหมด ({{ registrants.length }})</h2>
      
      <div v-if="loading" class="loading">
        กำลังโหลดข้อมูล...
      </div>

      <div v-else-if="registrants.length === 0" class="empty">
        ยังไม่มีผู้สมัคร
      </div>

      <div v-else class="registrant-list">
        <div 
          v-for="person in registrants" 
          :key="person.id" 
          class="registrant-item"
        >
          <div class="registrant-info">
            <h3>{{ person.fullName }} ({{ person.nickname }})</h3>
            <div class="details">
              <span class="badge">อายุ {{ person.age }} ปี</span>
              <span class="badge">(แข่งในรุ่น) {{ person.ageGroup }}</span>
              <span class="badge location">📍 {{ person.location }}</span>
            </div>
            <small>ลงทะเบียนเมื่อ: {{ formatDate(person.timestamp) }}</small>
          </div>
          <button 
            @click="deleteRegistrant(person.id)" 
            class="delete-btn"
          >
            ลบ
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore'

const { $db } = useNuxtApp()

// ข้อมูลฟอร์ม
const formData = ref({
  fullName: '',
  nickname: '',
  age: null,
  ageGroup: '',
  location: ''
})

const isSubmitting = ref(false)
const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const registrants = ref([])

// ล้างข้อความแจ้งเตือน
const clearMessages = () => {
  successMessage.value = ''
  errorMessage.value = ''
}

// ดึงข้อมูล
const fetchRegistrants = async () => {
  loading.value = true
  try {
    const q = query(collection($db, 'registrations'), orderBy('timestamp', 'desc'))
    const querySnapshot = await getDocs(q)
    
    registrants.value = []
    querySnapshot.forEach((docSnap) => {
      registrants.value.push({
        id: docSnap.id,
        ...docSnap.data()
      })
    })
  } catch (error) {
    console.error('เกิดข้อผิดพลาด:', error)
  } finally {
    loading.value = false
  }
}

// ส่งฟอร์ม
const submitForm = async () => {
  clearMessages()
  isSubmitting.value = true

  try {
    await addDoc(collection($db, 'registrations'), {
      ...formData.value,
      timestamp: Date.now()
    })

    successMessage.value = `ลงทะเบียนสำเร็จ! ขอบคุณคุณ ${formData.value.nickname}`
    
    // ล้างฟอร์ม
    formData.value = {
      fullName: '',
      nickname: '',
      age: null,
      ageGroup: '',
      location: ''
    }

    // โหลดข้อมูลใหม่
    await fetchRegistrants()

    // ซ่อนข้อความหลัง 3 วินาที
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)

  } catch (error) {
    console.error('เกิดข้อผิดพลาด:', error)
    errorMessage.value = 'ไม่สามารถส่งฟอร์มได้ กรุณาลองใหม่อีกครั้ง'
  } finally {
    isSubmitting.value = false
  }
}

// ลบข้อมูล
const deleteRegistrant = async (id) => {
  if (!confirm('คุณต้องการลบข้อมูลนี้ใช่หรือไม่?')) return

  try {
    await deleteDoc(doc($db, 'registrations', id))
    successMessage.value = 'ลบข้อมูลสำเร็จ'
    await fetchRegistrants()
    
    setTimeout(() => {
      successMessage.value = ''
    }, 2000)
  } catch (error) {
    console.error('เกิดข้อผิดพลาด:', error)
    errorMessage.value = 'ไม่สามารถลบข้อมูลได้'
  }
}

// แปลงวันที่
const formatDate = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// โหลดข้อมูลเมื่อเริ่มต้น
onMounted(() => {
  fetchRegistrants()
})
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 30px auto;
  padding: 20px;
}

.form-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin-bottom: 30px;
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
  font-size: 28px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #34495e;
  font-weight: 500;
}

.required {
  color: #e74c3c;
}

input[type="text"],
input[type="number"],
select {
  width: 100%;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
}

input[type="text"]:focus,
input[type="number"]:focus,
select:focus {
  outline: none;
  border-color: #3498db;
}

.radio-group {
  display: flex;
  gap: 20px;
  margin-top: 10px;
}

.radio-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 10px 15px;
  border: 2px solid #ddd;
  border-radius: 8px;
  transition: all 0.3s;
}

.radio-label:hover {
  border-color: #3498db;
  background: #f8f9fa;
}

.radio-label input[type="radio"] {
  margin-right: 8px;
  cursor: pointer;
}

.submit-btn {
  width: 100%;
  padding: 15px;
  background: #27ae60;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 10px;
}

.submit-btn:hover:not(:disabled) {
  background: #229954;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(39, 174, 96, 0.3);
}

.submit-btn:disabled {
  background: #95a5a6;
  cursor: not-allowed;
}

.success-message,
.error-message {
  margin-top: 20px;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  font-weight: 500;
  animation: slideDown 0.3s ease;
}

.success-message {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.error-message {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.registrants-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.registrants-card h2 {
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 24px;
}

.loading,
.empty {
  text-align: center;
  padding: 40px;
  color: #95a5a6;
  font-size: 18px;
}

.registrant-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.registrant-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #3498db;
  transition: all 0.3s;
}

.registrant-item:hover {
  transform: translateX(5px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.registrant-info {
  flex: 1;
}

.registrant-info h3 {
  margin: 0 0 10px 0;
  color: #2c3e50;
  font-size: 18px;
}

.details {
  display: flex;
  gap: 10px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.badge {
  padding: 4px 12px;
  background: #e8f4f8;
  color: #2980b9;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}

.badge.location {
  background: #fef5e7;
  color: #d68910;
}

.registrant-info small {
  color: #7f8c8d;
  font-size: 13px;
}

.delete-btn {
  padding: 8px 16px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
}

.delete-btn:hover {
  background: #c0392b;
}

/* Responsive */
@media (max-width: 600px) {
  .container {
    padding: 10px;
  }

  .form-card,
  .registrants-card {
    padding: 20px;
  }

  .radio-group {
    flex-direction: column;
    gap: 10px;
  }

  .registrant-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .delete-btn {
    align-self: flex-end;
  }
}
</style>