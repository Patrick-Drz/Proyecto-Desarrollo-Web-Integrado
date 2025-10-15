package com.utp.delivery.dto;

import lombok.Data;

@Data
public class CrearComboRequest {
    private Long idProductoPadre; 
    private Long idProductoHijo;  
    private int cantidad;        
}
