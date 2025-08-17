import './App.css'
import { RouterProvider } from 'react-router-dom'
import { createBrowserRouter } from 'react-router-dom'
import Home from './pages/Home.tsx'
import AppLayout from './ui/AppLayout.tsx'
import NovaConsulta from './pages/NovaConsulta.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {index: true, element: <Home />},
      {path: 'nova-consulta', element: <NovaConsulta />}
    ]
  }
])

function App() {
  return <RouterProvider router={router} />
}

export default App
