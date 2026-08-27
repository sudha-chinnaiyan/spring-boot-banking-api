CREATE TABLE customers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(255) NOT NULL,
    created_at DATETIME(6),
    updated_at DATETIME(6)
);

CREATE TABLE accounts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    account_number VARCHAR(255) NOT NULL UNIQUE,
    account_type VARCHAR(255) NOT NULL,
    balance DECIMAL(19,4) NOT NULL,
    status VARCHAR(255) NOT NULL,
    customer_id BIGINT NOT NULL,
    version BIGINT,
    created_at DATETIME(6),
    updated_at DATETIME(6),
    CONSTRAINT fk_accounts_customer FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    transaction_reference VARCHAR(255) NOT NULL UNIQUE,
    transaction_type VARCHAR(255) NOT NULL,
    amount DECIMAL(19,4) NOT NULL,
    status VARCHAR(255) NOT NULL,
    source_account_id BIGINT,
    destination_account_id BIGINT,
    created_at DATETIME(6),
    CONSTRAINT fk_transactions_source FOREIGN KEY (source_account_id) REFERENCES accounts(id),
    CONSTRAINT fk_transactions_destination FOREIGN KEY (destination_account_id) REFERENCES accounts(id)
);
