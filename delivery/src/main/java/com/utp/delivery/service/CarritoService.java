package com.utp.delivery.service;

import com.utp.delivery.dto.AddItemRequest;
import com.utp.delivery.model.*;
import com.utp.delivery.repository.CarritoRepository;
import com.utp.delivery.repository.OfertaRepository; 
import com.utp.delivery.repository.ProductoRepository;
import com.utp.delivery.repository.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CarritoService {
    private final CarritoRepository carritoRepository;
    private final ProductoRepository productoRepository;
    private final OfertaRepository ofertaRepository; 
    private final UsuarioRepository usuarioRepository;

    @Transactional
    public Carrito agregarItemACarrito(Long idUsuario, AddItemRequest itemRequest) {
        Carrito carrito = obtenerOCrearCarrito(idUsuario);
        
        if (itemRequest.getIdProducto() != null) {
            Producto producto = productoRepository.findById(itemRequest.getIdProducto())
                    .orElseThrow(() -> new EntityNotFoundException("Producto no encontrado"));
            
            Optional<ItemCarrito> itemExistente = carrito.getItems().stream()
                    .filter(item -> item.getProducto() != null && item.getProducto().getId().equals(producto.getId()))
                    .findFirst();

            int cantidadActualEnCarrito = itemExistente.map(ItemCarrito::getCantidad).orElse(0);
            int cantidadTotalSolicitada = cantidadActualEnCarrito + itemRequest.getCantidad();

            if (producto.getStock() < cantidadTotalSolicitada) {
                throw new IllegalStateException("Stock insuficiente. Disponible: " + producto.getStock() + 
                                               ", ya tienes en carrito: " + cantidadActualEnCarrito);
            }

            if (itemExistente.isPresent()) {
                ItemCarrito item = itemExistente.get();
                item.setCantidad(item.getCantidad() + itemRequest.getCantidad());
            } else {
                ItemCarrito nuevoItem = new ItemCarrito();
                nuevoItem.setCarrito(carrito);
                nuevoItem.setProducto(producto);
                nuevoItem.setCantidad(itemRequest.getCantidad());
                nuevoItem.setPrecioUnitarioAlMomento(producto.getPrecio());
                carrito.getItems().add(nuevoItem);
            }
        } 
        else if (itemRequest.getIdOferta() != null) {
            Oferta oferta = ofertaRepository.findById(itemRequest.getIdOferta())
                    .orElseThrow(() -> new EntityNotFoundException("Oferta no encontrada"));
            
            Optional<ItemCarrito> itemExistente = carrito.getItems().stream()
                    .filter(item -> item.getOferta() != null && item.getOferta().getId().equals(oferta.getId()))
                    .findFirst();

            int cantidadActualEnCarrito = itemExistente.map(ItemCarrito::getCantidad).orElse(0);
            int cantidadTotalSolicitada = cantidadActualEnCarrito + itemRequest.getCantidad();

            if (oferta.getStock() < cantidadTotalSolicitada) {
                throw new IllegalStateException("Stock insuficiente para la oferta. Disponible: " + oferta.getStock());
            }

            if (itemExistente.isPresent()) {
                ItemCarrito item = itemExistente.get();
                item.setCantidad(item.getCantidad() + itemRequest.getCantidad());
            } else {
                ItemCarrito nuevoItem = new ItemCarrito();
                nuevoItem.setCarrito(carrito);
                nuevoItem.setOferta(oferta); 
                nuevoItem.setCantidad(itemRequest.getCantidad());
                nuevoItem.setPrecioUnitarioAlMomento(calcularPrecioOferta(oferta));
                carrito.getItems().add(nuevoItem);
            }
        }

        carrito.setFechaActualizacion(LocalDateTime.now());
        return carritoRepository.save(carrito);
    }

    @Transactional
    public Carrito eliminarItemDelCarrito(Long idUsuario, Long idItemCarrito) {
        Carrito carrito = obtenerOCrearCarrito(idUsuario);
        
        boolean eliminado = carrito.getItems().removeIf(item -> item.getId().equals(idItemCarrito));
        
        if (eliminado) {
            carrito.setFechaActualizacion(LocalDateTime.now());
            return carritoRepository.save(carrito);
        }
        return carrito;
    }

    private BigDecimal calcularPrecioOferta(Oferta oferta) {
        if (oferta.getTipoDescuento() == Oferta.TipoDescuento.MONTO_FIJO) {
            return oferta.getPrecioRegular().subtract(oferta.getValorDescuento());
        } else {
            BigDecimal descuento = oferta.getPrecioRegular().multiply(oferta.getValorDescuento().divide(BigDecimal.valueOf(100)));
            return oferta.getPrecioRegular().subtract(descuento);
        }
    }

    @Transactional
    public Carrito obtenerCarritoPorUsuario(Long idUsuario) { 
        return obtenerOCrearCarrito(idUsuario); 
    }

    @Transactional
    public void limpiarCarrito(Long idUsuario) {
        Carrito carrito = carritoRepository.findByUsuarioId(idUsuario)
                .orElseThrow(() -> new EntityNotFoundException("Carrito no encontrado"));
        carrito.getItems().clear();
        carritoRepository.save(carrito);
    }

    private Carrito obtenerOCrearCarrito(Long idUsuario) {
        return carritoRepository.findByUsuarioId(idUsuario).orElseGet(() -> {
            Carrito nuevoCarrito = new Carrito();
            Usuario usuario = usuarioRepository.findById(idUsuario)
                    .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));
            
            nuevoCarrito.setUsuario(usuario);
            nuevoCarrito.setFechaCreacion(LocalDateTime.now());
            nuevoCarrito.setFechaActualizacion(LocalDateTime.now());
            return carritoRepository.save(nuevoCarrito);
        });
    }
}