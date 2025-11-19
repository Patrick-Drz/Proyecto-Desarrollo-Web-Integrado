package com.utp.delivery.dto;

import lombok.Data;

@Data
public class CrearReclamacionRequest {
    private String tipoReclamacion; 
    private String descripcion;
}
