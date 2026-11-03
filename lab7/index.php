<?php
require __DIR__.'/app/bootstrap.php';
$pageTitle='Нове вимірювання';$data=['title'=>'','description'=>'','unit'=>'m','value'=>'','email'=>''];$errors=[];
if($_SERVER['REQUEST_METHOD']==='POST'){
    [$data,$errors]=validateMeasurement($_POST);
    if(!validCsrf($_POST['csrf']??null)){$errors['csrf']='Сеанс форми закінчився. Оновіть сторінку.';http_response_code(403);}
    if(!$errors){
        try{$id=addMeasurement($data);$_SESSION['flash']="Вимірювання №$id додано.";header('Location: list.php',true,303);exit;}
        catch(PDOException $error){error_log($error->getMessage());$errors['database']='Не вдалося зберегти дані. Спробуйте пізніше.';http_response_code(503);}
    }elseif(http_response_code()!==403){http_response_code(422);}
}
require __DIR__.'/app/header.php';
?>
<p>Збережіть результат конвертації з назвою, одиницею вимірювання та контактом автора.</p>
<?php if($errors):?><div class="error" role="alert"><ul><?php foreach($errors as$error):?><li><?=e($error)?></li><?php endforeach;?></ul></div><?php endif;?>
<section><form method="post" novalidate><input type="hidden" name="csrf" value="<?=e(csrfToken())?>">
<label for="title">Назва вимірювання</label><input id="title" name="title" value="<?=e($data['title'])?>" maxlength="120" required>
<label for="description">Примітка</label><textarea id="description" name="description" rows="3" maxlength="2000"><?=e($data['description'])?></textarea>
<div class="grid"><div><label for="unit">Одиниця</label><select id="unit" name="unit"><?php foreach(['mm'=>'Міліметри','cm'=>'Сантиметри','m'=>'Метри','km'=>'Кілометри']as$key=>$label):?><option value="<?=$key?>" <?=$data['unit']===$key?'selected':''?>><?=$label?></option><?php endforeach;?></select></div><div><label for="value">Довжина</label><input id="value" name="value" type="number" min="0" max="999999999.999" step="0.001" value="<?=e($data['value'])?>" required></div></div>
<label for="email">Електронна пошта автора</label><input id="email" name="email" type="email" value="<?=e($data['email'])?>" maxlength="254" required>
<div class="actions"><button>Зберегти вимірювання</button><a href="list.php">Переглянути журнал</a></div></form></section>
<?php require __DIR__.'/app/footer.php';?>
