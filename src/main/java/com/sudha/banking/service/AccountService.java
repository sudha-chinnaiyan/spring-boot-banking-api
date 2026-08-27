package com.sudha.banking.service;

import com.sudha.banking.dto.AccountCreateDto;
import com.sudha.banking.dto.AccountDto;

import java.util.List;

public interface AccountService {
    AccountDto createAccount(AccountCreateDto accountCreateDto);
    AccountDto getAccountById(Long id);
    List<AccountDto> getAccountsByCustomerId(Long customerId);
}
