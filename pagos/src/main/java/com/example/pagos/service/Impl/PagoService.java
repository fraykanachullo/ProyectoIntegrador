package com.example.pagos.service.Impl;

import com.example.pagos.entity.MetodoPago;
import com.example.pagos.entity.Transaccion;
import com.example.pagos.repository.MetodoPagoRepository;
import com.example.pagos.repository.TransaccionRepository;
import jakarta.transaction.Transactional;

@Service
public class PagoService {

    @Autowired
    private TransaccionRepository transaccionRepository;

    @Autowired
    private MetodoPagoRepository metodoPagoRepository;

    @Transactional
    public Transaccion procesarPago(SolicitudPago solicitud) {

        MetodoPago metodoPago = metodoPagoRepository.findByDescripcion(solicitud.getMetodoPago())
                .orElseThrow(() -> new RuntimeException("Método de pago no soportado"));

        Transaccion transaccion = new Transaccion();

        return transaccionRepository.save(transaccion);
    }

    public String verificarEstadoTransaccion(Long id) {
        Transaccion transaccion = transaccionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transacción no encontrada"));
        return transaccion.getEstado().toString();
    }

}

