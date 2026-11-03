<?php require __DIR__.'/header.php';?>
<p>Дані зберігаються у спільному журналі UnitLab. <?= $id===null?'Заповніть форму нового вимірювання.':'Змініть потрібні поля та збережіть запис.' ?></p>
<?php if($errors):?><div class="error" role="alert"><ul><?php foreach($errors as$error):?><li><?=e($error)?></li><?php endforeach;?></ul></div><?php endif;?>
<section><form method="post" action="index.php?action=<?=e($action)?>" novalidate><input type="hidden" name="csrf" value="<?=e(csrfToken())?>"><?php if($id!==null):?><input type="hidden" name="id" value="<?=e($id)?>"><?php endif;?>
<label for="title">Назва вимірювання</label><input id="title" name="title" value="<?=e($data['title'])?>" maxlength="120" required>
<label for="description">Примітка</label><textarea id="description" name="description" rows="3" maxlength="2000"><?=e($data['description'])?></textarea>
<div class="grid"><div><label for="unit">Одиниця</label><select id="unit" name="unit"><?php foreach(['mm'=>'Міліметри','cm'=>'Сантиметри','m'=>'Метри','km'=>'Кілометри']as$key=>$label):?><option value="<?=$key?>" <?=$data['unit']===$key?'selected':''?>><?=$label?></option><?php endforeach;?></select></div><div><label for="value">Довжина</label><input id="value" name="value" type="number" min="0" max="999999999.999" step="0.001" value="<?=e($data['value'])?>" required></div></div>
<label for="email">Електронна пошта автора</label><input id="email" name="email" type="email" value="<?=e($data['email'])?>" maxlength="254" required>
<div class="actions"><button><?=$id===null?'Зберегти вимірювання':'Зберегти зміни'?></button><a href="index.php">До журналу</a></div></form></section>
<?php require __DIR__.'/footer.php';?>
