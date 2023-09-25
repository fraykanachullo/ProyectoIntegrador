package com.serviceventa.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.quispcs.serviceventa.model.Cliente;
import jakarta.persistence.*;
import jakarta.validation.Valid;
import lombok.Data;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Data
@Table(name = "Venta")
public class Venta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "Numero de venta")
    private String numeroVenta;

    private String descripcion;

    @Column(name = "cliente_id")
    private Long clienteId;

    @Column(name = "create_at")
    @Temporal(TemporalType.DATE)
    private Date createAt;
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "detalle_id")
    private List<Detalle> detalle;

    private String estado;
    @Transient
    private Cliente cliente;

    public Venta(){
        detalle = new ArrayList<>();
    }

    @PrePersist
    public void prePersist() {
        this.createAt = new Date();
    }


}
