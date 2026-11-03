import {Car,Truck,Motorcycle,ParkingLot,ParkingSpot} from './parking.mjs';
const lot=new ParkingLot(Array.from({length:8},(_,i)=>new ParkingSpot(i+1,i<2?1:2)));
const types={Car,Truck,Motorcycle};const message=document.getElementById('message');
function render() {
  const body=document.getElementById('spots');body.replaceChildren();
  for (const spot of lot.spots) {
    const row=document.createElement('tr');
    for(const value of [spot.spotNumber,spot.size===1?'Мотоцикл':'Автомобіль',spot.licensePlate??'Вільне']) { const cell=document.createElement('td');cell.textContent=String(value);row.append(cell); }
    body.append(row);
  }
  document.getElementById('free-count').textContent=lot.checkFreeSpots().length;
  document.getElementById('sessions').textContent=lot.sessions.length ? lot.sessions.map(s=>`${s.licensePlate}: місця ${s.spots.join(', ')}, ${s.durationSeconds} с`).join('\n') : 'Зараз транспортних засобів немає.';
}
document.getElementById('park').addEventListener('submit',event=>{
  event.preventDefault();try { const item=new types[document.getElementById('type').value](document.getElementById('plate').value);const session=item.park(lot);message.textContent=`Припарковано ${session.licensePlate}. Місця: ${session.spots.join(', ')}.`;message.className='success'; } catch(error) { message.textContent=error.message;message.className='error'; }render();
});
document.getElementById('leave').addEventListener('submit',event=>{
  event.preventDefault();try {const session=lot.leaveSpot(document.getElementById('leave-plate').value);message.textContent=`${session.licensePlate}: паркування завершено, тривалість ${session.durationSeconds} с.`;message.className='success';}catch(error){message.textContent=error.message;message.className='error';}render();
});
render();setInterval(render,1000);
