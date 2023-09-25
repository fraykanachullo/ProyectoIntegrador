package com.example.pagos.repository;

import com.example.pagos.entity.MetodoPago;

import java.util.Optional;

@Repository
public interface MetodoPagoRepository extends JpaRepository<MetodoPago, Long>{
    Optional<MetodoPago> findByDescripcion(String descripcion);
}
