package com.utp.delivery.service;

import com.utp.delivery.dto.CrearOrdenRequest;
import com.utp.delivery.model.*;
import com.utp.delivery.repository.DireccionRepository;
import com.utp.delivery.repository.OrdenVentaRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrdenVentaService {
    private final OrdenVentaRepository ordenVentaRepository;
    private final CarritoService carritoService;
    private final DireccionRepository direccionRepository;

    @Transactional
    public OrdenVenta crearOrdenDesdeCarrito(Long idUsuario, CrearOrdenRequest ordenRequest) {
        Carrito carrito = carritoService.obtenerCarritoPorUsuario(idUsuario);
        if (carrito.getItems().isEmpty()) { throw new IllegalStateException("El carrito está vacío."); }
        Direccion direccion = direccionRepository.findById(ordenRequest.getIdDireccionEntrega()).orElseThrow(() -> new EntityNotFoundException("Dirección no encontrada"));
        OrdenVenta orden = new OrdenVenta();
        Usuario usuario = new Usuario();
        usuario.setId(idUsuario);
        orden.setUsuario(usuario);
        orden.setDireccionEntrega(direccion);
        orden.setFechaOrden(LocalDateTime.now());
        orden.setEstado("PENDIENTE");
        List<DetalleOrdenVenta> detalles = carrito.getItems().stream().map(itemCarrito -> {
            DetalleOrdenVenta detalle = new DetalleOrdenVenta();
            detalle.setProducto(itemCarrito.getProducto());
            detalle.setCantidad(itemCarrito.getCantidad());
            detalle.setPrecioUnitarioAlMomento(itemCarrito.getPrecioUnitarioAlMomento());
            detalle.setOrdenVenta(orden);
            return detalle;
        }).collect(Collectors.toList());
        orden.setDetalles(detalles);
        BigDecimal totalOrden = detalles.stream().map(detalle -> detalle.getPrecioUnitarioAlMomento().multiply(new BigDecimal(detalle.getCantidad()))).reduce(BigDecimal.ZERO, BigDecimal::add);
        orden.setTotal(totalOrden);
        OrdenVenta ordenGuardada = ordenVentaRepository.save(orden);
        carritoService.limpiarCarrito(idUsuario);
        return ordenGuardada;
    }
    @Transactional(readOnly = true)
    public List<OrdenVenta> obtenerOrdenesPorUsuario(Long idUsuario) {
        return ordenVentaRepository.findByUsuarioId(idUsuario);
    }
    @Transactional(readOnly = true)
    public List<OrdenVenta> obtenerTodasLasOrdenes() {
        return ordenVentaRepository.findAll();
    }
}