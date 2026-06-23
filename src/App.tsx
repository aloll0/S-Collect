import { Routes, Route } from 'react-router-dom';
import AppLayout from './pages/AppLayout.js';
import Dashboard from './pages/Dashboard.js';
import Products from './pages/Products.js';
import Inventory from './pages/Inventory.js';
import Settings from './pages/Settings.js';
import Management from './pages/Mangement.js';
import AddProduct from './pages/AddProduct.js';
import { Toaster } from 'react-hot-toast';
import NotFound from './pages/NotFound.js';
import './App.css';

function App() {
  return (
    <>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/management" element={<Management />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1f2937',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: 'green',
              secondary: 'white',
            },
          },
        }}
      />
    </>
  );
}

export default App;
