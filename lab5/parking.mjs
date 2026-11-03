export class Vehicle {
  constructor(licensePlate, size) {
    if (typeof licensePlate !== 'string' || !/^[\p{L}\p{N} -]{3,15}$/u.test(licensePlate.trim())) throw new Error('Номер має містити 3–15 літер, цифр, пробілів або дефісів.');
    this.licensePlate=licensePlate.trim().toUpperCase(); this.size=size;
  }
  canUse(spot) { return spot.size >= this.size; }
  park(lot) { return lot.parkVehicle(this); }
}
export class Car extends Vehicle { constructor(plate,trunkSize=400) { super(plate,2);this.trunkSize=trunkSize; } }
export class Truck extends Vehicle {
  constructor(plate,cargoWeight=5000) { super(plate,4);this.cargoWeight=cargoWeight; }
  canUse(spot) { return spot.size===2; }
}
export class Motorcycle extends Vehicle { constructor(plate) { super(plate,1); } }
export class ParkingSpot {
  #vehicle=null;
  constructor(spotNumber,size) {
    if (!Number.isInteger(spotNumber)||spotNumber<1||![1,2].includes(size)) throw new Error('Некоректні параметри місця.');
    Object.defineProperties(this,{spotNumber:{value:spotNumber,enumerable:true},size:{value:size,enumerable:true}});
  }
  get isOccupied() { return this.#vehicle!==null; }
  get licensePlate() { return this.#vehicle?.licensePlate ?? null; }
  assignVehicle(vehicle) {
    if (this.isOccupied) throw new Error('Місце вже зайняте.');
    if (!(vehicle instanceof Vehicle)||!vehicle.canUse(this)) throw new Error('Розмір місця не підходить.');
    this.#vehicle=vehicle;
  }
  freeSpot() { if (!this.isOccupied) throw new Error('Місце вже вільне.');this.#vehicle=null; }
}
export class ParkingLot {
  #spots; #sessions=new Map(); #now;
  constructor(spots,now=()=>Date.now()) {
    if (!Array.isArray(spots)||spots.some(s=>!(s instanceof ParkingSpot))||new Set(spots.map(s=>s.spotNumber)).size!==spots.length) throw new Error('Потрібні місця з різними номерами.');
    this.#spots=[...spots].sort((a,b)=>a.spotNumber-b.spotNumber);this.#now=now;
  }
  get spots() { return this.#spots.map(s=>({spotNumber:s.spotNumber,size:s.size,isOccupied:s.isOccupied,licensePlate:s.licensePlate})); }
  get sessions() { return [...this.#sessions.values()].map(s=>({...s,spots:[...s.spots],durationSeconds:Math.max(0,Math.floor((this.#now()-s.startedAt)/1000))})); }
  checkFreeSpots() { return this.spots.filter(s=>!s.isOccupied); }
  parkVehicle(vehicle) {
    if (!(vehicle instanceof Vehicle)) throw new Error('Невідомий транспортний засіб.');
    if (this.#sessions.has(vehicle.licensePlate)) throw new Error('Транспорт із цим номером уже припарковано.');
    const free=this.#spots.filter(s=>!s.isOccupied&&vehicle.canUse(s));
    let selected;
    if (vehicle instanceof Truck) {
      const first=free.find(s=>free.some(next=>next.spotNumber===s.spotNumber+1));
      selected=first ? [first,free.find(s=>s.spotNumber===first.spotNumber+1)] : [];
    } else selected=[...free].sort((a,b)=>a.size-b.size||a.spotNumber-b.spotNumber).slice(0,1);
    if (!selected.length) throw new Error(vehicle instanceof Truck?'Немає двох сусідніх автомобільних місць.':'Немає відповідного вільного місця.');
    selected.forEach(s=>s.assignVehicle(vehicle));
    const session={licensePlate:vehicle.licensePlate,type:vehicle.constructor.name,spots:selected.map(s=>s.spotNumber),startedAt:this.#now()};
    this.#sessions.set(vehicle.licensePlate,session);return {...session,spots:[...session.spots]};
  }
  leaveSpot(licensePlate) {
    const key=String(licensePlate).trim().toUpperCase();const session=this.#sessions.get(key);
    if (!session) throw new Error('Транспорт із цим номером не припаркований.');
    const endedAt=this.#now();session.spots.forEach(n=>this.#spots.find(s=>s.spotNumber===n).freeSpot());this.#sessions.delete(key);
    return {...session,endedAt,durationSeconds:Math.max(0,Math.floor((endedAt-session.startedAt)/1000))};
  }
}
