package com.quispcs.serviceproduct.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Date;

@Entity
@Table(name="tabla_producto")//para definir el nombre de la tabla
@Data //para generar los metodos getter y setter
public class Producto {
    //Para mapear nuestra entidad
    // e identificar nuestro Primary Key y para que se autoincremente con el @generatedvalue
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;
    private String descripcion;
    private Double stock;
    private Double precio;
    private String estado;
    @Column(name ="create_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date createAt;
    //para mapear usamos many to one  osea una categoria tiene muchos productos
    @NotNull(message = "La categoria no puede ser vacia")
    @ManyToOne(fetch = FetchType.LAZY)
    //usamos fetchtype.lazy paracargar valore en un momento que es requerido

    @JoinColumn(name="category_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
    private Category category;
}
//luego crear repository para manipular datos
