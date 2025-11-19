package com.utp.delivery.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "ofertas")
public class Oferta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombreOferta;
    
    private String descripcionOferta;

    private BigDecimal precioRegular;

    @Enumerated(EnumType.STRING)
    private TipoDescuento tipoDescuento; 

    private BigDecimal valorDescuento; 

    private LocalDateTime fechaInicio;
    
    private LocalDateTime fechaFin;
    
    private boolean activa;

    public enum TipoDescuento { PORCENTAJE, MONTO_FIJO }
}