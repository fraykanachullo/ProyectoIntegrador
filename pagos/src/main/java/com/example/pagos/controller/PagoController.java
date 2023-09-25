package com.example.pagos.controller;

import com.example.pagos.entity.Transaccion;
import org.apache.hc.core5.http.HttpStatus;

@RestController
@RequestMapping("/pagos")
public class PagoController {

    @Autowired
    private PagoService pagoService;

    @PostMapping("/procesar")
    public ResponseEntity<Transaccion> procesarPago(@RequestBody SolicitudPago solicitud) {
        try {
            Transaccion transaccion = pagoService.procesarPago(solicitud);
            return ResponseEntity.ok(transaccion);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}/estado")
    public ResponseEntity<String> verificarEstadoTransaccion(@PathVariable Long id) {
        try {
            String estado = pagoService.verificarEstadoTransaccion(id);
            return ResponseEntity.ok(estado);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
