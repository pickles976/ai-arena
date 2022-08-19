const energy = 50
if (this.resources.metal > this.shipcost && this.resources.energy > energy){
    this.trySpawnShip(energy,false)
}