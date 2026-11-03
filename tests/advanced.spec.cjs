const {test,expect}=require('@playwright/test');
const path=require('node:path');
const fs=require('node:fs');
test.use({baseURL:process.env.LAB_APP_URL||'http://127.0.0.1:8088'});
const shots=(lab,name)=>{const dir=path.resolve(__dirname,'../..',`Laboratory№${lab}`,'Screenshots');fs.mkdirSync(dir,{recursive:true});return path.join(dir,name+'.png');};
async function fillMeasurement(page,title='Довжина кімнати'){
  await page.getByLabel('Назва вимірювання').fill(title);
  await page.getByLabel('Примітка').fill('Виміряно рулеткою після ремонту.');
  await page.getByLabel('Одиниця',{exact:true}).selectOption('m');
  await page.getByLabel('Довжина',{exact:true}).fill('4.250');
  await page.getByLabel('Електронна пошта автора').fill('student@example.test');
}
test('ЛР4: усі шість завдань і множник',async({page})=>{
  await page.goto('/lab4/');await expect(page.locator('#characterCount')).toHaveText('22');
  await expect(page.locator('#merged')).toContainText('20');await expect(page.locator('#call')).toContainText('Bohdan');
  await page.getByLabel('Множник').fill('-3');await page.getByLabel('Число',{exact:true}).fill('9');
  await page.getByRole('button',{name:'Помножити'}).click();await expect(page.locator('#multiply-result')).toHaveText('-27');
  await page.screenshot({path:shots(4,'lab4-result'),fullPage:true});
});
test('ЛР5: різні транспортні засоби, дубль і звільнення',async({page})=>{
  await page.goto('/lab5/');await expect(page.locator('#free-count')).toHaveText('8');
  await page.getByLabel('Тип',{exact:true}).selectOption('Motorcycle');await page.getByLabel('Номер',{exact:true}).fill('MC-001');
  await page.getByRole('button',{name:'Припаркувати',exact:true}).click();await expect(page.locator('#message')).toContainText('Місця: 1');
  await page.getByLabel('Тип',{exact:true}).selectOption('Truck');await page.getByLabel('Номер',{exact:true}).fill('TR-001');
  await page.getByRole('button',{name:'Припаркувати',exact:true}).click();await expect(page.locator('#message')).toContainText('3, 4');
  await expect(page.locator('#free-count')).toHaveText('5');await page.screenshot({path:shots(5,'lab5-parked'),fullPage:true});
  await page.getByRole('button',{name:'Припаркувати',exact:true}).click();await expect(page.locator('#message')).toContainText('уже припарковано');
  await page.screenshot({path:shots(5,'lab5-error'),fullPage:true});
  await page.getByLabel('Номер транспорту').fill('TR-001');await page.getByRole('button',{name:'Звільнити місця'}).click();
  await expect(page.locator('#free-count')).toHaveText('7');await expect(page.locator('#message')).toContainText('тривалість');
});
test('ЛР7: POST, валідація, XSS, MySQL і GET-сортування',async({page})=>{
  await page.goto('/lab7/');const token=await page.locator('[name=csrf]').inputValue();
  let response=await page.request.post('/lab7/',{form:{csrf:token,title:'',email:'bad',unit:'wrong',value:'-2'}});
  expect(response.status()).toBe(422);expect(await response.text()).toContain('Назва має');
  response=await page.request.post('/lab7/',{form:{csrf:'bad',title:'Тест',email:'student@example.test',unit:'m',value:'1'}});expect(response.status()).toBe(403);
  await page.goto('/lab7/');await fillMeasurement(page,'Довжина кімнати');await page.getByRole('button',{name:'Зберегти вимірювання'}).click();
  await expect(page.getByRole('status')).toContainText('додано');await expect(page.getByRole('row').filter({hasText:'Довжина кімнати'}).first()).toContainText('4.250 m');
  await page.screenshot({path:shots(7,'lab7-saved'),fullPage:true});
  await page.goto('/lab7/');await fillMeasurement(page,'<script>window.__labXss=1</script>');await page.getByRole('button',{name:'Зберегти вимірювання'}).click();
  expect(await page.evaluate(()=>window.__labXss)).toBeUndefined();await expect(page.locator('td').filter({hasText:'<script>window.__labXss=1</script>'})).toHaveCount(1);
  await page.goto('/lab7/list.php?sort=title&direction=asc');const titles=await page.locator('tbody tr td:first-child').allTextContents();expect(titles.length).toBeGreaterThan(1);
  await page.goto('/lab7/list.php?sort=title%3BDROP%20TABLE%20measurements&direction=xxx');await expect(page.getByRole('heading',{name:'Журнал вимірювань',exact:true})).toBeVisible();
  await page.goto('/lab8/');const xssRow=page.getByRole('row').filter({hasText:'<script>window.__labXss=1</script>'});await xssRow.getByRole('button',{name:'Видалити'}).click();
});
test('ЛР8: створення, редагування, перевірка POST/CSRF, видалення',async({page})=>{
  await page.goto('/lab8/index.php?action=create');await fillMeasurement(page,'Тимчасове вимірювання MVC');await page.getByRole('button',{name:'Зберегти вимірювання'}).click();
  const row=page.getByRole('row').filter({hasText:'Тимчасове вимірювання MVC'});await row.getByRole('link',{name:'Редагувати'}).click();
  await expect(page.getByLabel('Довжина',{exact:true})).toHaveValue('4.250');
  const id=await page.locator('[name=id]').inputValue();await page.getByLabel('Назва вимірювання').fill('Ширина столу');await page.getByLabel('Довжина',{exact:true}).fill('1.200');
  await page.screenshot({path:shots(8,'lab8-edit'),fullPage:true});await page.getByRole('button',{name:'Зберегти зміни'}).click();
  await expect(page.getByRole('status')).toContainText('оновлено');const edited=page.getByRole('row').filter({hasText:'Ширина столу'});await expect(edited).toContainText('1.200 m');
  await page.screenshot({path:shots(8,'lab8-list'),fullPage:true});
  let response=await page.request.get(`/lab8/index.php?action=delete&id=${id}`);expect(response.status()).toBe(405);
  response=await page.request.post('/lab8/index.php?action=delete',{form:{id,csrf:'invalid'}});expect(response.status()).toBe(403);
  response=await page.request.get('/lab8/index.php?action=edit&id=999999999');expect(response.status()).toBe(404);
  await page.reload();await edited.getByRole('button',{name:'Видалити'}).click();await expect(page.getByRole('status')).toContainText('видалено');await expect(page.getByRole('row').filter({hasText:'Ширина столу'})).toHaveCount(0);
});
test('ЛР4–8: адаптивність 375 і 1440 px та серверна валідація MVC',async({page})=>{
  for(const width of[375,1440]){await page.setViewportSize({width,height:1000});for(const route of['/lab4/','/lab5/','/lab7/','/lab8/']){await page.goto(route);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}}
  await page.goto('/lab8/index.php?action=create');await fillMeasurement(page,'Перевірка помилки');await page.getByLabel('Електронна пошта автора').fill('wrong');await page.getByRole('button',{name:'Зберегти вимірювання'}).click();
  await expect(page.getByRole('alert')).toContainText('електронну адресу');await page.screenshot({path:shots(8,'lab8-validation'),fullPage:true});
  await page.setViewportSize({width:375,height:900});await page.goto('/lab7/');await page.screenshot({path:shots(7,'lab7-mobile'),fullPage:true});
});
