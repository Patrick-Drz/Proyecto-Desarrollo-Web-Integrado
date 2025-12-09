package com.utp.delivery.service;

import com.utp.delivery.model.Oferta;
import com.utp.delivery.repository.OfertaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OfertaService {
    private final OfertaRepository ofertaRepository;

    public List<Oferta> obtenerTodas() {
        return ofertaRepository.findAll();
    }
    
    public List<Oferta> obtenerOfertasActivas() {
        return ofertaRepository.findByActivaTrue();
    }

    public Oferta crear(Oferta oferta) {
        if (!oferta.isActiva()) oferta.setActiva(true);
        if (oferta.getStock() == null) oferta.setStock(0);
        return ofertaRepository.save(oferta);
    }

    public Oferta actualizar(Long id, Oferta ofertaDetalles) {
        return ofertaRepository.findById(id).map(oferta -> {
            oferta.setNombreOferta(ofertaDetalles.getNombreOferta());
            oferta.setDescripcionOferta(ofertaDetalles.getDescripcionOferta());
            oferta.setTipoDescuento(ofertaDetalles.getTipoDescuento());
            oferta.setPrecioRegular(ofertaDetalles.getPrecioRegular());
            oferta.setValorDescuento(ofertaDetalles.getValorDescuento());
            oferta.setFechaInicio(ofertaDetalles.getFechaInicio());
            oferta.setFechaFin(ofertaDetalles.getFechaFin());
            
            oferta.setStock(ofertaDetalles.getStock()); 

            if (ofertaDetalles.getFechaFin().isAfter(LocalDateTime.now())) {
            }
            
            return ofertaRepository.save(oferta);
        }).orElseThrow(() -> new RuntimeException("Oferta no encontrada"));
    }
    
    @Scheduled(fixedRate = 60000)
    @Transactional
    public void verificarVencimientoOfertas() {
        LocalDateTime ahora = LocalDateTime.now();
        ofertaRepository.desactivarOfertasVencidas(ahora);
    }

    public void eliminar(Long id) {
        ofertaRepository.deleteById(id);
    }
    
    public Oferta cambiarEstado(Long id) {
        Oferta oferta = ofertaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Oferta no encontrada"));
        oferta.setActiva(!oferta.isActiva());
        return ofertaRepository.save(oferta);
    }
}