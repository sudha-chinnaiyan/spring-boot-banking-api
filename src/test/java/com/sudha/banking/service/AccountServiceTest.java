package com.sudha.banking.service;

import com.sudha.banking.dto.AccountCreateDto;
import com.sudha.banking.dto.AccountDto;
import com.sudha.banking.entity.Account;
import com.sudha.banking.entity.AccountStatus;
import com.sudha.banking.entity.AccountType;
import com.sudha.banking.entity.Customer;
import com.sudha.banking.repository.AccountRepository;
import com.sudha.banking.repository.CustomerRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AccountServiceTest {

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private CustomerRepository customerRepository;

    @InjectMocks
    private AccountServiceImpl accountService;

    @Test
    void shouldCreateAccount() {
        AccountCreateDto createDto = AccountCreateDto.builder()
                .customerId(1L)
                .accountType(AccountType.SAVINGS)
                .initialDeposit(new BigDecimal("100.00"))
                .build();

        Customer customer = Customer.builder().id(1L).build();

        Account savedAccount = Account.builder()
                .id(100L)
                .accountNumber("ACCT-ABCDEF")
                .accountType(AccountType.SAVINGS)
                .balance(new BigDecimal("100.00"))
                .status(AccountStatus.ACTIVE)
                .customer(customer)
                .build();

        when(customerRepository.findById(1L)).thenReturn(Optional.of(customer));
        when(accountRepository.save(any(Account.class))).thenReturn(savedAccount);

        AccountDto result = accountService.createAccount(createDto);

        assertThat(result.getId()).isEqualTo(100L);
        assertThat(result.getAccountNumber()).isEqualTo("ACCT-ABCDEF");
        assertThat(result.getBalance()).isEqualTo(new BigDecimal("100.00"));
        assertThat(result.getCustomerId()).isEqualTo(1L);
    }
}
