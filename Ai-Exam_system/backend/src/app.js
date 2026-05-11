import express from 'express';
import cors from 'cors';
import authRoutes from './router/auth.Routes.js';
import testRoutes from './router/test.Routes.js';
import teacherRoutes from "./router/teacher.Routes.js";
import examRoutes from "./router/exam.Routes.js";
import aiRoutses from "./router/ai.routes.js";
import paymentRoutes from "./router/payment.Routes.js";
import path from "path";


import cookies from 'cookie-parser';
const app = express();
// app.use((req, res, next) => {
//   console.log(`${req.method} ${req.url}`);
//   next();
// });
app.use(cors({
  origin: function (origin, callback) {
    const allowed = ["http://localhost:5173", "http://localhost:5174",'http://localhost:80',"http://localhost:3000"];
    if (!origin || allowed.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  credentials: true,
  optionsSuccessStatus: 200
}));
app.use(express.json());
app.use(cookies());

app.use('/receipts', express.static(path.join(process.cwd(), 'public', 'receipts')));

app.use('/api/auth', authRoutes);
app.use('/api/test', testRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/ai", aiRoutses);
app.use("/api/payment", paymentRoutes);
export default app;