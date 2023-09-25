package com.example.clientes.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import upeu.edu.example.catalogo.entity.Categoria;

public interface CategoriaRepository extends JpaRepository<Categoria,Integer> {
}