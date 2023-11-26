import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
function ListaProductoIns({ onChange }) {
  const [productos, setProductos] = useState([]);
  const [selectedProductoId, setSelectedProductoId] = useState('');
 // token
 const token = localStorage.getItem("token");
 // end token
  useEffect(() => {
    obtenerProductos();
  }, []);

  const obtenerProductos = () => {
    axios
      .get(`${API_URL}/producto`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setProductos(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleSeleccionarProducto = (event) => {
    const productoId = event.target.value;
    setSelectedProductoId(productoId);
    onChange(productoId);
  };

  return (
    <select value={selectedProductoId} onChange={handleSeleccionarProducto}>
       <option value="">Seleccionar producto</option>
      {productos.map((producto) => (
        <option key={producto.id} value={producto.id}>
          {producto.nombre}  , S/. {producto.costo} 
        </option>
      ))}
    </select>
  );
}

export default ListaProductoIns;