<?php
declare(strict_types=1);
session_start(['cookie_httponly'=>true,'cookie_samesite'=>'Lax']);
require_once __DIR__.'/database.php';
require_once __DIR__.'/validation.php';
function e(mixed $text): string { return htmlspecialchars((string)$text, ENT_QUOTES|ENT_SUBSTITUTE, 'UTF-8'); }
function csrfToken(): string { return $_SESSION['csrf'] ??= bin2hex(random_bytes(32)); }
function validCsrf(mixed $value): bool { return is_string($value)&&hash_equals(csrfToken(),$value); }
