import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/homePage'
import ProductPage from './pages/productPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/produtos/:idProduto" element={<ProductPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
