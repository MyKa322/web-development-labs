<?php
declare(strict_types=1);
namespace UnitLab;
final class MeasurementController
{
    public function __construct(private MeasurementRepository $repository,private FormHandler $forms) {}
    public function dispatch(string $action): void
    {
        if(!in_array($action,['list','create','edit','delete'],true)){http_response_code(404);echo 'Сторінку не знайдено.';return;}
        if($action==='list'){
            $sort=is_string($_GET['sort']??null)?$_GET['sort']:'created_at';$direction=is_string($_GET['direction']??null)?$_GET['direction']:'desc';
            $this->render('list',['pageTitle'=>'Журнал вимірювань MVC','rows'=>$this->repository->all($sort,$direction),'sort'=>$sort,'direction'=>$direction]);return;
        }
        $id=null;
        if(in_array($action,['edit','delete'],true)){
            $raw=$_SERVER['REQUEST_METHOD']==='POST'?($_POST['id']??null):($_GET['id']??null);
            $id=filter_var($raw,FILTER_VALIDATE_INT,['options'=>['min_range'=>1]]);
            if($id===false||$id===null||!$row=$this->repository->find($id)){http_response_code(404);echo 'Вимірювання не знайдено.';return;}
        }
        if($action==='delete'){
            if($_SERVER['REQUEST_METHOD']!=='POST'){http_response_code(405);header('Allow: POST');echo 'Для видалення потрібен POST.';return;}
            if(!\validCsrf($_POST['csrf']??null)){http_response_code(403);echo 'Недійсний сеанс форми.';return;}
            $this->repository->delete($id);$this->redirect('Вимірювання видалено.');return;
        }
        $data=$id===null?['title'=>'','description'=>'','unit'=>'m','value'=>'','email'=>'']:$row;$errors=[];
        if($_SERVER['REQUEST_METHOD']==='POST'){
            $result=$this->forms->handle($_POST,$id);$data=$result['data'];$errors=$result['errors'];
            if(!\validCsrf($_POST['csrf']??null)){$errors['csrf']='Сеанс форми закінчився. Оновіть сторінку.';http_response_code(403);}
            if(!$errors){$saved=$this->repository->save($result['entity']);$this->redirect($id===null?"Вимірювання №$saved додано.":"Вимірювання №$saved оновлено.");return;}
            if(http_response_code()!==403){http_response_code(422);}
        }
        $this->render('form',['pageTitle'=>$id===null?'Нове вимірювання':'Редагування вимірювання','data'=>$data,'errors'=>$errors,'id'=>$id,'action'=>$action]);
    }
    private function redirect(string $message): void { $_SESSION['flash']=$message;header('Location: index.php',true,303); }
    private function render(string $view,array $vars): void { extract($vars,EXTR_SKIP);require __DIR__.'/../views/'.$view.'.php'; }
}
