package com.utp.delivery.service;

import com.utp.delivery.dto.CrearOrdenRequest;
import com.utp.delivery.model.*;
import com.utp.delivery.repository.DireccionRepository;
import com.utp.delivery.repository.OfertaRepository;
import com.utp.delivery.repository.OrdenVentaRepository;
import com.utp.delivery.repository.ProductoRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrdenVentaService {
    
    private final OrdenVentaRepository ordenVentaRepository;
    private final CarritoService carritoService;
    private final DireccionRepository direccionRepository;
    private final ProductoRepository productoRepository;
    private final OfertaRepository ofertaRepository;

    @Transactional
    public OrdenVenta crearOrdenDesdeCarrito(Long idUsuario, CrearOrdenRequest ordenRequest) {
        Carrito carrito = carritoService.obtenerCarritoPorUsuario(idUsuario);
        
        if (carrito.getItems().isEmpty()) { 
            throw new IllegalStateException("El carrito está vacío."); 
        }
        
        for (ItemCarrito item : carrito.getItems()) {
            if (item.getProducto() != null) {
                Producto prod = item.getProducto();
                if (prod.getStock() < item.getCantidad()) {
                    throw new IllegalStateException("Stock insuficiente para el producto: " + prod.getNombre());
                }
                int nuevoStock = prod.getStock() - item.getCantidad();
                prod.setStock(nuevoStock);
                if (nuevoStock == 0) {
                    prod.setActivo(false);
                }
                productoRepository.save(prod);
                
            } else if (item.getOferta() != null) {
                Oferta oferta = item.getOferta();
                if (oferta.getStock() < item.getCantidad()) {
                    throw new IllegalStateException("Stock insuficiente para la oferta: " + oferta.getNombreOferta());
                }
                int nuevoStock = oferta.getStock() - item.getCantidad();
                oferta.setStock(nuevoStock);
                if (nuevoStock == 0) {
                    oferta.setActiva(false);
                }
                ofertaRepository.save(oferta);
            }
        }

        Direccion direccion = direccionRepository.findById(ordenRequest.getIdDireccionEntrega())
                .orElseThrow(() -> new EntityNotFoundException("Dirección no encontrada"));
        
        OrdenVenta orden = new OrdenVenta();
        Usuario usuario = new Usuario();
        usuario.setId(idUsuario);
        orden.setUsuario(usuario);
        orden.setDireccionEntrega(direccion);
        orden.setFechaOrden(LocalDateTime.now());
        orden.setEstado("PENDIENTE");
        
        List<DetalleOrdenVenta> detalles = carrito.getItems().stream().map(itemCarrito -> {
            DetalleOrdenVenta detalle = new DetalleOrdenVenta();
            if (itemCarrito.getProducto() != null) {
                detalle.setProducto(itemCarrito.getProducto());
            } else if (itemCarrito.getOferta() != null) {
                detalle.setOferta(itemCarrito.getOferta());
            }
            detalle.setCantidad(itemCarrito.getCantidad());
            detalle.setPrecioUnitarioAlMomento(itemCarrito.getPrecioUnitarioAlMomento());
            detalle.setOrdenVenta(orden);
            return detalle;
        }).collect(Collectors.toList());

        orden.setDetalles(detalles);
        
        BigDecimal subtotal = detalles.stream()
                .map(detalle -> detalle.getPrecioUnitarioAlMomento().multiply(new BigDecimal(detalle.getCantidad())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal igvCalculado = subtotal.multiply(new BigDecimal("0.18")).setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalFinal = subtotal.add(igvCalculado);

        orden.setTotal(totalFinal);
        orden.setIgv(igvCalculado);
        
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

    @Transactional
    public OrdenVenta cambiarEstado(Long idOrden, String nuevoEstado) {
        OrdenVenta orden = ordenVentaRepository.findById(idOrden)
                .orElseThrow(() -> new EntityNotFoundException("Orden no encontrada"));
        orden.setEstado(nuevoEstado);
        return ordenVentaRepository.save(orden);
    }
}