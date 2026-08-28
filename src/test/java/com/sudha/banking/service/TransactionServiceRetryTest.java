package com.sudha.banking.service;

import com.sudha.banking.dto.TransactionDto;
import com.sudha.banking.dto.TransferRequestDto;
import com.sudha.banking.entity.Account;
import com.sudha.banking.entity.AccountStatus;
import com.sudha.banking.entity.Transaction;
import com.sudha.banking.entity.TransactionStatus;
import com.sudha.banking.entity.TransactionType;
import com.sudha.banking.exception.AccountBlockedException;
import com.sudha.banking.exception.InsufficientBalanceException;
import com.sudha.banking.repository.AccountRepository;
import com.sudha.banking.repository.TransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.orm.ObjectOptimisticLockingFailureException;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest
class TransactionServiceRetryTest {

    @Autowired
    private TransactionService transactionService;

    @MockitoBean
    private AccountRepository accountRepository;

    @MockitoBean
    private TransactionRepository transactionRepository;

    private Account sourceAccount;
    private Account destinationAccount;

    @BeforeEach
    void setUp() {
        sourceAccount = Account.builder()
                .id(1L)
                .balance(new BigDecimal("1000"))
                .status(AccountStatus.ACTIVE)
                .build();

        destinationAccount = Account.builder()
                .id(2L)
                .balance(new BigDecimal("500"))
                .status(AccountStatus.ACTIVE)
                .build();
    }

    @Test
    void shouldRetryAndSucceedOnSecondAttempt() {
        TransferRequestDto request = TransferRequestDto.builder()
                .sourceAccountId(1L)
                .destinationAccountId(2L)
                .amount(new BigDecimal("200"))
                .build();

        when(accountRepository.findById(1L)).thenReturn(Optional.of(sourceAccount));
        when(accountRepository.findById(2L)).thenReturn(Optional.of(destinationAccount));

        when(accountRepository.save(sourceAccount))
                .thenThrow(new ObjectOptimisticLockingFailureException("Account", 1L)) // 1st attempt
                .thenReturn(sourceAccount); // 2nd attempt

        Transaction savedTransaction = Transaction.builder()
                .id(10L)
                .transactionReference(UUID.randomUUID().toString())
                .transactionType(TransactionType.TRANSFER)
                .amount(new BigDecimal("200"))
                .status(TransactionStatus.COMPLETED)
                .build();

        when(transactionRepository.save(any(Transaction.class))).thenReturn(savedTransaction);

        TransactionDto result = transactionService.transferFunds(request);

        assertThat(result.getId()).isEqualTo(10L);
        verify(accountRepository, times(2)).findById(1L);
        verify(accountRepository, times(2)).findById(2L);
        verify(accountRepository, times(2)).save(sourceAccount);
    }

    @Test
    void shouldRetryAndSucceedOnThirdAttempt() {
        TransferRequestDto request = TransferRequestDto.builder()
                .sourceAccountId(1L)
                .destinationAccountId(2L)
                .amount(new BigDecimal("200"))
                .build();

        when(accountRepository.findById(1L)).thenReturn(Optional.of(sourceAccount));
        when(accountRepository.findById(2L)).thenReturn(Optional.of(destinationAccount));

        when(accountRepository.save(sourceAccount))
                .thenThrow(new ObjectOptimisticLockingFailureException("Account", 1L)) // 1st attempt
                .thenThrow(new ObjectOptimisticLockingFailureException("Account", 1L)) // 2nd attempt
                .thenReturn(sourceAccount); // 3rd attempt

        Transaction savedTransaction = Transaction.builder()
                .id(10L)
                .transactionReference(UUID.randomUUID().toString())
                .transactionType(TransactionType.TRANSFER)
                .amount(new BigDecimal("200"))
                .status(TransactionStatus.COMPLETED)
                .build();

        when(transactionRepository.save(any(Transaction.class))).thenReturn(savedTransaction);

        TransactionDto result = transactionService.transferFunds(request);

        assertThat(result.getId()).isEqualTo(10L);
        verify(accountRepository, times(3)).findById(1L);
        verify(accountRepository, times(3)).save(sourceAccount);
    }

    @Test
    void shouldFailAfterThreeUnsuccessfulAttempts() {
        TransferRequestDto request = TransferRequestDto.builder()
                .sourceAccountId(1L)
                .destinationAccountId(2L)
                .amount(new BigDecimal("200"))
                .build();

        when(accountRepository.findById(1L)).thenReturn(Optional.of(sourceAccount));
        when(accountRepository.findById(2L)).thenReturn(Optional.of(destinationAccount));

        when(accountRepository.save(sourceAccount))
                .thenThrow(new ObjectOptimisticLockingFailureException("Account", 1L)); // Throws on all attempts

        assertThrows(ObjectOptimisticLockingFailureException.class, () -> transactionService.transferFunds(request));
        
        verify(accountRepository, times(3)).findById(1L);
        verify(accountRepository, times(3)).save(sourceAccount);
    }

    @Test
    void shouldNotRetryOnInsufficientBalance() {
        TransferRequestDto request = TransferRequestDto.builder()
                .sourceAccountId(1L)
                .destinationAccountId(2L)
                .amount(new BigDecimal("1500"))
                .build();

        when(accountRepository.findById(1L)).thenReturn(Optional.of(sourceAccount));
        when(accountRepository.findById(2L)).thenReturn(Optional.of(destinationAccount));

        assertThrows(InsufficientBalanceException.class, () -> transactionService.transferFunds(request));

        verify(accountRepository, times(1)).findById(1L);
        verify(accountRepository, never()).save(any(Account.class));
    }

    @Test
    void shouldNotRetryOnSelfTransfer() {
        TransferRequestDto request = TransferRequestDto.builder()
                .sourceAccountId(1L)
                .destinationAccountId(1L)
                .amount(new BigDecimal("100"))
                .build();

        when(accountRepository.findById(1L)).thenReturn(Optional.of(sourceAccount));

        assertThrows(IllegalArgumentException.class, () -> transactionService.transferFunds(request));

        verify(accountRepository, times(2)).findById(1L);
        verify(accountRepository, never()).save(any(Account.class));
    }

    @Test
    void shouldNotRetryOnBlockedAccount() {
        sourceAccount.setStatus(AccountStatus.BLOCKED);

        TransferRequestDto request = TransferRequestDto.builder()
                .sourceAccountId(1L)
                .destinationAccountId(2L)
                .amount(new BigDecimal("100"))
                .build();

        when(accountRepository.findById(1L)).thenReturn(Optional.of(sourceAccount));
        when(accountRepository.findById(2L)).thenReturn(Optional.of(destinationAccount));

        assertThrows(AccountBlockedException.class, () -> transactionService.transferFunds(request));

        verify(accountRepository, times(1)).findById(1L);
        verify(accountRepository, never()).save(any(Account.class));
    }
}
