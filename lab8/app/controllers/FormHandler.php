<?php
declare(strict_types=1);
namespace UnitLab;
final class FormHandler
{
    public function __construct(private MeasurementValidator $validator,private MeasurementFactory $factory) {}
    public function handle(array $input,?int $id=null): array
    {
        $data=[];foreach(['title','description','unit','value','email']as$key){$data[$key]=is_string($input[$key]??null)?trim($input[$key]):'';}
        $errors=$this->validator->validate($data);
        return ['data'=>$data,'errors'=>$errors,'entity'=>$errors?null:$this->factory->create($data,$id)];
    }
}
