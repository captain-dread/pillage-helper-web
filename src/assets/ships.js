class Ship {
  constructor(
    shipType,
    size,
    movesPerTurn,
    shotsPerMove,
    cannonSize,
    maxPillageDamage,
    maxSinkDamage,
    rockDamage,
    ramDamage
  ) {
    this.shipType = shipType;
    this.size = size.toLowerCase();
    this.movesPerTurn = movesPerTurn;
    this.shotsPerMove = shotsPerMove;
    this.cannonSize = cannonSize.toLowerCase();
    this.maxPillageDamage = maxPillageDamage;
    this.maxSinkDamage = maxSinkDamage;
    this.rockDamage = rockDamage;
    this.ramDamage = ramDamage;
    this.imagePath = `./images/${this.shipType.replace(" ", "_")}.png`;
  }
}

class Damage {
  constructor(small, medium, large) {
    this.small = small;
    this.medium = medium;
    this.large = large;
  }

  get(cannonSize) {
    switch (cannonSize.toLowerCase()) {
      case "small":
        return this.small;
      case "medium":
        return this.medium;
      case "large":
        return this.large;
      default:
        throw new Error(
          `'${cannonSize}' cannon size not recognized. Please use 'small', 'medium', or 'large'.`
        );
    }
  }
}

let ships = [
  new Ship(
    "Sloop",
    "Small",
    4,
    1,
    "small",
    new Damage(6, 4, 3),
    new Damage(10, 6.667, 5),
    new Damage(0.5, 0.333, 0.25),
    new Damage(0.5, 0.333, 0.25)
  ),
  new Ship(
    "Cutter",
    "Small",
    4,
    1,
    "small",
    new Damage(7.5, 5, 3.75),
    new Damage(12, 8, 6),
    new Damage(0.625, 0.417, 0.3125),
    new Damage(0.5, 0.333, 0.25)
  ),
  new Ship(
    "Dhow",
    "Small",
    4,
    1,
    "medium",
    new Damage(7.5, 5, 3.75),
    new Damage(12, 8, 6),
    new Damage(0.625, 0.417, 0.3125),
    new Damage(0.5, 0.333, 0.25)
  ),
  new Ship(
    "Fanchuan",
    "Small",
    3,
    1,
    "large",
    new Damage(7.875, 5.225, 3.9375),
    new Damage(13.125, 8.75, 6.5625),
    new Damage(0.65625, 0.4375, 0.328125),
    new Damage(0.5, 0.333, 0.25)
  ),
  new Ship(
    "Longship",
    "Medium",
    4,
    2,
    "small",
    new Damage(9, 6, 4.5),
    new Damage(15, 10, 7.5),
    new Damage(0.75, 0.5, 0.375),
    new Damage(0.5, 0.333, 0.25)
  ),
  new Ship(
    "Baghlah",
    "Medium",
    3,
    2,
    "medium",
    new Damage(12, 8, 6),
    new Damage(20, 13.333, 10),
    new Damage(1, 0.667, 0.5),
    new Damage(1, 0.667, 0.5)
  ),
  new Ship(
    "Merchant Brig",
    "Medium",
    3,
    1,
    "medium",
    new Damage(12, 8, 6),
    new Damage(20, 13.333, 10),
    new Damage(1, 0.667, 0.5),
    new Damage(1, 0.667, 0.5)
  ),
  new Ship(
    "Junk",
    "Medium",
    3,
    1,
    "large",
    new Damage(15, 10, 7.5),
    new Damage(25, 16.66, 12.5),
    new Damage(1.25, 0.833, 0.625),
    new Damage(1.5, 1, 0.75)
  ),
  new Ship(
    "War Brig",
    "Medium",
    3,
    2,
    "medium",
    new Damage(15, 10, 7.5),
    new Damage(25, 16.667, 12.5),
    new Damage(1.25, 0.833, 0.625),
    new Damage(2, 1.333, 1)
  ),
  new Ship(
    "Merchant Galleon",
    "Large",
    3,
    1,
    "large",
    new Damage(18, 12, 9),
    new Damage(30, 20, 15),
    new Damage(1.5, 1, 0.75),
    new Damage(2.5, 1.667, 1.25)
  ),
  new Ship(
    "Xebec",
    "Large",
    3,
    2,
    "medium",
    new Damage(21, 14, 10.5),
    new Damage(25, 23.3333, 17.5),
    new Damage(1.75, 1.167, 0.875),
    new Damage(2.5, 1.667, 1.25)
  ),
  new Ship(
    "War Galleon",
    "Large",
    3,
    2,
    "large",
    new Damage(15, 10, 7.5),
    new Damage(25, 16.667, 12.5),
    new Damage(1.75, 1.167, 0.875),
    new Damage(2.5, 1.667, 1.25)
  ),
  new Ship(
    "War Frigate",
    "Large",
    3,
    2,
    "large",
    new Damage(30, 20, 15),
    new Damage(50, 33.333, 25),
    new Damage(2.5, 1.667, 1.25),
    new Damage(3, 2, 1.5)
  ),
  new Ship(
    "Grand Frigate",
    "Large",
    3,
    2,
    "large",
    new Damage(36, 24, 18),
    new Damage(60, 40, 30),
    new Damage(3, 2, 1.5),
    new Damage(4, 2.667, 2)
  ),
];

export { Ship, ships };
