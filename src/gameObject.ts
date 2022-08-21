class GameObject {
    uuid : number
    type : string
    circle : Circle

    constructor(uuid : number,type : string,circle : Circle){
        this.uuid = uuid
        this.type = type
        this.circle = circle
    }

    destroy(){
        this.type = "DEAD"
    }

    simulate(deltaTime : number){
        this.circle.simulate(deltaTime)
    }

    render(){

    }

    collide(otherObject : GameObject){

    }

    serialize(){
        
    }
}