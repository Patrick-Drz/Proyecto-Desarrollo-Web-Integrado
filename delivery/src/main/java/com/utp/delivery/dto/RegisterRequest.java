package com.utp.delivery.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data 
@Builder 
@AllArgsConstructor 
@NoArgsConstructor
public class RegisterRequest {
    private String nombreCompleto;
    private String correo;
    private String contrasena;
    private String codigoEstudiante;
}
