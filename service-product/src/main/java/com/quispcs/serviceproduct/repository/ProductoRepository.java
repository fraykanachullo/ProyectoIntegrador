package com.quispcs.serviceproduct.repository;

import com.quispcs.serviceproduct.entity.Category;
import com.quispcs.serviceproduct.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
    public List<Producto> findByCategory(Category category);
}
