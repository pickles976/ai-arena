# User API

The user has total control over the memory that they create. Users can create their own functions and fields inside of gameobjects. However any default fields/functions are read-only access. A player can read their team or uuid, but they cannot modify it. 

## Base

Both players have a single base that they must defend.
A base can hold metal, which is used to build more ships and purchase upgrades.
A base can also hold water, which is collected by ships and refined into energy. The base can also hold energy, which it uses to heal/recharge friendly ships.

However, if a base's energy drops to zero, then your base dies and you lose!

Example usage of the base object:  

    const energyCost = base.energyCost
    base.spawnShip(new Vector2D(0,1),25)

### Start

The base start method runs at the very beginning of the game. Here you can define your Global variables that you can sync between your ship AI. For instance, if you want to know what resources your ships are targeting, you can create an Object[] to store references to the target objects of each of your ships.

Game and Graphics API are not available in this function.

### Update

This is the logic that will run every frame for controlling your base. You could query the status of all of your ships and determine what upgrades to purchase, or if you should build more ships. This is where your strategic AI code can live.

The available default fields for base are:

-  ["uuid", "team" , "maxEnergy", "energyCost", "refiningRate", 
    "baseShipCost", "shipCost", "healRate", "healRateCost", "interactRadius", 
    "interactRadiusCost", "transform","collider","resources"]

The available default functions for base are:

-  [ "upgradeHealth", "upgradeHealRate", 
            "upgradeInteractRadius", "spawnShip"]

## Ship

Your ships are your pawns that keep the base supplied. They have a limited amount of energy that acts as health, fuel for movement, and energy used for firing weapons. If your ships energy drops below zero, it will die. Once purchased, ships will respawn after 15s for zero metal cost, however they will lose any upgrades purchased during their previous life.

Example usage of the ship object:  

    const myId = ship.uuid
    ship.shoot(new Vector2D(0,0))

### Start

Similar to the Base Start function, but the variables declared here will only be available in this single ship's memory.

Game and Graphics API are not available in this function.

### Update

This is the game logic that runs every frame. You can access your previously initialized variables from here with ship.variableName, or you can access variables on your base from base.variableName

The available default fields for ship are:

-  ["uuid", "team" , "transform","collider","resources", "maxEnergy", 
    "damage", "energyCost", "damageCost"]

The available default functions for ship are:

-  [ "upgradeMaxEnergy", "upgradeDamage", "seekTarget", 
            "moveTo", "moveToObject", "applyThrust", "shoot"]

## Game

The Game object is used to query the game state. From here you can get information about all the active gameobjects on the field. You can use this to find nearest resources, enemies, and find out about the amount of resources contained in an asteroid, or the enemy's health.

The available default functions for Game are:

- ["getAsteroids" , "getClosestAsteroid" , "getObstacle", "getClosestObstacle", 
    "getEnergyCells", "getClosestEnergyCell", "getShips", "getShipsByTeam", 
    "getBullets","getBases","getBaseByTeam"]

Example usage of Game object:

    let asteroids = Game.getAsteroids()
    let myBase = Game.getBaseByTeam(1)

## Graphics

The available default fields for Graphics are:
- ["H", "W"]

The available default functions for Graphics are:
- ["drawText", "drawLine", "drawCircle", "drawCircleTransparent"]

Example usage of Graphics object:

    let H = Graphics.H
    Graphics.drawCircle(new Vector2D(0,H),100,"#FFFF00")

