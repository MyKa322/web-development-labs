<?php
declare(strict_types=1);
namespace UnitLab;
final class DatabaseConnection
{
    private static ?self $instance=null;
    private \PDO $connection;
    private function __construct()
    {
        $host=getenv('DB_HOST')?:'127.0.0.1';$port=getenv('DB_PORT')?:'3307';$name=getenv('DB_NAME')?:'unitlab';
        $this->connection=new \PDO("mysql:host=$host;port=$port;dbname=$name;charset=utf8mb4",getenv('DB_USER')?:'unitlab',getenv('DB_PASSWORD')?:'',[
            \PDO::ATTR_ERRMODE=>\PDO::ERRMODE_EXCEPTION,\PDO::ATTR_DEFAULT_FETCH_MODE=>\PDO::FETCH_ASSOC,\PDO::ATTR_EMULATE_PREPARES=>false
        ]);
    }
    public static function getInstance(): self { return self::$instance??=new self(); }
    public function getConnection(): \PDO { return $this->connection; }
    private function __clone() {}
    public function __wakeup(): void { throw new \LogicException('Підключення не можна десеріалізувати.'); }
}
