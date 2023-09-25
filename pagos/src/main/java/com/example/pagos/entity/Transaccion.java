package com.example.pagos.entity;

import jakarta.persistence.*;

@Entity
@Table(name ="transacciones♦")
public class Transaccion {

    public enum EstadoTransaccion {
        PENDIENTE, EXITOSO, FALLIDO
    }
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long clienteId;

    @Column(nullable = false)
    private Double monto;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoTransaccion estado;
}
