package com.sudha.banking.repository;

import com.sudha.banking.entity.Customer;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.dao.DataIntegrityViolationException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

@DataJpaTest
class CustomerRepositoryTest {

    @Autowired
    private CustomerRepository customerRepository;

    @Test
    void shouldSaveAndFindCustomer() {
        Customer customer = Customer.builder()
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@example.com")
                .phone("1234567890")
                .build();

        Customer savedCustomer = customerRepository.save(customer);

        assertThat(savedCustomer.getId()).isNotNull();
        assertThat(savedCustomer.getCreatedAt()).isNotNull();

        Customer foundCustomer = customerRepository.findById(savedCustomer.getId()).orElse(null);
        assertThat(foundCustomer).isNotNull();
        assertThat(foundCustomer.getEmail()).isEqualTo("john.doe@example.com");
    }

    @Test
    void shouldFailWhenEmailIsNotUnique() {
        Customer customer1 = Customer.builder()
                .firstName("John")
                .lastName("Doe")
                .email("duplicate@example.com")
                .phone("1234567890")
                .build();

        customerRepository.saveAndFlush(customer1);

        Customer customer2 = Customer.builder()
                .firstName("Jane")
                .lastName("Doe")
                .email("duplicate@example.com")
                .phone("0987654321")
                .build();

        assertThrows(DataIntegrityViolationException.class, () -> customerRepository.saveAndFlush(customer2));
    }
}
