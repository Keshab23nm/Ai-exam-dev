

import React from 'react'
import { createBrowserRouter } from 'react-router'
import Layout from '../components/Layout'
import ProtectedRoute from '../components/ProtectedRoute'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Verify from '../pages/Verify'
import StudentDashbord from '../pages/StudentDashbord'
import TeacherDashbord from '../pages/TeacherDashbord'
import ExamPage from '../components/exams/ExamPage'

export const routes = createBrowserRouter([
  { 
    path: '/',
    element: <Layout/>,
    children: [   
      {
          path: '/',
          element: <Home/>
      },
      {   
          path: '/login',
          element: <Login/>
      },
      {
          path: '/register',
          element: <Register/>
      },
      {
        path:'/verify',
        element: <Verify/>
      }
    ]
  },
  {
    element: <ProtectedRoute allowedRoles={['student']} />,
    children: [
      {
        path: '/student-dashboard',
        element: <StudentDashbord />
      },
      {
        path: '/exam/:id',
        element: <ExamPage />
      }
    ]
  },
  {
    element: <ProtectedRoute allowedRoles={['teacher']} />,
    children: [
      {
        path: '/teacher-dashboard',
        element: <TeacherDashbord />
      }
    ]
  }
])
    


 

export default routes