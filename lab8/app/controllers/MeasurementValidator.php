<?php
declare(strict_types=1);
namespace UnitLab;
final class MeasurementValidator
{
    public function validate(array $data): array
    {
        $errors=[];
        if($data['title']===''||mb_strlen($data['title'])>120){$errors['title']='Назва має містити від 1 до 120 символів.';}
        if(mb_strlen($data['description'])>2000){$errors['description']='Примітка має містити до 2000 символів.';}
        if(!in_array($data['unit'],['mm','cm','m','km'],true)){$errors['unit']='Оберіть одиницю вимірювання.';}
        if(!preg_match('/^\d{1,9}(?:\.\d{1,3})?$/D',$data['value'])){$errors['value']='Потрібне невід’ємне число до 999999999.999, до трьох знаків після крапки.';}
        if(strlen($data['email'])>254||!filter_var($data['email'],FILTER_VALIDATE_EMAIL)){$errors['email']='Введіть коректну електронну адресу.';}
        return $errors;
    }
}
