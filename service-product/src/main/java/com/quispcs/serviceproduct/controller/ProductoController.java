package com.quispcs.serviceproduct.controller;

import com.quispcs.serviceproduct.entity.Category;
import com.quispcs.serviceproduct.entity.Producto;
import com.quispcs.serviceproduct.service.ProductoService;
import jakarta.validation.Valid;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping(value="/producto")
public class ProductoController {
    @Autowired
    private ProductoService productoService ;

    @GetMapping
    //Filtro de producto por categoria id (categoryId)
    public ResponseEntity<List<Producto>> listProducto(@RequestParam(name ="categoryId",required = false)Long categoryId){
        List<Producto> productos= new ArrayList<>();
        if(null == categoryId){
            productos = productoService.listAllProducto();
            if (productos.isEmpty()){
                return ResponseEntity.noContent().build();
            }
        }else{
            productos = productoService.findByCategory(Category.builder().id(categoryId).build());
            if (productos.isEmpty()){
                return ResponseEntity.notFound().build();
            }
        }

        return ResponseEntity.ok(productos);
    }
    //metodo get para buscar producto por /id
    @GetMapping(value = "/{id}")
    public ResponseEntity<Producto> getProduct(@PathVariable("id") Long id) {
        Producto producto =  productoService.getProducto(id);
        if (null==producto){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(producto);
    }
    //post para crear un nuevo producto
    @PostMapping
    public ResponseEntity<Producto> createProducto(@Valid @RequestBody Producto producto, BindingResult result){
        //if (result.hasErrors()){
        //    throw new ResponseStatusException()
       // }
        Producto productoCreate =  productoService.createProducto(producto);
        return ResponseEntity.status(HttpStatus.CREATED).body(productoCreate);
    }
    //put mapping para el metodo editar producto por id
    @PutMapping(value = "/{id}")
    public ResponseEntity<Producto> updateProduct(@PathVariable("id") Long id, @RequestBody Producto producto){
        producto.setId(id);
        Producto productoDB =  productoService.updateProducto(producto);
        if (productoDB == null){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(productoDB);
    }
    //delete para eliminar producto y pasar al estado "DELETED"
    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Producto> deleteProduct(@PathVariable("id") Long id){
        Producto productoDelete = productoService.deleteProducto(id);
        if (productoDelete == null){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(productoDelete);
    }
    //metodo get para actualizar stoock
    @GetMapping(value = "/{id}/stock")
    public ResponseEntity<Producto> updateStockProducto(@PathVariable Long id,@RequestParam(name="quantity",required = true) Double quantity){
        Producto producto = productoService.updateStock(id, quantity);
        if(producto==null){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(producto);
    }


}
