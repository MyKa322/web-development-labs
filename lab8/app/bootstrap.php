<?php
declare(strict_types=1);
session_start(['cookie_httponly'=>true,'cookie_samesite'=>'Lax']);
spl_autoload_register(static function(string $class): void {
    if(!str_starts_with($class,'UnitLab\\')){return;}$name=substr($class,8);
    if(!preg_match('/^[A-Za-z]+$/D',$name)){return;}
    foreach(['models','controllers']as$folder){$path=__DIR__."/$folder/$name.php";if(is_file($path)){require $path;return;}}
});
function e(mixed $value): string { return htmlspecialchars((string)$value,ENT_QUOTES|ENT_SUBSTITUTE,'UTF-8'); }
function csrfToken(): string { return $_SESSION['csrf']??=bin2hex(random_bytes(32)); }
function validCsrf(mixed $value): bool { return is_string($value)&&hash_equals(csrfToken(),$value); }
