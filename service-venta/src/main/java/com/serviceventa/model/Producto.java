package com.serviceventa.model;

import lombok.Data;

import java.util.Date;
@Data
public class Producto {
    private Long id;
    private String nombre;
    private String descripcion;
    private Double stock;
    private Double precio;
    private String estado;
    private Date createAt;
    private Category category;
}
