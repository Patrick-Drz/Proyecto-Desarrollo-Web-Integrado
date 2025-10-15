package com.utp.delivery.dto;

import lombok.Data;

@Data
public class AddItemRequest {
    private Long idProducto;
    private int cantidad;
}
