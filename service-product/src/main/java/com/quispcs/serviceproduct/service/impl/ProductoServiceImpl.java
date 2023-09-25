package com.quispcs.serviceproduct.service.impl;

import com.quispcs.serviceproduct.entity.Category;
import com.quispcs.serviceproduct.entity.Producto;
import com.quispcs.serviceproduct.repository.ProductoRepository;
import com.quispcs.serviceproduct.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
@Service
public class ProductoServiceImpl implements ProductoService {

    @Autowired//inyectamos las dependencias
    private ProductoRepository productoRepository;//importar nuestro repositorio
    @Override
    public List<Producto> listAllProducto() {
        return productoRepository.findAll();
    }

    @Override
    public Producto getProducto(Long id) {
        return productoRepository.findById(id).orElse(null);
    }

    @Override
    public Producto createProducto(Producto producto) {
        producto.setEstado("CREATED");
        producto.setCreateAt(new Date());
        return productoRepository.save(producto);
    }
    @Override
    public Producto updateProducto(Producto producto) {
        Producto productoDB=getProducto(producto.getId());
        if (null==productoDB){
            return null;
        }
        productoDB.setNombre(producto.getNombre());
        productoDB.setDescripcion(producto.getDescripcion());
        productoDB.setCategory(producto.getCategory());
        productoDB.setPrecio(producto.getPrecio());
        return productoRepository.save(productoDB);
    }

    @Override
    public Producto deleteProducto(Long id) {
        Producto productoDB=getProducto(id);
        if (null==productoDB){
            return null;
        }
        productoDB.setEstado("DELETED");
        return productoRepository.save(productoDB);
    }

    @Override
    public List<Producto> findByCategory(Category category) {
        return productoRepository.findByCategory(category);
    }

    @Override
    public Producto updateStock(Long id, Double quantity) {
        Producto productoDB = getProducto(id);
        if (null == productoDB){
            return null;
        }
        Double stock=productoDB.getStock()+quantity;
        productoDB.setStock(stock);
        return productoRepository.save(productoDB);
    }
}
