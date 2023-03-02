import { GameObject } from "../objects/gameObject"
import { Asteroid, Base, Bullet, EnergyCell, Obstacle, Resources, Ship } from "../objects/objects"
import { Collider, Transform, Vector2D } from "../engine/physics"
import { create_UUID } from "../engine/utils"

export class Serializer{

    static packetifyGameObjectList(gol : Array<GameObject>){
        let tempList : any[] = []
        for(const i in gol){
            tempList = tempList.concat(gol[i].packet())
        }
        return Float32Array.from(tempList)
    }

    static serializeGameObjectList(gol : Array<GameObject>){
        const tempList = []
        for(const i in gol){
            tempList.push(gol[i].serialize())
        }
        return JSON.stringify(tempList)
    }

    static deserializeGameObjectList(str : string){
        const list = JSON.parse(str)
        return list.map((item : string) => Serializer.deserialize(item))
    }

    static deserialize(str : string){
        const list = JSON.parse(str)
        return this.listToObj(list)
    }

    // recursively traverse the list of objects
    // Why? GameObject contains Transform contains Vector2D
    static listToObj(list : Array<any>){
        if (list !== undefined && list !== null && list.slice !== undefined){
            const args = list.slice(1)
            for(const i in args){
                args[i] = Serializer.deserialize(args[i])
            }

            /* It's fine, just trust me */
            switch(list[0]){
                case "VECTOR2D":
                    /* @ts-ignore */
                    return new Vector2D(...args)
                case "TRANSFORM":
                    /* @ts-ignore */
                    return new Transform(...args)
                case "COLLIDER":
                    /* @ts-ignore */
                    return new Collider(...args)
                case "RESOURCES":
                    /* @ts-ignore */
                    return new Resources(...args)
                case "ASTEROID":
                    /* @ts-ignore */
                    return new Asteroid(...args)
                case "OBSTACLE":
                    /* @ts-ignore */
                    return new Obstacle(...args)
                case "ENERGY_CELL":
                    /* @ts-ignore */
                    return new EnergyCell(...args)
                case "SHIP":
                    /* @ts-ignore */
                    return new Ship(...args)
                case "BULLET":
                    /* @ts-ignore */
                    return new Bullet(...args)
                case "BASE":
                    /* @ts-ignore */
                    return new Base(...args)
                case "DEAD":
                    return null
                default:
                    return list
            }
        }
        return list
    }

    static unpacketify(arr : Float32Array){

        const goList = []

        if (arr !== undefined && arr !== null && arr.slice !== undefined){

            let arrCopy = Array.from(arr)
            let end = 0

            while (arrCopy.length > 0){

                switch(arrCopy[0]){
                    case 0:
                        end = 7
                        goList.push(new Asteroid(arrCopy[1], new Vector2D(arrCopy[2],arrCopy[3]), new Vector2D(arrCopy[4],arrCopy[5]), arrCopy[6], arrCopy[7]))
                        break;
                    case 1:
                        end = 6
                        goList.push(new Obstacle(arrCopy[1], new Vector2D(arrCopy[2],arrCopy[3]), new Vector2D(arrCopy[4],arrCopy[5]), arrCopy[6]))
                        break;
                    case 2:
                        end = 6
                        goList.push(new EnergyCell(arrCopy[1], new Vector2D(arrCopy[2],arrCopy[3]), new Vector2D(arrCopy[4],arrCopy[5]), arrCopy[6]))
                        break;
                    case 3:
                        end = 9
                        goList.push(new Ship(arrCopy[1], new Vector2D(arrCopy[2],arrCopy[3]), new Vector2D(arrCopy[4],arrCopy[5]), new Vector2D(arrCopy[6],arrCopy[7]), arrCopy[8], arrCopy[9]))
                        break;
                    case 4:
                        end = 7
                        goList.push(new Bullet(arrCopy[1], new Vector2D(arrCopy[2],arrCopy[3]), new Vector2D(arrCopy[4],arrCopy[5]), arrCopy[6], arrCopy[7]))
                        break;
                    case 5:
                        end = 5
                        goList.push(new Base(arrCopy[1], new Vector2D(arrCopy[2],arrCopy[3]), arrCopy[4], arrCopy[5]))
                        break;
                    default:
                        end = 1
                }
                
                arrCopy.splice(0,end+1)

            }
        }

        return goList

    }

    static test(){

        const vec = new Vector2D(1.25312324,3.152)
        const asteroid = new Asteroid(create_UUID(),vec,vec,100,20)
        const obstacle = new Obstacle(create_UUID(),vec,vec,100)
        const energyCell = new EnergyCell(create_UUID(),vec,vec,20)
        const ship = new Ship(create_UUID(),vec,new Vector2D(0,0),new Vector2D(0,0),20,0)
        const parentUUID = create_UUID()
        const bullet = new Bullet(create_UUID(),vec,vec,20,parentUUID)
        const base = new Base(create_UUID(),vec,20,0)
        const goArr : GameObject[] = [asteroid,obstacle,energyCell,ship,bullet,base]

        // SERIALIZATION
        const strings : GameObject[] = Serializer.deserializeGameObjectList(Serializer.serializeGameObjectList(goArr))
        
        for (let i in strings){
            if(strings[i].serialize() !== goArr[i].serialize()){
                console.log("Serialization failed!")
                console.log(goArr[i])
                console.log(strings[i])
            }
        }

        // PACKETIFY
        const packets : GameObject[] = Serializer.unpacketify(Serializer.packetifyGameObjectList(goArr))
        
        for (let i in packets){
            if(packets[i].serialize() !== goArr[i].serialize()){
                console.log("Packetification failed!")
                console.log(goArr[i])
                console.log(packets[i])
            }
        }

    }
}