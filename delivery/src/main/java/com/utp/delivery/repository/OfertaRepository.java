package com.utp.delivery.repository;

import com.utp.delivery.model.Oferta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OfertaRepository extends JpaRepository<Oferta, Long> {
    
    List<Oferta> findByActivaTrue();

    @Modifying
    @Query("UPDATE Oferta o SET o.activa = false WHERE o.fechaFin < :ahora AND o.activa = true")
    void desactivarOfertasVencidas(LocalDateTime ahora);
}