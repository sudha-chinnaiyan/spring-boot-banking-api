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
import com.sudha.banking.exception.ResourceNotFoundException;
import com.sudha.banking.repository.AccountRepository;
import com.sudha.banking.repository.TransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.orm.ObjectOptimisticLockingFailureException;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TransactionServiceTest {

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private TransactionRepository transactionRepository;

    @InjectMocks
    private TransactionServiceImpl transactionService;

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
    void shouldTransferFundsSuccessfully() {
        TransferRequestDto request = TransferRequestDto.builder()
                .sourceAccountId(1L)
                .destinationAccountId(2L)
                .amount(new BigDecimal("200"))
                .build();

        when(accountRepository.findById(1L)).thenReturn(Optional.of(sourceAccount));
        when(accountRepository.findById(2L)).thenReturn(Optional.of(destinationAccount));
        
        Transaction savedTransaction = Transaction.builder()
                .id(10L)
                .transactionReference("TXN-123")
                .transactionType(TransactionType.TRANSFER)
                .amount(new BigDecimal("200"))
                .status(TransactionStatus.COMPLETED)
                .sourceAccount(sourceAccount)
                .destinationAccount(destinationAccount)
                .build();
                
        when(transactionRepository.save(any(Transaction.class))).thenReturn(savedTransaction);

        TransactionDto result = transactionService.transferFunds(request);

        assertThat(result.getId()).isEqualTo(10L);
        assertThat(result.getStatus()).isEqualTo(TransactionStatus.COMPLETED);
        
        // Assert balances were updated before save
        assertThat(sourceAccount.getBalance()).isEqualTo(new BigDecimal("800"));
        assertThat(destinationAccount.getBalance()).isEqualTo(new BigDecimal("700"));
        
        verify(accountRepository).save(sourceAccount);
        verify(accountRepository).save(destinationAccount);
    }

    @Test
    void shouldThrowExceptionWhenInsufficientFunds() {
        TransferRequestDto request = TransferRequestDto.builder()
                .sourceAccountId(1L)
                .destinationAccountId(2L)
                .amount(new BigDecimal("1500")) // Exceeds 1000 balance
                .build();

        when(accountRepository.findById(1L)).thenReturn(Optional.of(sourceAccount));
        when(accountRepository.findById(2L)).thenReturn(Optional.of(destinationAccount));

        assertThrows(InsufficientBalanceException.class, () -> transactionService.transferFunds(request));
    }

    @Test
    void shouldThrowExceptionWhenAccountBlocked() {
        sourceAccount.setStatus(AccountStatus.BLOCKED);
        
        TransferRequestDto request = TransferRequestDto.builder()
                .sourceAccountId(1L)
                .destinationAccountId(2L)
                .amount(new BigDecimal("100"))
                .build();

        when(accountRepository.findById(1L)).thenReturn(Optional.of(sourceAccount));
        when(accountRepository.findById(2L)).thenReturn(Optional.of(destinationAccount));

        assertThrows(AccountBlockedException.class, () -> transactionService.transferFunds(request));
    }

    @Test
    void shouldThrowExceptionWhenSelfTransfer() {
        TransferRequestDto request = TransferRequestDto.builder()
                .sourceAccountId(1L)
                .destinationAccountId(1L)
                .amount(new BigDecimal("100"))
                .build();

        when(accountRepository.findById(1L)).thenReturn(Optional.of(sourceAccount));

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, 
                () -> transactionService.transferFunds(request));
        assertThat(exception.getMessage()).isEqualTo("Cannot transfer funds to the same account");
    }

    @Test
    void shouldThrowExceptionWhenSourceAccountNotFound() {
        TransferRequestDto request = TransferRequestDto.builder()
                .sourceAccountId(99L)
                .destinationAccountId(2L)
                .amount(new BigDecimal("100"))
                .build();

        when(accountRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> transactionService.transferFunds(request));
    }

    @Test
    void shouldThrowExceptionWhenDestinationAccountNotFound() {
        TransferRequestDto request = TransferRequestDto.builder()
                .sourceAccountId(1L)
                .destinationAccountId(99L)
                .amount(new BigDecimal("100"))
                .build();

        when(accountRepository.findById(1L)).thenReturn(Optional.of(sourceAccount));
        when(accountRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> transactionService.transferFunds(request));
    }

    @Test
    void shouldPropagateOptimisticLockingFailure() {
        TransferRequestDto request = TransferRequestDto.builder()
                .sourceAccountId(1L)
                .destinationAccountId(2L)
                .amount(new BigDecimal("200"))
                .build();

        when(accountRepository.findById(1L)).thenReturn(Optional.of(sourceAccount));
        when(accountRepository.findById(2L)).thenReturn(Optional.of(destinationAccount));
        when(accountRepository.save(sourceAccount)).thenThrow(new ObjectOptimisticLockingFailureException("Account", 1L));

        assertThrows(ObjectOptimisticLockingFailureException.class, () -> transactionService.transferFunds(request));
    }

    @Test
    void shouldGetTransactionsPaginated_FirstPage() {
        Transaction txn1 = Transaction.builder()
                .id(100L)
                .transactionReference("TXN-1")
                .amount(new BigDecimal("100"))
                .build();
        Transaction txn2 = Transaction.builder()
                .id(101L)
                .transactionReference("TXN-2")
                .amount(new BigDecimal("200"))
                .build();

        Pageable pageable = PageRequest.of(0, 2, Sort.by("createdAt").descending());
        Page<Transaction> pageResponse = new PageImpl<>(List.of(txn1, txn2), pageable, 5);

        when(transactionRepository.findBySourceAccountIdOrDestinationAccountId(1L, 1L, pageable)).thenReturn(pageResponse);

        Page<TransactionDto> result = transactionService.getTransactionsByAccountId(1L, pageable);

        assertThat(result.getContent()).hasSize(2);
        assertThat(result.getTotalElements()).isEqualTo(5);
        assertThat(result.getTotalPages()).isEqualTo(3);
        assertThat(result.getContent().get(0).getId()).isEqualTo(100L);
    }

    @Test
    void shouldGetTransactionsPaginated_EmptyHistory() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Transaction> emptyPage = new PageImpl<>(Collections.emptyList(), pageable, 0);

        when(transactionRepository.findBySourceAccountIdOrDestinationAccountId(1L, 1L, pageable)).thenReturn(emptyPage);

        Page<TransactionDto> result = transactionService.getTransactionsByAccountId(1L, pageable);

        assertThat(result.getContent()).isEmpty();
        assertThat(result.getTotalElements()).isZero();
    }

    @Test
    void shouldGetTransactionsPaginated_CappedPageSize() {
        Pageable requestedPageable = PageRequest.of(0, 150); // size > 100
        Pageable expectedPageable = PageRequest.of(0, 100);
        
        Page<Transaction> expectedPage = new PageImpl<>(Collections.emptyList(), expectedPageable, 0);
        when(transactionRepository.findBySourceAccountIdOrDestinationAccountId(1L, 1L, expectedPageable)).thenReturn(expectedPage);

        transactionService.getTransactionsByAccountId(1L, requestedPageable);

        verify(transactionRepository).findBySourceAccountIdOrDestinationAccountId(1L, 1L, expectedPageable);
    }

    @Test
    void shouldGetTransactionsPaginated_PageBeyondData() {
        Pageable pageable = PageRequest.of(5, 10);
        Page<Transaction> emptyPage = new PageImpl<>(Collections.emptyList(), pageable, 2);

        when(transactionRepository.findBySourceAccountIdOrDestinationAccountId(1L, 1L, pageable)).thenReturn(emptyPage);

        Page<TransactionDto> result = transactionService.getTransactionsByAccountId(1L, pageable);

        assertThat(result.getContent()).isEmpty();
        assertThat(result.getTotalElements()).isEqualTo(2);
    }
}
