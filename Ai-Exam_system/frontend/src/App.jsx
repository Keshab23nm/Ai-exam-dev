 import React from 'react'
import { RouterProvider } from 'react-router';
import { routes } from './routes/routes.jsx';
import NetworkStatus from './components/NetworkStatus.jsx';

 const App = () => {
  
   return (
    <>
      <NetworkStatus />
      <RouterProvider router={routes} />
    </>
   )
 }
 
 export default App