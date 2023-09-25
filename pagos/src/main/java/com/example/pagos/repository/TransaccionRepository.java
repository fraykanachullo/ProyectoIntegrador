package com.example.pagos.repository;

import com.example.pagos.entity.Transaccion;

import java.util.List;

@Repository
public interface TransaccionRepository extends JpaRepository<Transaccion, Long>{
    List<Transaccion> findByClient(Long clientId);
}
