package com.sudha.banking.service;

import com.sudha.banking.dto.CustomerCreateDto;
import com.sudha.banking.dto.CustomerDto;

public interface CustomerService {
    CustomerDto createCustomer(CustomerCreateDto customerCreateDto);
    CustomerDto getCustomerById(Long id);
}
