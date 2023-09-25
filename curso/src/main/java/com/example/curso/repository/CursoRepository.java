package com.example.curso.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.curso.entity.Curso;

public interface CursoRepository extends JpaRepository<Curso, Integer> {

}
