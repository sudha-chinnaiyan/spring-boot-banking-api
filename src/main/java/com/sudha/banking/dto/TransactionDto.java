package com.sudha.banking.dto;

import com.sudha.banking.entity.TransactionStatus;
import com.sudha.banking.entity.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionDto {
    private Long id;
    private String transactionReference;
    private TransactionType transactionType;
    private BigDecimal amount;
    private TransactionStatus status;
    private Long sourceAccountId;
    private Long destinationAccountId;
    private Instant createdAt;
}
