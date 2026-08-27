package com.sudha.banking.repository;

import com.sudha.banking.entity.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;

import java.math.BigDecimal;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class TransactionRepositoryTest {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private CustomerRepository customerRepository;

    private Account sourceAccount;
    private Account destinationAccount;

    @BeforeEach
    void setUp() {
        Customer customer = Customer.builder()
                .firstName("Bob")
                .lastName("Jones")
                .email("bob.jones@example.com")
                .phone("555-5678")
                .build();
        customer = customerRepository.saveAndFlush(customer);

        Account account1 = Account.builder()
                .accountNumber("SRC-001")
                .accountType(AccountType.CURRENT)
                .balance(new BigDecimal("5000.0000"))
                .status(AccountStatus.ACTIVE)
                .customer(customer)
                .build();
        sourceAccount = accountRepository.saveAndFlush(account1);

        Account account2 = Account.builder()
                .accountNumber("DEST-001")
                .accountType(AccountType.SAVINGS)
                .balance(new BigDecimal("1000.0000"))
                .status(AccountStatus.ACTIVE)
                .customer(customer)
                .build();
        destinationAccount = accountRepository.saveAndFlush(account2);
    }

    @Test
    void shouldSaveAndFindTransaction() {
        Transaction transaction = Transaction.builder()
                .transactionReference("TXN-12345")
                .transactionType(TransactionType.TRANSFER)
                .amount(new BigDecimal("150.0000"))
                .status(TransactionStatus.COMPLETED)
                .sourceAccount(sourceAccount)
                .destinationAccount(destinationAccount)
                .build();

        Transaction savedTxn = transactionRepository.saveAndFlush(transaction);

        assertThat(savedTxn.getId()).isNotNull();
        assertThat(savedTxn.getCreatedAt()).isNotNull();

        Transaction foundTxn = transactionRepository.findById(savedTxn.getId()).orElse(null);
        assertThat(foundTxn).isNotNull();
        assertThat(foundTxn.getSourceAccount().getId()).isEqualTo(sourceAccount.getId());
        assertThat(foundTxn.getDestinationAccount().getId()).isEqualTo(destinationAccount.getId());
    }

    @Test
    void shouldFindTransactionsByAccountId() {
        Transaction txn1 = Transaction.builder()
                .transactionReference("TXN-A")
                .transactionType(TransactionType.TRANSFER)
                .amount(new BigDecimal("100"))
                .status(TransactionStatus.COMPLETED)
                .sourceAccount(sourceAccount)
                .destinationAccount(destinationAccount)
                .build();

        Transaction txn2 = Transaction.builder()
                .transactionReference("TXN-B")
                .transactionType(TransactionType.WITHDRAWAL)
                .amount(new BigDecimal("50"))
                .status(TransactionStatus.COMPLETED)
                .sourceAccount(sourceAccount)
                .build();

        transactionRepository.saveAllAndFlush(List.of(txn1, txn2));

        List<Transaction> sourceTxns = transactionRepository.findBySourceAccountIdOrDestinationAccountId(sourceAccount.getId(), sourceAccount.getId());
        assertThat(sourceTxns).hasSize(2);

        List<Transaction> destTxns = transactionRepository.findBySourceAccountIdOrDestinationAccountId(destinationAccount.getId(), destinationAccount.getId());
        assertThat(destTxns).hasSize(1);
    }
}
