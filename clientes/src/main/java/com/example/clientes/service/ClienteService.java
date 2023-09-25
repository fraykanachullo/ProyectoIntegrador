package com.example.clientes.service;

import java.util.List;
import java.util.Optional;

import com.example.clientes.entity.Cliente;

public interface ClienteService {

    public List<Cliente> listar();

    public Cliente guardar(Cliente cliente);

    public Cliente actualizar(Cliente cliente);

    public Optional<Cliente> listarPorId(Integer id);

    public void eliminarPorId(Integer id);
}
