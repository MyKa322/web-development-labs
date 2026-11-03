<?php
declare(strict_types=1);
function validateMeasurement(array $input): array
{
    $data=[];$errors=[];
    foreach(['title','description','unit','value','email']as$key){$data[$key]=is_string($input[$key]??null)?trim($input[$key]):'';}
    if($data['title']===''||mb_strlen($data['title'])>120){$errors['title']='Назва має містити від 1 до 120 символів.';}
    if(mb_strlen($data['description'])>2000){$errors['description']='Примітка має містити до 2000 символів.';}
    if(!in_array($data['unit'],['mm','cm','m','km'],true)){$errors['unit']='Оберіть одиницю вимірювання.';}
    if(!preg_match('/^\d{1,9}(?:\.\d{1,3})?$/D',$data['value'])){$errors['value']='Введіть невід’ємне число до 999999999.999, не більше трьох знаків після крапки.';}
    if(strlen($data['email'])>254||!filter_var($data['email'],FILTER_VALIDATE_EMAIL)){$errors['email']='Введіть коректну адресу електронної пошти.';}
    return [$data,$errors];
}
