package com.quispcs.serviceproduct.service;

import com.quispcs.serviceproduct.entity.Category;
import com.quispcs.serviceproduct.entity.Producto;

import java.util.List;

public interface ProductoService {
    public List<Producto> listAllProducto();
    public Producto getProducto(Long id);
    public Producto createProducto(Producto producto);
    public Producto updateProducto(Producto producto);
    public Producto deleteProducto(Long id);
    public List<Producto> findByCategory(Category category);
    public Producto updateStock (Long id, Double quantity);
}
