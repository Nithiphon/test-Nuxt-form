<template>
  <!-- พื้นหลังสวยๆ -->
  <div class="min-vh-auto bg-light py-5">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-md-6 col-lg-8">
          
          <!-- การ์ดฟอร์ม -->
          <div class="card shadow-lg border-0">
            <div class="card-header bg-dark text-white text-center py-4">
              <h1 class="mb-0 fs-3">📝 ฟอร์มลงทะเบียนแข่งขัน</h1>
              <p class="mb-0 mt-2 opacity-75 small">(ทดสอบระบบ)</p>
            </div>
            
            <div class="card-body p-4">
              <form @submit.prevent="submitForm">
                
                <!-- ชื่อ - นามสกุล -->
                <div class="mb-3 fs-5 p-2">
                  <label class="form-label fw-semibold">
                    ชื่อ - นามสกุล 
                    <span class="text-danger">*</span>
                  </label>
                  <input 
                    v-model="formData.fullName" 
                    type="text" 
                    class="form-control form-control-lg fs-6"
                    placeholder="กรอกชื่อ-นามสกุล"
                    required
                  >
                </div>

                <!-- ชื่อเล่น -->
                <div class="mb-3 fs-5 p-2">
                  <label class="form-label fw-semibold">
                    ชื่อเล่น 
                    <span class="text-danger">*</span>
                  </label>
                  <input 
                    v-model="formData.nickname" 
                    type="text" 
                    class="form-control form-control-lg fs-6"
                    placeholder="กรอกชื่อเล่น"
                    required
                  >
                </div>

                <!-- อายุ -->
                <div class="mb-3 fs-5 p-2">
                  <label class="form-label fw-semibold">
                    อายุ 
                    <span class="text-danger">*</span>
                  </label>
                  <input 
                    v-model.number="formData.age" 
                    type="number" 
                    class="form-control form-control-lg fs-6"
                    placeholder="กรอกอายุ"
                    min="1"
                    max="100"
                    required
                  >
                </div>

                <!-- รุ่นที่แข่ง -->
                <div class="row">
                <div class="mb-3 fs-5 ">
                  <label class="form-label fw-semibold">
                    รุ่นที่ต้องการแข่ง 
                    <span class="text-danger">*</span>
                  </label>
                  <div class="bg-light text-dark p-3 rounded fs-6">
                    <div class="form-check mb-2">
                      <input 
                        v-model="formData.ageGroup" 
                        type="radio" 
                        class="form-check-input"
                        id="under18"
                        value="น้อยกว่า 18 ปี"
                        required
                      >
                      <label class="form-check-label" for="under18">
                        น้อยกว่า 18 ปี
                      </label>
                    </div>
                    <div class="form-check">
                      <input 
                        v-model="formData.ageGroup" 
                        type="radio" 
                        class="form-check-input"
                        id="over18"
                        value="มากกว่า 18 ปี"
                        required
                      >
                      <label class="form-check-label " for="over18">
                        มากกว่า 18 ปี
                      </label>
                    </div>
                  </div>
                </div>
                </div>
                <!-- สถานที่ -->
                <div class="mb-4">
                  <label class="form-label fw-semibold">
                    สถานที่ 
                    <span class="text-danger">*</span>
                  </label>
                  <p class="text-muted small mb-2">เลือกสนามในจังหวัดที่ท่านต้องการแข่งขัน</p>
                  <select 
                    v-model="formData.location" 
                    class="form-select form-select-lg fs-6 fw-bold"
                    required
                  >
                    <option value="" disabled>-- เลือกสถานที่ --</option>
                    <option value="อุบลราชธานี">📍 เซ็นทรัลอุบลราชธานี</option>
                    <option value="อำนาจเจริญ">📍 อำนาจเจริญ</option>
                    <option value="นครราชสีมา">📍 เซ็นทรัลนครราชสีมา</option>
                  </select>
                </div>

                <!-- ปุ่มส่งฟอร์ม -->
                <div class="d-grid">
                  <button 
                    type="submit" 
                    class="btn btn-success btn-lg py-3"
                    :disabled="isSubmitting"
                  >
                    <span v-if="isSubmitting">
                      <span class="spinner-border spinner-border-sm me-2"></span>
                      กำลังส่ง...
                    </span>
                    <span v-else class="fw-bold">
                      Submit
                    </span>
                  </button>
                </div>
              </form>

              <!-- ข้อความแจ้งเตือนสำเร็จ -->
              <div 
                v-if="successMessage" 
                class="alert alert-success alert-dismissible fade show mt-4 mb-0"
                role="alert"
              >
                <div class="d-flex align-items-center">
                  <div class="fs-4 me-2">✅</div>
                  <div class="flex-grow-1">
                    <strong>สำเร็จ!</strong> {{ successMessage }}
                  </div>
                </div>
                <button 
                  type="button" 
                  class="btn-close" 
                  @click="successMessage = ''"
                ></button>
              </div>

              <!-- ข้อความแจ้งเตือนผิดพลาด -->
              <div 
                v-if="errorMessage" 
                class="alert alert-danger alert-dismissible fade show mt-4 mb-0"
                role="alert"
              >
                <div class="d-flex align-items-center">
                  <div class="fs-4 me-2">❌</div>
                  <div class="flex-grow-1">
                    <strong>เกิดข้อผิดพลาด!</strong> {{ errorMessage }}
                  </div>
                </div>
                <button 
                  type="button" 
                  class="btn-close" 
                  @click="errorMessage = ''"
                ></button>
              </div>
            </div>

            <!-- Footer การ์ด -->
            <div class="card-footer bg-light text-center text-muted py-3">
              <small>กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง</small>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// โหลด Bootstrap
useHead({
  link: [
    {
      rel: 'stylesheet',
      href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css'
    }
  ],
  script: [
    {
      src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js'
    }
  ]
})

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