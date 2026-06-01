import axios from 'axios';

// ============================================
// BASE AXIOS CONFIGURATION
// ============================================
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://ai-exam-dev.onrender.com/api';
const API_ROOT_URL = API_BASE_URL.replace('/api', '');

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Crucial for sending cookies/session tokens
});

export { API_ROOT_URL };

// ============================================
// AUTHENTICATION API ENDPOINTS
// ============================================
export const authApi = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  verify: (data) => api.post('/auth/verify', data),
  logout: () => api.post('/auth/logout', {}),
  getMe: () => api.get('/auth/me'),
  getMyAttendance: (params) => api.get('/auth/my-attendance', { params }),
};

// ============================================
// TEACHER API ENDPOINTS
// ============================================
export const teacherApi = {
  getAttendanceList: (date) => api.get(`/teacher/attendance-list?date=${date}`),
  markAttendance: (data) => api.post('/teacher/markAttendance', data),
  getExams: () => api.get('/teacher/get-exam'),
  getStudents: () => api.get('/teacher/students'),
  generateOtp: (examId, studentId) => api.post(`/teacher/generate-otp/${examId}`, { studentId }),
  getResultsStudents: (examId) => api.get(`/teacher/results-students?examId=${examId}`),
  getStudentNotDoneExam: (examId) => api.get(`/teacher/student-notdone-exam?examId=${examId}`),
  deleteStudent: (studentId) => api.delete(`/teacher/student/${studentId}`),
  createPdf: (data) => api.post('/teacher/create-pdf', data),
};

// ============================================
// EXAM API ENDPOINTS
// ============================================
export const examApi = {
  getAllExams: () => api.get('/exams'),
  getExamQuestions: (examId) => api.get(`/exams/questions/${examId}`),
  submitExam: (data) => api.post('/exams/submit-exam', data),
  verifyOtp: (data) => api.post('/exams/verify-otp', data),
  getResult: (examId) => api.get(`/exams/get-result?examId=${examId}`),
  createExam: (data) => api.post('/exams/create', data),
};

export const paymentApi = {
  createOrder: (data) => api.post('/payment/create-order', data),
  verifyPayment: (data) => api.post('/payment/verify-payment', data),
  generateOtp: (data) => api.post('/payment/generate-otp', data),
  getReceipt: (paymentId) => api.get(`/payment/receipt/${paymentId}`),
};

// ============================================
// AI API ENDPOINTS
// ============================================
export const aiApi = {
  createFromPrompt: (data) => api.post('/ai/create-from-prompt', data),
};

// ============================================
// RESULT API ENDPOINTS
// ============================================
export const resultApi = {
  getAllResults: () => api.get('/results'),
};

export default api;
