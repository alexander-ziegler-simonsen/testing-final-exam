# error codes

when dealing with negative tests, you need to know about the error codes, that postgres sends back.
this links cover them all
https://www.postgresql.org/docs/current/errcodes-appendix.html

22001 — string_data_right_truncation (value too long for varchar/char)
23505 — unique_violation
23503 — foreign_key_violation
23502 — not_null_violation
22003 — numeric_value_out_of_range (numeric/int overflow, not string length)
23514 — check_violation

# how to set it up

https://testcontainers.com/modules/postgresql/?language=nodejs
https://node.testcontainers.org/modules/postgresql/

