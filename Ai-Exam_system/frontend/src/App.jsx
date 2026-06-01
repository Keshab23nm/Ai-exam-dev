 import React from 'react'
import { RouterProvider } from 'react-router';
import { routes } from './routes/routes.jsx';
import NetworkStatus from './components/NetworkStatus.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

 const App = () => {
  
   return (
    <AuthProvider>
      <NetworkStatus />
      <RouterProvider router={routes} />
    </AuthProvider>
   )
 }
 
 export default App