package com.sudha.banking.repository;

import com.sudha.banking.entity.Account;
import com.sudha.banking.entity.AccountStatus;
import com.sudha.banking.entity.AccountType;
import com.sudha.banking.entity.Customer;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.dao.DataIntegrityViolationException;

import java.math.BigDecimal;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

@DataJpaTest
class AccountRepositoryTest {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private CustomerRepository customerRepository;

    private Customer savedCustomer;

    @BeforeEach
    void setUp() {
        Customer customer = Customer.builder()
                .firstName("Alice")
                .lastName("Smith")
                .email("alice.smith@example.com")
                .phone("555-1234")
                .build();
        savedCustomer = customerRepository.saveAndFlush(customer);
    }

    @Test
    void shouldSaveAndFindAccount() {
        Account account = Account.builder()
                .accountNumber("ACCT-1001")
                .accountType(AccountType.SAVINGS)
                .balance(new BigDecimal("1000.5000"))
                .status(AccountStatus.ACTIVE)
                .customer(savedCustomer)
                .build();

        Account savedAccount = accountRepository.saveAndFlush(account);

        assertThat(savedAccount.getId()).isNotNull();
        assertThat(savedAccount.getVersion()).isEqualTo(0L);

        Account foundAccount = accountRepository.findById(savedAccount.getId()).orElse(null);
        assertThat(foundAccount).isNotNull();
        assertThat(foundAccount.getAccountNumber()).isEqualTo("ACCT-1001");
        assertThat(foundAccount.getCustomer().getId()).isEqualTo(savedCustomer.getId());
    }

    @Test
    void shouldFailWhenAccountNumberIsNotUnique() {
        Account account1 = Account.builder()
                .accountNumber("DUPLICATE-ACCT")
                .accountType(AccountType.SAVINGS)
                .balance(BigDecimal.ZERO)
                .status(AccountStatus.ACTIVE)
                .customer(savedCustomer)
                .build();

        accountRepository.saveAndFlush(account1);

        Account account2 = Account.builder()
                .accountNumber("DUPLICATE-ACCT")
                .accountType(AccountType.CURRENT)
                .balance(BigDecimal.ZERO)
                .status(AccountStatus.ACTIVE)
                .customer(savedCustomer)
                .build();

        assertThrows(DataIntegrityViolationException.class, () -> accountRepository.saveAndFlush(account2));
    }

    @Test
    void shouldFindAccountsByCustomerId() {
        Account account1 = Account.builder()
                .accountNumber("ACCT-2001")
                .accountType(AccountType.SAVINGS)
                .balance(BigDecimal.ZERO)
                .status(AccountStatus.ACTIVE)
                .customer(savedCustomer)
                .build();

        Account account2 = Account.builder()
                .accountNumber("ACCT-2002")
                .accountType(AccountType.CURRENT)
                .balance(BigDecimal.ZERO)
                .status(AccountStatus.ACTIVE)
                .customer(savedCustomer)
                .build();

        accountRepository.saveAllAndFlush(List.of(account1, account2));

        List<Account> accounts = accountRepository.findByCustomerId(savedCustomer.getId());
        assertThat(accounts).hasSize(2);
    }
}
