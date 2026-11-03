<?php
declare(strict_types=1);
namespace UnitLab;
final class MeasurementRepository
{
    public function __construct(private \PDO $db) {}
    public function all(string $sort,string $direction): array
    {
        $column=in_array($sort,['title','value','created_at'],true)?$sort:'created_at';$order=$direction==='asc'?'ASC':'DESC';
        return $this->db->query("SELECT * FROM measurements ORDER BY $column $order,id DESC")->fetchAll();
    }
    public function find(int $id): ?array
    {
        $query=$this->db->prepare('SELECT * FROM measurements WHERE id=:id');$query->execute(['id'=>$id]);return $query->fetch()?:null;
    }
    public function save(Measurement $measurement): int
    {
        $data=$measurement->toArray();
        if($measurement->id===null){$sql='INSERT INTO measurements (title,description,unit,value,email) VALUES (:title,:description,:unit,:value,:email)';}
        else{$sql='UPDATE measurements SET title=:title,description=:description,unit=:unit,value=:value,email=:email WHERE id=:id';$data['id']=$measurement->id;}
        $this->db->prepare($sql)->execute($data);return $measurement->id??(int)$this->db->lastInsertId();
    }
    public function delete(int $id): bool
    {
        $query=$this->db->prepare('DELETE FROM measurements WHERE id=:id');$query->execute(['id'=>$id]);return $query->rowCount()===1;
    }
}
