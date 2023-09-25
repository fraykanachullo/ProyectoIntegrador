package com.serviceventa.feign;

import com.quispcs.serviceventa.model.Cliente;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "Cliente-Service", path = "/clientes")
public interface ClienteFeign {
    @GetMapping("/{id}")
    @CircuitBreaker(name = "myCircuitBreaker", fallbackMethod = "fallbackGetCliente")
    ResponseEntity<Cliente> getCliente(@PathVariable("id") long id);

    default ResponseEntity<Cliente> fallbackGetCliente(long id, Throwable throwable) {
        // Lógica de fallback
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        // Retorna una respuesta de error interno del servidor como fallback
    }
}

