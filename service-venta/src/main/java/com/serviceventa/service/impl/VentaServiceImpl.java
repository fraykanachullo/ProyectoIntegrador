package com.serviceventa.service.impl;

import com.quispcs.serviceventa.entity.Detalle;
import com.quispcs.serviceventa.entity.Venta;
import com.quispcs.serviceventa.feign.ClienteFeign;
import com.quispcs.serviceventa.feign.ProductoFeign;
import com.quispcs.serviceventa.model.Cliente;
import com.quispcs.serviceventa.model.Producto;
import com.quispcs.serviceventa.repository.DetalleRepository;
import com.quispcs.serviceventa.repository.VentaRepository;
import com.quispcs.serviceventa.service.VentaService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class VentaServiceImpl implements VentaService {
    @Autowired
    VentaRepository ventaRepository;

    @Autowired
    DetalleRepository detalleRepository;
    @Autowired
    ClienteFeign clienteFeign;
    @Autowired
    ProductoFeign productoFeign;

    @Override
    public List<Venta> findVentaAll() {
        return  ventaRepository.findAll();
    }


    @Override
    public Venta createVenta(Venta venta) {
        Venta ventaDB = ventaRepository.findByNumeroVenta (venta.getNumeroVenta() );
        if (ventaDB !=null){
            return  ventaDB;
        }
        venta.setEstado("CREATED");
        ventaDB = ventaRepository.save(venta);
        ventaDB.getDetalle().forEach(detalle -> {
            productoFeign.updateStockProducto(detalle.getProductoId(), detalle.getCantidad() * -1);
        });

        return ventaDB;
    }


    @Override
    public Venta updateVenta(Venta venta) {
        Venta ventaDB = getVenta(venta.getId());
        if (ventaDB == null){
            return  null;
        }
        ventaDB.setClienteId(venta.getClienteId());
        ventaDB.setDescripcion(venta.getDescripcion());
        ventaDB.setNumeroVenta(venta.getNumeroVenta());
        ventaDB.getDetalle().clear();
        ventaDB.setDetalle(venta.getDetalle());
        return ventaRepository.save(ventaDB);
    }


    @Override
    public Venta deleteVenta(Venta venta) {
        Venta ventaDB = getVenta(venta.getId());
        if (ventaDB == null){
            return  null;
        }
        ventaDB.setEstado("DELETED");
        return ventaRepository.save(ventaDB);
    }

    @Override
    public Venta getVenta(Long id) {
        Venta venta= ventaRepository.findById(id).orElse(null);
        if (null != venta ){
            Cliente cliente = clienteFeign.getCliente(venta.getClienteId()).getBody();
            venta.setCliente(cliente);
            List<Detalle> listDetalle=venta.getDetalle().stream().map(detalle -> {
                Producto producto = productoFeign.getProduct(detalle.getProductoId()).getBody();
                detalle.setProducto(producto);
                return detalle;
            }).collect(Collectors.toList());
            venta.setDetalle(listDetalle);
        }
        return venta ;
    }
}
