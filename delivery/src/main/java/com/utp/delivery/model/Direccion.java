package com.utp.delivery.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "direcciones")
public class Direccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING) 
    private Torre torre;

    private int piso;
    private int aula;

    public enum Torre {
        A, B, C, D
    }
}
