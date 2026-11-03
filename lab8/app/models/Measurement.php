<?php
declare(strict_types=1);
namespace UnitLab;
final class Measurement
{
    public function __construct(public readonly ?int $id,public readonly string $title,public readonly string $description,public readonly string $unit,public readonly string $value,public readonly string $email) {}
    public function toArray(): array { return ['title'=>$this->title,'description'=>$this->description,'unit'=>$this->unit,'value'=>$this->value,'email'=>$this->email]; }
}
