<?php
require __DIR__.'/app/bootstrap.php';$pageTitle='Журнал вимірювань';
$sort=is_string($_GET['sort']??null)?$_GET['sort']:'created_at';$direction=is_string($_GET['direction']??null)?$_GET['direction']:'desc';
$rows=[];$error='';try{$rows=allMeasurements($sort,$direction);}catch(PDOException $exception){error_log($exception->getMessage());$error='База даних тимчасово недоступна.';http_response_code(503);}
$flash=$_SESSION['flash']??'';unset($_SESSION['flash']);require __DIR__.'/app/header.php';
?>
<?php if($flash):?><p class="success" role="status"><?=e($flash)?></p><?php endif;?>
<?php if($error):?><p class="error"><?=e($error)?></p><?php endif;?>
<form method="get" class="actions"><label for="sort">Сортувати за</label><select id="sort" name="sort" class="inline-input"><?php foreach(['created_at'=>'Часом','title'=>'Назвою','value'=>'Довжиною']as$key=>$label):?><option value="<?=$key?>" <?=$sort===$key?'selected':''?>><?=$label?></option><?php endforeach;?></select><select name="direction" aria-label="Порядок" class="inline-input"><option value="desc" <?=$direction!=='asc'?'selected':''?>>За спаданням</option><option value="asc" <?=$direction==='asc'?'selected':''?>>За зростанням</option></select><button>Застосувати</button></form>
<section><div class="table-wrap"><table><thead><tr><th>Назва</th><th>Примітка</th><th>Довжина</th><th>Контакт</th><th>Додано</th></tr></thead><tbody><?php foreach($rows as$row):?><tr><td><?=e($row['title'])?></td><td><?=e($row['description'])?></td><td><?=e($row['value'].' '.$row['unit'])?></td><td><?=e($row['email'])?></td><td><?=e($row['created_at'])?></td></tr><?php endforeach;?><?php if(!$rows):?><tr><td colspan="5">Журнал порожній. Додайте перше вимірювання.</td></tr><?php endif;?></tbody></table></div></section><a class="button" href="index.php">Додати вимірювання</a>
<?php require __DIR__.'/app/footer.php';?>
