import { Collider, Transform } from "./physics.js"
import { Renderer } from "./renderer.js"

export class GameObject {
    uuid : number
    type : string
    transform : Transform
    collider : Collider
    age : number

    constructor(uuid : number,type : string,transform : Transform, collider : Collider){
        this.uuid = uuid
        this.type = type
        this.transform = transform
        this.collider = collider
        this.age = 0
    }

    destroy(){
        this.type = "DEAD"
    }

    simulate(deltaTime : number){
        this.transform.simulate(deltaTime)
        this.age++
    }

    render(renderer : Renderer){

    }

    collide(otherObject : GameObject){

    }

    serialize(){
        
    }
}