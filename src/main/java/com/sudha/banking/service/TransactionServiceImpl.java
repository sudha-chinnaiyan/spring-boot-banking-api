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
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    @Override
    @Transactional
    @Retryable(
            retryFor = { ObjectOptimisticLockingFailureException.class },
            maxAttempts = 3,
            backoff = @Backoff(
                    delay = 100,
                    maxDelay = 500,
                    multiplier = 2.0
            )
    )
    public TransactionDto transferFunds(TransferRequestDto request) {
        Account sourceAccount = accountRepository.findById(request.getSourceAccountId())
                .orElseThrow(() -> new ResourceNotFoundException("Source account not found"));

        Account destinationAccount = accountRepository.findById(request.getDestinationAccountId())
                .orElseThrow(() -> new ResourceNotFoundException("Destination account not found"));

        if (request.getSourceAccountId().equals(request.getDestinationAccountId())) {
            throw new IllegalArgumentException("Cannot transfer funds to the same account");
        }

        if (sourceAccount.getStatus() != AccountStatus.ACTIVE) {
            throw new AccountBlockedException("Source account is not active");
        }

        if (destinationAccount.getStatus() != AccountStatus.ACTIVE) {
            throw new AccountBlockedException("Destination account is not active");
        }

        if (sourceAccount.getBalance().compareTo(request.getAmount()) < 0) {
            throw new InsufficientBalanceException("Insufficient funds in source account");
        }

        sourceAccount.setBalance(sourceAccount.getBalance().subtract(request.getAmount()));
        destinationAccount.setBalance(destinationAccount.getBalance().add(request.getAmount()));

        accountRepository.save(sourceAccount);
        accountRepository.save(destinationAccount);

        Transaction transaction = Transaction.builder()
                .transactionReference(UUID.randomUUID().toString())
                .transactionType(TransactionType.TRANSFER)
                .amount(request.getAmount())
                .status(TransactionStatus.COMPLETED)
                .sourceAccount(sourceAccount)
                .destinationAccount(destinationAccount)
                .build();

        Transaction savedTransaction = transactionRepository.save(transaction);

        return mapToDto(savedTransaction);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TransactionDto> getTransactionsByAccountId(Long accountId, Pageable pageable) {
        // Protection against unreasonable page sizes by capping size at 100
        int cappedSize = Math.min(pageable.getPageSize(), 100);
        Pageable cappedPageable = PageRequest.of(pageable.getPageNumber(), cappedSize, pageable.getSort());

        Page<Transaction> transactions = transactionRepository
                .findBySourceAccountIdOrDestinationAccountId(accountId, accountId, cappedPageable);
        return transactions.map(this::mapToDto);
    }

    private TransactionDto mapToDto(Transaction transaction) {
        return TransactionDto.builder()
                .id(transaction.getId())
                .transactionReference(transaction.getTransactionReference())
                .transactionType(transaction.getTransactionType())
                .amount(transaction.getAmount())
                .status(transaction.getStatus())
                .sourceAccountId(transaction.getSourceAccount() != null ? transaction.getSourceAccount().getId() : null)
                .destinationAccountId(transaction.getDestinationAccount() != null ? transaction.getDestinationAccount().getId() : null)
                .createdAt(transaction.getCreatedAt())
                .build();
    }
}
