package com.sudha.banking.service;

import com.sudha.banking.dto.TransactionDto;
import com.sudha.banking.dto.TransferRequestDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TransactionService {
    TransactionDto transferFunds(TransferRequestDto request);
    Page<TransactionDto> getTransactionsByAccountId(Long accountId, Pageable pageable);
}
