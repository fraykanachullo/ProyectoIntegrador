package com.serviceventa.service;

import com.quispcs.serviceventa.entity.Venta;

import java.util.List;

public interface VentaService {
    public List<Venta> findVentaAll();

    public Venta createVenta(Venta venta);
    public Venta updateVenta(Venta venta);
    public Venta deleteVenta(Venta venta);

    public Venta getVenta(Long id);

}
