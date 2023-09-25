package com.serviceventa.entity;

import com.quispcs.serviceventa.model.Producto;
import jakarta.persistence.*;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
@Entity
@Table(name="Detalle")

public class Detalle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Positive(message = "mayor a cero")
    private Double cantidad;
    private Double  precio;
    @Column(name = "producto_id")
    private Long productoId;


    @Transient
    private Double Total;
    @Transient
    private Producto producto;


    public Double getTotal(){
        if (this.precio >0  && this.cantidad >0 ){
            return this.cantidad * this.precio;
        }else {
            return (double) 0;
        }
    }
    public Detalle(){
        this.cantidad=(double) 0;
        this.precio=(double) 0;

    }


}
