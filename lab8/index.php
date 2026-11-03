<?php
declare(strict_types=1);
require __DIR__.'/app/bootstrap.php';
try{
    $repository=new UnitLab\MeasurementRepository(UnitLab\DatabaseConnection::getInstance()->getConnection());
    $forms=new UnitLab\FormHandler(new UnitLab\MeasurementValidator(),new UnitLab\MeasurementFactory());
    $controller=new UnitLab\MeasurementController($repository,$forms);
    $controller->dispatch(is_string($_GET['action']??null)?$_GET['action']:'list');
}catch(PDOException $error){error_log($error->getMessage());http_response_code(503);echo 'База даних тимчасово недоступна.';}
