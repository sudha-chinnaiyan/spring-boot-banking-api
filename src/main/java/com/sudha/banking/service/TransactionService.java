package com.sudha.banking.service;

import com.sudha.banking.dto.TransactionDto;
import com.sudha.banking.dto.TransferRequestDto;

import java.util.List;

public interface TransactionService {
    TransactionDto transferFunds(TransferRequestDto request);
    List<TransactionDto> getTransactionsByAccountId(Long accountId);
}
