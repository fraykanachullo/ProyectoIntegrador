package com.serviceventa.repository;

import com.quispcs.serviceventa.entity.Venta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VentaRepository extends JpaRepository<Venta, Long> {
    public List<Venta> findByClienteId(Long clienteId);
    public Venta findByNumeroVenta(String numeroVenta);
}
