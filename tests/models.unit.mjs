import test from 'node:test';
import assert from 'node:assert/strict';
import {countCharacters,createMultiplier,runDemo} from '../lab4/functions.mjs';
import {Car,Truck,Motorcycle,ParkingLot,ParkingSpot} from '../lab5/parking.mjs';
test('Масиви, Unicode, контекст та незалежні замикання',()=>{
  assert.equal(countCharacters(['тест','🙂']),5);assert.equal(countCharacters([]),0);
  assert.throws(()=>countCharacters([1]));const twice=createMultiplier(2),triple=createMultiplier(3);
  assert.equal(twice(7),14);assert.equal(triple(7),21);assert.equal(twice(4),8);
  assert.throws(()=>createMultiplier(Infinity));assert.throws(()=>twice(NaN));
  const data=runDemo('Windows');assert.equal(data.merged.length,20);assert.equal(data.characterCount,22);
  assert.equal(data.call,'Hello, Bohdan Rybchynskyi!');assert.equal(data.apply,'Hello, Olena Koval!');
});
test('Паркінг: розміри, два місця вантажівки, тривалість і повторний номер',()=>{
  let clock=1000;const lot=new ParkingLot([new ParkingSpot(1,1),new ParkingSpot(2,2),new ParkingSpot(3,2),new ParkingSpot(4,2)],()=>clock);
  assert.deepEqual(new Motorcycle('MC-001').park(lot).spots,[1]);
  assert.deepEqual(new Truck('TR-001').park(lot).spots,[2,3]);
  assert.throws(()=>new Truck('TR-002').park(lot),/сусідніх/);assert.equal(lot.checkFreeSpots().length,1);
  assert.throws(()=>new Car('TR-001').park(lot),/уже/);
  clock=6500;assert.equal(lot.leaveSpot('tr-001').durationSeconds,5);assert.equal(lot.checkFreeSpots().length,3);
  assert.throws(()=>lot.leaveSpot('TR-001'),/не припаркований/);
});
test('Паркінг: мотоцикл використовує автомобільне місце, зайняте місце захищене',()=>{
  const spot=new ParkingSpot(1,2);spot.assignVehicle(new Motorcycle('MC-002'));
  assert.throws(()=>spot.assignVehicle(new Car('AA-001')),/зайняте/);spot.freeSpot();
  assert.throws(()=>spot.freeSpot(),/вільне/);assert.throws(()=>new Car('!'));
  assert.throws(()=>new ParkingLot([new ParkingSpot(1,1),new ParkingSpot(1,2)]));
  const lot=new ParkingLot([new ParkingSpot(1,1)]);assert.throws(()=>new Car('AA-002').park(lot));assert.equal(lot.checkFreeSpots().length,1);
});
