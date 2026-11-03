<?php
declare(strict_types=1);
namespace Lab6\Calculator;

function validate(string $inputParam): array
{
    $number = '[+-]?(?:\d+(?:\.\d*)?|\.\d+)';
    if (!preg_match('/^\s*('.$number.')\s*(\*\*|[+*\/%-])\s*('.$number.')\s*$/D', $inputParam, $matches)) {
        throw new \InvalidArgumentException('Формат: число оператор число. Оператори: + - * / ** %.');
    }
    $left=(float)$matches[1]; $right=(float)$matches[3];
    if (!is_finite($left)||!is_finite($right)) { throw new \InvalidArgumentException('Числа виходять за допустимі межі.'); }
    return [$left,$matches[2],$right];
}

function calculate(float $num1, string $operator, float $num2): int|float
{
    if (!is_finite($num1)||!is_finite($num2)) { throw new \InvalidArgumentException('Потрібні скінченні числа.'); }
    if (in_array($operator,['/','%'],true) && $num2 == 0) { throw new \DomainException('Ділення на нуль заборонене.'); }
    if ($operator==='%' && (floor($num1)!==$num1 || floor($num2)!==$num2 || abs($num1)>=PHP_INT_MAX || abs($num2)>=PHP_INT_MAX)) {
        throw new \DomainException('Залишок обчислюється для цілих чисел у межах PHP_INT_MAX.');
    }
    $operation = match($operator) {
        '+' => static fn()=> $num1+$num2, '-' => static fn()=> $num1-$num2,
        '*' => static fn()=> $num1*$num2, '/' => static fn()=> $num1/$num2,
        '**' => static fn()=> $num1**$num2, '%' => static fn()=> (int)$num1%(int)$num2,
        default => throw new \InvalidArgumentException('Невідомий оператор.')
    };
    $result = $operation();
    if (!is_finite((float)$result)) { throw new \OverflowException('Результат виходить за числові межі.'); }
    return $result;
}

function main($input=STDIN): void
{
    echo "Калькулятор. Приклад: 5 + 3. Для виходу введіть q.\n";
    while (($line=fgets($input))!==false) {
        if (trim($line)==='q') { break; }
        try { $result=calculate(...validate(trim($line))); echo 'Результат: ', $result, "\n"; }
        catch (\Throwable $error) { echo 'Помилка: ', $error->getMessage(), "\n"; }
    }
}
if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) { main(); }
