package com.serviceventa.model;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Cliente {
    private Long id;
    private String dni;
    private String nombres;
    private String apellidos;
    private String email;
    private String estado;
}
