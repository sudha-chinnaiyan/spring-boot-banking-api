package com.sudha.banking.service;

import com.sudha.banking.dto.CustomerCreateDto;
import com.sudha.banking.dto.CustomerDto;
import com.sudha.banking.entity.Customer;
import com.sudha.banking.repository.CustomerRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CustomerServiceTest {

    @Mock
    private CustomerRepository customerRepository;

    @InjectMocks
    private CustomerServiceImpl customerService;

    @Test
    void shouldCreateCustomer() {
        CustomerCreateDto createDto = CustomerCreateDto.builder()
                .firstName("John")
                .lastName("Doe")
                .email("johndoe@example.com")
                .phone("12345")
                .build();

        Customer savedEntity = Customer.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .email("johndoe@example.com")
                .phone("12345")
                .build();

        when(customerRepository.save(any(Customer.class))).thenReturn(savedEntity);

        CustomerDto result = customerService.createCustomer(createDto);

        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getEmail()).isEqualTo("johndoe@example.com");
    }

    @Test
    void shouldGetCustomerById() {
        Customer entity = Customer.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .email("johndoe@example.com")
                .phone("12345")
                .build();

        when(customerRepository.findById(1L)).thenReturn(Optional.of(entity));

        CustomerDto result = customerService.getCustomerById(1L);

        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getFirstName()).isEqualTo("John");
    }
}
