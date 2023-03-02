class TeamCode {

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

class Code {

    team0 : TeamCode | null
    team1 : TeamCode | null

    constructor(team0: TeamCode | null, team1: TeamCode | null) {
        this.team0 = team0
        this.team1 = team1
    }
}