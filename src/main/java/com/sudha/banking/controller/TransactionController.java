package com.sudha.banking.controller;

import com.sudha.banking.dto.TransactionDto;
import com.sudha.banking.dto.TransferRequestDto;
import com.sudha.banking.service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/transactions")
@RequiredArgsConstructor
@Tag(name = "Transaction", description = "Transaction management APIs")
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping("/transfer")
    @Operation(summary = "Transfer funds between two accounts")
    public ResponseEntity<TransactionDto> transferFunds(@Valid @RequestBody TransferRequestDto request) {
        return ResponseEntity.ok(transactionService.transferFunds(request));
    }

    @GetMapping("/account/{accountId}")
    @Operation(summary = "Get all transactions for an account")
    public ResponseEntity<List<TransactionDto>> getTransactionsByAccountId(@PathVariable Long accountId) {
        return ResponseEntity.ok(transactionService.getTransactionsByAccountId(accountId));
    }
}
