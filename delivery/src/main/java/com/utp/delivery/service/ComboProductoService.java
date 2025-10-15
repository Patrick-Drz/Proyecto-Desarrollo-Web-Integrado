package com.utp.delivery.service;

import com.utp.delivery.dto.CrearComboRequest;
import com.utp.delivery.model.ComboProducto;
import com.utp.delivery.model.Producto;
import com.utp.delivery.repository.ComboProductoRepository;
import com.utp.delivery.repository.ProductoRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ComboProductoService {

    private final ComboProductoRepository comboProductoRepository;
    private final ProductoRepository productoRepository;

    @Transactional
    public ComboProducto agregarComponenteACombo(CrearComboRequest request) {
        Producto productoPadre = productoRepository.findById(request.getIdProductoPadre())
                .orElseThrow(() -> new EntityNotFoundException("Producto padre (combo) no encontrado"));
        
        Producto productoHijo = productoRepository.findById(request.getIdProductoHijo())
                .orElseThrow(() -> new EntityNotFoundException("Producto hijo (componente) no encontrado"));

        ComboProducto nuevoComponente = new ComboProducto();
        nuevoComponente.setProductoPadre(productoPadre);
        nuevoComponente.setProductoHijo(productoHijo);
        nuevoComponente.setCantidad(request.getCantidad());

        return comboProductoRepository.save(nuevoComponente);
    }
}