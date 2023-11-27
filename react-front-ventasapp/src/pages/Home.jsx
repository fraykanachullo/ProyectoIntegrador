// Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../component/admin/AppLayout';
import axios from 'axios';


const Home = () => {
  const [clientesCount, setClientesCount] = useState(0);
  const [productosCount, setProductosCount] = useState(0);
  const [categoriasCount, setCategoriasCount] = useState(0);
  const [ventasCount, setVentasCount] = useState(0);

  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientesResponse = await axios.get('http://microservicio-clientes/api/clientes/count');
        setClientesCount(clientesResponse.data.count);

        const productosResponse = await axios.get('http://microservicio-productos/api/productos/count');
        setProductosCount(productosResponse.data.count);

        const categoriasResponse = await axios.get('http://microservicio-categorias/api/categorias/count');
        setCategoriasCount(categoriasResponse.data.count);

        const ventasResponse = await axios.get('http://microservicio-ventas/api/ventas/count');
        setVentasCount(ventasResponse.data.count);
      } catch (error) {
        console.error('Error al obtener datos de los microservicios:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <AppLayout>
      <div className="container mx-auto mt-10">
        <h1 className="text-3xl font-bold mb-6">Bienvenido al Dashboard</h1>

        <div className="grid grid-cols-2 gap-4">
          <DashboardLink to="/clientes" color="blue" count={clientesCount}>
            Clientes
          </DashboardLink>
          <DashboardLink to="/productos" color="green" count={productosCount}>
            Productos
          </DashboardLink>
          <DashboardLink to="/categorias" color="yellow" count={categoriasCount}>
            Categorías
          </DashboardLink>
          <DashboardLink to="/ventas" color="red" count={ventasCount}>
            Ventas
          </DashboardLink>
        </div>
      </div>
    </AppLayout>
  );
};

const DashboardLink = ({ to, color, children, count }) => (
  <Link to={to} className={`bg-${color}-500 text-white p-4 rounded-md hover:bg-${color}-600 transition`}>
    <div>
      <div className="text-lg font-semibold">{children}</div>
      <div className="text-sm text-gray-500">Total: {count}</div>
    </div>
  </Link>
);

export default Home;