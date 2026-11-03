<?php
declare(strict_types=1);
function db(): PDO
{
    static $connection=null;
    if($connection===null){
        $host=getenv('DB_HOST')?:'127.0.0.1';$port=getenv('DB_PORT')?:'3307';$name=getenv('DB_NAME')?:'unitlab';
        $connection=new PDO("mysql:host=$host;port=$port;dbname=$name;charset=utf8mb4",getenv('DB_USER')?:'unitlab',getenv('DB_PASSWORD')?:'',[
            PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION,PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC,PDO::ATTR_EMULATE_PREPARES=>false
        ]);
    }
    return $connection;
}
function addMeasurement(array $data): int
{
    $stmt=db()->prepare('INSERT INTO measurements (title,description,unit,value,email) VALUES (:title,:description,:unit,:value,:email)');
    $stmt->execute($data);return (int)db()->lastInsertId();
}
function allMeasurements(string $sort, string $direction): array
{
    $column=in_array($sort,['created_at','title','value'],true)?$sort:'created_at';
    $order=$direction==='asc'?'ASC':'DESC';
    return db()->query("SELECT * FROM measurements ORDER BY $column $order, id DESC")->fetchAll();
}
