package com.utp.delivery.service;

import com.utp.delivery.model.Producto;
import com.utp.delivery.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProductoService {
    @Autowired private ProductoRepository productoRepository;

    public List<Producto> obtenerTodos() { 
        return productoRepository.findAll(); 
    }

    public Producto obtenerPorId(Long id) {
        return productoRepository.findById(id).orElse(null);
    }

    public Producto crear(Producto producto) {
        if (!producto.isActivo()) producto.setActivo(true);
        return productoRepository.save(producto);
    }

    public Producto actualizar(Long id, Producto productoDetalles) {
        Producto producto = obtenerPorId(id);
        if (producto != null) {
            producto.setCodigoProducto(productoDetalles.getCodigoProducto());
            producto.setNombre(productoDetalles.getNombre());
            producto.setDescripcion(productoDetalles.getDescripcion());
            producto.setPrecio(productoDetalles.getPrecio());
            producto.setStock(productoDetalles.getStock());
            producto.setRutaImagen(productoDetalles.getRutaImagen());
            return productoRepository.save(producto);
        }
        return null;
    }

    public void eliminar(Long id) {
        productoRepository.deleteById(id);
    }
}