<?php
declare(strict_types=1);
namespace Lab6\Guess;

function validate(string $inputParam): ?int
{
    $value = filter_var(trim($inputParam), FILTER_VALIDATE_INT, ['options'=>['min_range'=>1,'max_range'=>100]]);
    return $value === false ? null : $value;
}

function playGame(int $attempts = 7, ?int $secret = null, $input = STDIN, ?callable $write = null): bool
{
    if ($attempts < 1 || ($secret !== null && ($secret < 1 || $secret > 100))) {
        throw new \InvalidArgumentException('Некоректні параметри гри.');
    }
    $secret ??= rand(1, 100);
    $write ??= static function (string $text): void { echo $text; };
    $compare = static fn(int $guess): int => $guess <=> $secret;
    $write("Я загадав число від 1 до 100. Спроб: $attempts.\n");
    for ($used = 1; $used <= $attempts;) {
        $write("Спроба $used: ");
        $line = fgets($input);
        if ($line === false) { $write("Гру завершено: введення закінчилося.\n"); return false; }
        $guess = validate($line);
        if ($guess === null) { $write("Введіть ціле число від 1 до 100. Спробу збережено.\n"); continue; }
        $result = $compare($guess);
        if ($result === 0) { $write("Вгадано! Кількість спроб: $used.\n"); return true; }
        $write($result > 0 ? "Спробуй менше.\n" : "Спробуй більше.\n");
        $used++;
    }
    $write("Спроби закінчилися. Загадане число: $secret.\n"); return false;
}

if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) { playGame(); }
