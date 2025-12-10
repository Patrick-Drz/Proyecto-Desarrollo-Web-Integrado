package com.utp.delivery.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
@Entity
@Table(name = "direcciones")
public class Direccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "La torre es obligatoria")
    @Pattern(regexp = "[ABCD]", message = "La torre debe ser A, B, C o D")
    private String torre;

    @NotNull(message = "El piso es obligatorio")
    @Min(value = 1, message = "El piso mínimo es 1")
    @Max(value = 15, message = "El piso máximo es 15")
    private int piso;

    @NotNull(message = "El número de aula es obligatorio")
    @Min(value = 1, message = "El aula debe ser un número positivo")
    private int aula;
}