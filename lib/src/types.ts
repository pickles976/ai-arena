export class TeamCode {

    baseStart : string
    baseUpdate : string
    shipStart : string
    shipUpdate : string

    constructor(baseStart : string, baseUpdate : string, shipStart : string, shipUpdate : string) {
        this.baseStart = baseStart
        this.baseUpdate = baseUpdate
        this.shipStart = shipStart
        this.shipUpdate = shipUpdate
    }

}

export class Code {

    team0 : TeamCode | null
    team1 : TeamCode | null

    constructor(team0: TeamCode | null, team1: TeamCode | null) {
        this.team0 = team0
        this.team1 = team1
    }
}

export class GameConfig {

    team0_ships: number | null = null
    team1_ships: number | null = null
    damage_ratio: number | null = null

    num_asteroids: number | null = null
    num_obstacles: number | null = null
    num_energy: number | null = null

    constructor() {}

}

export class EngineConfig {

    canvas : HTMLCanvasElement | null = null
    graphics : boolean | null
    framerate : number | null
    ticksPerFrame : number | null
    streaming : boolean | null
    nodejs : boolean | null
    userCodeTimeout : number | null
    
    constructor() {}

}