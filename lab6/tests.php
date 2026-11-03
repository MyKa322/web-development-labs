<?php
declare(strict_types=1);
require __DIR__.'/guess.php';
require __DIR__.'/rps.php';
require __DIR__.'/calculator.php';
$checks=0;
function check(bool $ok,string $label): void { global $checks; $checks++;if(!$ok){throw new RuntimeException($label);}echo "PASS $label\n"; }
check(\Lab6\Guess\validate('0')===null,'guess rejects zero');
check(\Lab6\Guess\validate('12.5')===null,'guess rejects fraction');
$input=fopen('php://temp','w+');fwrite($input,"bad\n50\n25\n42\n");rewind($input);$output='';
check(\Lab6\Guess\playGame(7,42,$input,function($line)use(&$output){$output.=$line;}),'guess win');
check(str_contains($output,'Кількість спроб: 3'),'invalid input does not consume attempt');
$input=fopen('php://temp','w+');fwrite($input,"1\n1\n");rewind($input);$output='';
check(!\Lab6\Guess\playGame(2,42,$input,function($line)use(&$output){$output.=$line;}),'guess limit');
check(str_contains($output,'Загадане число: 42'),'guess reveals secret on loss');
foreach([0,1,2]as $u){foreach([0,1,2]as $c){$winner=$u===$c?'draw':(in_array([$u,$c],[[0,1],[1,2],[2,0]],true)?'user':'computer');check(\Lab6\Rps\playRound($u,$c)['winner']===$winner,"rps $u $c");}}
foreach([['5 + 3',8],['6 * 4',24],['10 % 3',1],['2 ** 5',32],['-4 - 2',-6],['7 / 2',3.5]]as[$s,$expected]){check(\Lab6\Calculator\calculate(...\Lab6\Calculator\validate($s))==$expected,$s);}
foreach(['1 / 0','10 % 0','1.2 % 2','eval(1)','1 ^ 2']as $s){$failed=false;try{\Lab6\Calculator\calculate(...\Lab6\Calculator\validate($s));}catch(Throwable){$failed=true;}check($failed,"reject $s");}
echo "TOTAL $checks checks\n";
