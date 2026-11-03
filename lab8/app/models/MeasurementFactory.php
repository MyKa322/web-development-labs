<?php
declare(strict_types=1);
namespace UnitLab;
final class MeasurementFactory
{
    public function create(array $data,?int $id=null): Measurement
    {
        return new Measurement($id,$data['title'],$data['description'],$data['unit'],$data['value'],$data['email']);
    }
}
