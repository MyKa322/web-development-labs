<?php
declare(strict_types=1);
namespace Lab6\Rps;

function validate(string $inputParam): ?int
{
    $value = trim($inputParam);
    return in_array($value, ['0','1','2'], true) ? (int)$value : null;
}

function playRound(int $userChoice, ?int $computerChoice = null): array
{
    if (!in_array($userChoice, [0,1,2], true) || ($computerChoice !== null && !in_array($computerChoice,[0,1,2],true))) {
        throw new \InvalidArgumentException('Вибір має бути від 0 до 2.');
    }
    $choose = static fn(): int => random_int(0, 2);
    $computerChoice ??= $choose();
    $winner = $userChoice === $computerChoice ? 'draw' : (in_array([$userChoice,$computerChoice],[[0,1],[1,2],[2,0]],true) ? 'user' : 'computer');
    return ['user'=>$userChoice,'computer'=>$computerChoice,'winner'=>$winner];
}

function playGame($input = STDIN): void
{
    $names = ['камінь','ножиці','папір']; $score = ['user'=>0,'computer'=>0];
    for ($round = 1; $round <= 3;) {
        echo "Раунд $round. [0] камінь, [1] ножиці, [2] папір: ";
        $line = fgets($input);
        if ($line === false) { echo "Гру завершено: введення закінчилося.\n"; return; }
        $choice = validate($line);
        if ($choice === null) { echo "Некоректний вибір. Раунд не витрачено.\n"; continue; }
        $result = playRound($choice);
        if ($result['winner'] !== 'draw') { $score[$result['winner']]++; }
        echo "Комп’ютер: {$names[$result['computer']]}. ", match($result['winner']) {'user'=>'Раунд виграв гравець.','computer'=>'Раунд виграв комп’ютер.',default=>'Нічия.'}, "\nРахунок: {$score['user']}:{$score['computer']}.\n";
        $round++;
    }
    echo match($score['user'] <=> $score['computer']) {1=>'Переміг гравець.',-1=>'Переміг комп’ютер.',default=>'Гра завершилася внічию.'}, "\n";
}

if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) { playGame(); }
