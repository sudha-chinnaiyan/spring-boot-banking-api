CREATE TABLE customers (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(255) NOT NULL,
    created_at TIMESTAMP(6),
    updated_at TIMESTAMP(6)
);

CREATE TABLE accounts (
    id BIGSERIAL PRIMARY KEY,
    account_number VARCHAR(255) NOT NULL UNIQUE,
    account_type VARCHAR(255) NOT NULL,
    balance DECIMAL(19,4) NOT NULL,
    status VARCHAR(255) NOT NULL,
    customer_id BIGINT NOT NULL,
    version BIGINT,
    created_at TIMESTAMP(6),
    updated_at TIMESTAMP(6),
    CONSTRAINT fk_accounts_customer FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE transactions (
    id BIGSERIAL PRIMARY KEY,
    transaction_reference VARCHAR(255) NOT NULL UNIQUE,
    transaction_type VARCHAR(255) NOT NULL,
    amount DECIMAL(19,4) NOT NULL,
    status VARCHAR(255) NOT NULL,
    source_account_id BIGINT,
    destination_account_id BIGINT,
    created_at TIMESTAMP(6),
    CONSTRAINT fk_transactions_source FOREIGN KEY (source_account_id) REFERENCES accounts(id),
    CONSTRAINT fk_transactions_destination FOREIGN KEY (destination_account_id) REFERENCES accounts(id)
);
