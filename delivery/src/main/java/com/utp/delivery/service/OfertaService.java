package com.utp.delivery.service;

import com.utp.delivery.model.Oferta;
import com.utp.delivery.repository.OfertaRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OfertaService {
    private final OfertaRepository ofertaRepository;

    @Transactional(readOnly = true)
    public List<Oferta> obtenerTodas() {
        return ofertaRepository.findByActivaTrue();
    }

    @Transactional
    public Oferta crear(Oferta oferta) {
        oferta.setActiva(true);
        return ofertaRepository.save(oferta);
    }

    @Transactional
    public Oferta actualizar(Long id, Oferta ofertaDetalles) {
        Oferta oferta = ofertaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Oferta no encontrada"));
        
        oferta.setNombreOferta(ofertaDetalles.getNombreOferta());
        oferta.setDescripcionOferta(ofertaDetalles.getDescripcionOferta());
        oferta.setPrecioRegular(ofertaDetalles.getPrecioRegular());
        oferta.setValorDescuento(ofertaDetalles.getValorDescuento()); 
        oferta.setFechaInicio(ofertaDetalles.getFechaInicio());
        oferta.setFechaFin(ofertaDetalles.getFechaFin());
        oferta.setActiva(ofertaDetalles.isActiva());
        
        return ofertaRepository.save(oferta);
    }

    @Transactional
    public void eliminar(Long id) {
        Oferta oferta = ofertaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Oferta no encontrada"));
        
        oferta.setActiva(false);
        ofertaRepository.save(oferta);
    }
}