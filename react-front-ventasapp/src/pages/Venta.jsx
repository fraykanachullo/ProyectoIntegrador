import axios from "axios";
import ExcelJS from 'exceljs';
import { useState, useEffect } from "react";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import css from '../styles/add.css';
import Modal from "../component/Modal";
import AppLayout from '../component/admin/AppLayout';
import LisClienteIns from "../component/cliente_list_venta";
import ListaProductoIns from "../component/producto_list_venta";

const Ventas = () => {

  // token
  const token = localStorage.getItem("token");
  // end token

  // paginacion
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredVentas, setFilteredVentas] = useState([]);

  const getCurrentItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredVentas.slice(startIndex, endIndex);
  };
  // end paginacion
  // modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  // end modal

  const API_URL = "http://localhost:9090";
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [ventas, setVentas] = useState([]);
  const [detalle, setDetalle] = useState([]);
  //fracmento de paginacion
  const totalPages = Math.ceil(ventas.length / itemsPerPage);
  const hasNextPage = () => {
    return currentPage < totalPages && ventas.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage).length > 0;
  };
  // end fracmento de paginacion


  const [ventaEditado, setVentaEditado] = useState({
    id: null,
    serie: "",
    numero: "",
    codigo: "",
    clienteId: "",
    detalle: [],
  });




  const NombreProductoInscripcion = ({ productoId }) => {
    const [nombreProducto, setNombreProducto] = useState('');
  
    const [costoProducto, setCostoProducto] = useState('');

    useEffect(() => {
      axios
        .get(`${API_URL}/producto/${productoId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const producto = response.data;
          setNombreProducto(producto.nombre);
   
          setCostoProducto(producto.costo);
        })
        .catch((error) => {
          console.log(error);
          setNombreProducto('');
          setCostoProducto('');
        });
    }, [productoId]);

    return (
      <>

        <div class="flex-initial px-2 py-1" key={detalle.id}>
          <div className="">
          <h6 class="mb-0 text-sm leading-normal dark:text-white">S/. {costoProducto}</h6>
           <h6 class="mb-0 text-sm leading-normal dark:text-white">{nombreProducto}</h6>
          </div>

        </div>
      </>
    );
  };


  const getVentas = () => {
    axios
      .get(`${API_URL}/venta`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const ventas = response.data;

        const sortedVentas = ventas.sort((a, b) => b.id - a.id);
        setVentas(sortedVentas);

        const filtered = ventas.filter((venta) => {
          const nombreCompleto = `${venta.serie}`;
          return nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase());
        });
        setFilteredVentas(filtered);

        // Obtener los nombres de los alumnos para cada Venta
        const userPromises = filtered.map((venta) => {
          return axios.get(`${API_URL}/cliente/${venta.clienteId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        });


        axios
          .all(userPromises)
          .then((responses) => {
            // Mapear los nombres de los horarios a las Ventas correspondientes
            const ventasConClientes = filtered.map((venta, index) => {
              const nombreCliente = responses[index].data.nombre;
              return { ...venta, nombreCliente };
            });

            setFilteredVentas(ventasConClientes);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };


  useEffect(() => {
    getVentas();
  }, []);


  const crearVenta = async (event) => {
    event.preventDefault();
    if (
      !ventaEditado.serie ||
      !ventaEditado.numero ||
      !ventaEditado.codigo ||
      !ventaEditado.clienteId ||
      !Array.isArray(ventaEditado.detalle) ||
      ventaEditado.detalle.length === 0 ||
      ventaEditado.detalle.some(
        (detalle) => !detalle.productoId 
        // ||detalle.costo === ""
      )
    ) {
      console.log('Error de validación en los datos de la venta');
      console.log('ventaEditado:', ventaEditado);
      return;
    }

    try {
      // Crear la nueva venta
      const nuevaVenta = {
        serie: ventaEditado.serie,
        numero: ventaEditado.numero,
        codigo: ventaEditado.codigo,
        clienteId: ventaEditado.clienteId,
        detalle: ventaEditado.detalle.map((detalle) => ({
          productoId: detalle.productoId,
         // costo: detalle.costo,
        })),
      };

      console.log('Nueva venta:', nuevaVenta);

      // Realizar la solicitud POST para crear la venta utilizando axios
      const response = await axios.post(`${API_URL}/venta`, nuevaVenta, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Respuesta de creación de venta:', response.data);

      setVentaEditado({
        id: null,
        serie: "",
        numero: "",
        codigo: "",
        clienteId: "",
        detalle: [],
      });

      getVentas();
      closeModal()
    } catch (error) {
      console.log('Error al crear la venta:', error);
    }
  };


  const editarVenta = (id) => {
    const venta = ventas.find((p) => p.id === id);
    setVentaEditado({
      id: venta.id,
      serie: venta.serie,
      numero: venta.numero,
      codigo: venta.codigo,
      clienteId: venta.clienteId,
      detalle: venta.detalle

    });
    openModal()
  }



  const actualizarVenta = async (event) => {
    event.preventDefault();

    try {

      const ventaActualizado = {
        id: ventaEditado.id,
        serie: ventaEditado.serie,
        numero: ventaEditado.numero,
        codigo: ventaEditado.codigo,
        clienteId: ventaEditado.clienteId,
        detalle: ventaEditado.detalle.map((detalle) => ({
          productoId: detalle.productoId,
          // costo: detalle.costo,
        })),
      };


      const response = await axios.put(
        `${API_URL}/venta`,
        ventaActualizado,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      getVentas();
      closeModal()
      setVentaEditado({
        id: null,
        serie: "",
        numero: "",
        codigo: "",
        clienteId: "",
        detalle: [],
      });
    } catch (error) {
      console.log(error);
    }
  };

  const eliminarVenta = (id) => {
    axios
      .delete(`${API_URL}/venta/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      .then((response) => {
        getVentas();
      })
      .catch((error) => {
        console.log(error);
      });
  }


  const contenidoModal = (


    <div className="px-6 py-6 mx-2 mt-2 mb-2 text-left bg-white   shadow-slate-400 shadow-md">
      <div className="flex justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-20 h-20 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M12 14l9-5-9-5-9 5 9 5z" />
          <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-center">{ventaEditado.id ? 'Editar Venta' : 'Crear Venta'}</h2>
      <form onSubmit={ventaEditado.id ? actualizarVenta : crearVenta}>
        <div className="mt-4">

          <div className="ml-1">
            <label className="block">Serie</label>
            <input
              value={ventaEditado.serie}
              onChange={(event) =>
                setVentaEditado({
                  ...ventaEditado,
                  serie: event.target.value,
                })
              }
              type="text"
              placeholder="serie"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
          <div className="ml-1">
            <label className="block">Numero</label>
            <input
              value={ventaEditado.numero}
              onChange={(event) =>
                setVentaEditado({
                  ...ventaEditado,
                  numero: event.target.value,
                })
              }
              type="text"
              placeholder="numero"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
          <div className="ml-1">
            <label className="block">Descripcion</label>
            <input
              value={ventaEditado.codigo}
              onChange={(event) =>
                setVentaEditado({
                  ...ventaEditado,
                  codigo: event.target.value,
                })
              }
              type="text"
              placeholder="serie"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div className="ml-1 pt-2">
            <label className="block">Cliente</label>
            <LisClienteIns
              onChange={(clienteId) =>
                setVentaEditado({
                  ...ventaEditado,
                  clienteId: clienteId, // Actualizar la propiedad horario con un objeto
                })
              }
              selectedClienteId={ventaEditado.clienteId} // Pasar el ID del ALUMNO seleccionado
              VentaEditado={ventaEditado}
              setVentaEditado={setVentaEditado}
            />
          </div>
          <div className="ml-1 pt-2">
            <label className="block">Producto</label>
            <ListaProductoIns
              onChange={(productoId, checked) => {
                const updatedDetalle = ventaEditado.detalle.map((detalle) => {
                  if (detalle.productoId === productoId) {
                    return { ...detalle };
                  }
                  return detalle;
                });
                if (!updatedDetalle.some((detalle) => detalle.productoId === productoId)) {
                  updatedDetalle.push({ productoId: productoId });
                }
                setVentaEditado({ ...ventaEditado, detalle: updatedDetalle });
              }}
              selectedProductoId={ventaEditado.detalle.map((detalle) => detalle.productoId)}
              VentaEditado={ventaEditado}
              setVentaEditado={setVentaEditado}
            />
          </div>

          <div className="flex  flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-t-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50">
            <button
              type="button"
              onClick={closeModal}
              className="ml-1 text-red-800  font-bold inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs uppercase leading-normal shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
            >
              Close
            </button>

            <div
              type="button"
              className="ml-1 text-blue-700 font-bold inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs uppercase leading-normal shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
            >
              {ventaEditado.id ? (
                <button onClick={actualizarVenta} >Actualizar</button>
              ) : (
                <button onClick={crearVenta} >Crear </button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );

  const currentItems = getCurrentItems();
  return (

    <AppLayout>
      <div className="">
        <Modal className="w-1/3 mx-auto" isOpen={isModalOpen} onRequestClose={closeModal}>
          {contenidoModal}
        </Modal>

        <div class="flex flex-wrap -mx-3">
          <div class="flex-none w-full max-w-full px-3">
            <div class=" flex flex-col min-w-0 mb-6 break-words bg-white border-0 border-transparent border-solid shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border">
              <div class="p-6 pb-0 mb-0 border-b-0 border-b-solid rounded-t-2xl border-b-transparent">
                <h6 class="dark:text-white font-bold">Lista De Ventas</h6>
              </div>
              <div class="flex-auto px-0 pt-0 pb-2">
                <div class="p-0 overflow-x-auto ps">

                  <nav class=" flex flex-wrap items-center justify-between px-0 py-2 mx-6 transition-all shadow-none duration-250 ease-soft-in rounded-2xl lg:flex-nowrap lg:justify-start" >
                    <div class="flex  items-center justify-between w-full px-4 py-1 mx-auto flex-wrap-inherit ">
                      <nav className=" flex ">
                       
                        <div class="mb-0 font-bold capitalize m-2">
                          {/* <button className="" onClick={() => setModalIsOpen(true)} >
                          <div className=" text-white h-10 rounded-md hover:bg-orange-500 duration-300  p-2 text-center bg-orange-700">Agregar</div>
                        </button> */}
                          <button type="button" className="" onClick={openModal}>
                            <div className="text-white h-10 rounded-md hover:bg-orange-500 duration-300 p-2 text-center bg-orange-700">Agregar</div>
                          </button>
                        </div>
                      </nav>
                      <div class="flex   items-center mt-2 grow sm:mt-0 sm:mr-16 md:mr-0 lg:flex  lg:basis-auto">
                        <div class="flex items-center md:ml-auto md:pr-4">
                          <div class="relative flex flex-wrap items-stretch w-full transition-all rounded-lg ease-soft">
                            <span class="text-sm ease-soft absolute leading-5.6  z-50 -ml-px flex h-full items-center whitespace-nowrap rounded-lg rounded-tr-none rounded-br-none border border-r-0 border-transparent bg-transparent py-2 px-2.5 text-center font-normal text-slate-500 transition-all">
                              <button onClick={getVentas} >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  class="h-4 w-4 ">
                                  <path
                                    fill-rule="evenodd"
                                    d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                                    clip-rule="evenodd" />
                                </svg>
                              </button>
                            </span>
                            <input
                              className="p-8  text-sm focus:shadow-soft-primary-outline ease-soft w-1/100 leading-5.6 relative -ml-px block min-w-0 flex-auto rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 pr-3 text-gray-700 transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none focus:transition-shadow"
                              type="text"
                              id="searchInput"
                              value={searchTerm}
                              onChange={(event) => setSearchTerm(event.target.value)}
                              placeholder="Buscar"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </nav>
                  <table class="items-center w-full mb-0 align-top border-collapse dark:border-white/40 text-slate-500">
                    <thead class="align-bottom">
                      <tr>
                        <th class="px-6 py-3 font-bold text-left uppercase align-middle bg-transparent border-b border-collapse shadow-none dark:border-white/40 dark:text-white text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 ">ID</th>
                        <th class="px-6 py-3 font-bold text-left uppercase align-middle bg-transparent border-b border-collapse shadow-none dark:border-white/40 dark:text-white text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 ">serie</th>
                        <th class="px-6 py-3 font-bold text-left uppercase align-middle bg-transparent border-b border-collapse shadow-none dark:border-white/40 dark:text-white text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 ">Numero</th>
                        <th class="px-6 py-3 pl-2 font-bold text-left uppercase align-middle bg-transparent border-b border-collapse shadow-none dark:border-white/40 dark:text-white text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 ">Descripccion</th>
                        <th class="px-6 py-3 pl-2 font-bold text-left uppercase align-middle bg-transparent border-b border-collapse shadow-none dark:border-white/40 dark:text-white text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 ">Cliente</th>
                        <th class="px-6 py-3 pl-2 font-bold text-left uppercase align-middle bg-transparent border-b border-collapse shadow-none dark:border-white/40 dark:text-white text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 ">producto</th>
                        <th class="px-6 py-3 font-bold text-center uppercase align-middle bg-transparent border-b border-collapse shadow-none dark:border-white/40 dark:text-white text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 ">Creado</th>
                        <th class="px-6 py-3 font-bold text-center uppercase align-middle bg-transparent border-b border-collapse shadow-none dark:border-white/40 dark:text-white text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 ">Actualizado</th>
                        <th class="px-6 py-3 font-semibold capitalize align-middle bg-transparent border-b border-collapse border-solid shadow-none dark:border-white/40 dark:text-white tracking-none whitespace-nowrap text-slate-400 opacity-70"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((venta) => (
                        <tr key={venta.id}>
                          <td class="p-2 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent">
                            <div class="flex px-2 py-1">
                              <div class="flex flex-col justify-center">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-500 text-white">
                                  {venta.id}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td class="pl-4 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent">
                            <div class="flex px-2 py-1">
                              <div class="flex flex-col justify-center">
                                <span className=" inline-flex text-md leading-5 font-semibold   text-slate-400">
                                  {venta.serie}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td class="pl-4 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent">
                            <div class="flex px-2 py-1">
                              <div class="flex flex-col justify-center">
                                <span className=" inline-flex text-md leading-5 font-semibold   text-slate-400">
                                  {venta.numero}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td class=" align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent">
                            <div class="flex px-2 py-1">
                              <div class="flex flex-col justify-center">
                                <span className=" inline-flex text-md leading-5 font-semibold   text-slate-400">
                                  {venta.codigo}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td class=" align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent">
                            <div class="flex px-2 py-1">
                              <div class="flex flex-col justify-center">
                                <span className=" inline-flex text-md leading-5 font-semibold   text-slate-400">
                                  {venta.nombreCliente}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td class="p-2 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent">
                            {venta.detalle.map((detalle) => (
                              <div class="flex px-2 py-1" key={detalle.id}>
                                <div className="w-28">
                                  <NombreProductoInscripcion productoId={detalle.productoId} />
                                </div>
                                <div class="flex pl-10 flex-col justify-center">
                                  <p class="mb-0 text-xs leading-tight dark:text-white dark:opacity-80 text-slate-400">
                                    {/* <span className={detalle.status === 0 ? 'bg-red-600 rounded p-1 text-white' : 'bg-green-500 rounded p-1 text-white'}>
                                      {detalle.status === 0 ? 'FALTO' : 'ASISTIO'}
                                    </span> */}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </td>

                          <td class="p-2 text-center align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent">
                            <span class="text-xs font-semibold leading-tight dark:text-white dark:opacity-80 text-slate-400">{venta.created_at}</span>
                          </td>
                          <td class="p-2 text-center align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent">
                            <span class="text-xs font-semibold leading-tight dark:text-white dark:opacity-80 text-slate-400">{venta.updated_at}</span>
                          </td>
                          <td class=" sticky right-0 p-2 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent">
                            {/* <div class="ml-auto text-right"> */}
                            <div className=" m-1 btns inline-block px-4 py-3 mb-0 font-bold text-center uppercase align-middle transition-all bg-transparent border-0 rounded-lg shadow-none cursor-pointer leading-pro text-xs ease-soft-in bg-150 hover:scale-102 active:opacity-85 bg-x-25">
                              <button onClick={() => eliminarVenta(venta.id)} >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-red-400 ">
                                  <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                              </button>
                            </div>
                            <a class="btns inline-block px-4 py-3 mb-0 font-bold text-center uppercase align-middle transition-all bg-transparent border-0 rounded-lg shadow-none cursor-pointer leading-pro text-xs ease-soft-in bg-150 hover:scale-102 active:opacity-85 bg-x-25 ">
                              <button onClick={() => editarVenta(venta.id)} >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-slate-400">
                                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                                </svg>
                              </button>
                            </a>
                            {/* </div> */}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {/* paginacion */}
                  <div className="  left-0 flex mt-4 text-blue-700 font-bold  rounded bg-primary px-6 pb-2 pt-2.5 text-xs uppercase leading-normal shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]">
                    <div className="">
                      <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="text-green-500 font-bold inline-block rounded bg-primary  px-6 pb-2 pt-2.5 text-xs uppercase leading-normal shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"

                      ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 9l-3 3m0 0l3 3m-3-3h7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Anterior</button>
                      <span className=" p-2 font-semibold  text-blue-700  inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs uppercase leading-normal shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]">{` ${currentPage} DE ${totalPages}`}</span>
                      <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentItems.length < itemsPerPage || !hasNextPage()}
                        className="text-blue-700 font-bold inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs uppercase leading-normal shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"

                      ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Siguiente</button>
                    </div>
                    <div>


                    </div>
                   

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default Ventas;

