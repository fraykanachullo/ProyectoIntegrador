package com.serviceventa.feign;

import com.quispcs.serviceventa.model.Producto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;


@FeignClient(name = "Producto-Service", path = "/producto")
public interface ProductoFeign {
    @GetMapping(value = "/{id}")
    public ResponseEntity<Producto> getProduct(@PathVariable("id") Long id);
    @GetMapping(value = "/{id}/stock")
    public ResponseEntity<Producto> updateStockProducto(@PathVariable Long id,@RequestParam(name="quantity",required = true) Double quantity);
}
