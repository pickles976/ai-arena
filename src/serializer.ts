import { GameObject } from "./gameObject.js"
import { Asteroid, Base, Bullet, EnergyCell, Obstacle, Resources, Ship } from "./objects.js"
import { Collider, Transform, Vector2D } from "./physics.js"
import { create_UUID } from "./utils.js"

export class Serializer{

    static packetifyGameObjectList(gol : Array<GameObject>){
        let tempList : any[] = []
        for(const i in gol){
            tempList = tempList.concat(gol[i].packet())
        }
        return Float32Array.from(tempList)
    }

    static minifyGameObjectList(gol : Array<GameObject>){
        const tempList = []
        for(const i in gol){
            tempList.push(gol[i].minify())
        }
        return JSON.stringify(tempList)
    }

    static deminifyGameObjectList(str : string){
        const list = JSON.parse(str)
        return list.map((item : string) => Serializer.deserializeMini(item))
    }

    static deserializeMini(str : string){
        const list = JSON.parse(str)
        return this.listToObjMini(list)
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

    static listToObjMini(list : Array<any>){
        if (list !== undefined && list !== null && list.slice !== undefined){
            const args = list.slice(1)
            for(const i in args){
                args[i] = Serializer.deserializeMini(args[i])
            }

            /* It's fine, just trust me */
            switch(list[0]){
                case 0:
                    /* @ts-ignore */
                    return new Vector2D(...args)
                case 1:
                    /* @ts-ignore */
                    return new Transform(...args)
                case 2:
                    /* @ts-ignore */
                    return new Collider(...args)
                case 3:
                    /* @ts-ignore */
                    return new Resources(...args)
                case 4:
                    /* @ts-ignore */
                    return new Asteroid(...args)
                case 5:
                    /* @ts-ignore */
                    return new Obstacle(...args)
                case 6:
                    /* @ts-ignore */
                    return new EnergyCell(...args)
                case 7:
                    /* @ts-ignore */
                    return new Ship(...args)
                case 8:
                    /* @ts-ignore */
                    return new Bullet(...args)
                case 9:
                    /* @ts-ignore */
                    return new Base(...args)
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
            let temp = []

            while (arrCopy.length > 0){

                switch(arrCopy[0]){
                    case 0:
                        temp = arrCopy.slice(1,8)
                        goList.push(new Asteroid(temp[0], new Vector2D(temp[1],temp[2]), new Vector2D(temp[3],temp[4]), temp[5], temp[6]))
                    case 1:
                        temp = arrCopy.slice(1,7)
                        goList.push(new Obstacle(temp[0], new Vector2D(temp[1],temp[2]), new Vector2D(temp[3],temp[4]), temp[5]))
                    case 2:
                        temp = arrCopy.slice(1,7)
                        goList.push(new EnergyCell(temp[0], new Vector2D(temp[1],temp[2]), new Vector2D(temp[3],temp[4]), temp[5]))
                    case 3:
                        temp = arrCopy.slice(1,10)
                        goList.push(new Ship(temp[0], new Vector2D(temp[1],temp[2]), new Vector2D(temp[3],temp[4]), new Vector2D(temp[5],temp[6]), temp[7], temp[8]))
                    case 4:
                        temp = arrCopy.slice(1,8)
                        goList.push(new Bullet(temp[0], new Vector2D(temp[1],temp[2]), new Vector2D(temp[3],temp[4]), temp[5], temp[6]))
                    case 5:
                        temp = arrCopy.slice(1,6)
                        goList.push(new Base(temp[0], new Vector2D(temp[1],temp[2]), temp[3], temp[4]))
                    }

                arrCopy.splice(0,temp.length + 1)

            }
        }

        return goList

    }

    static test(){

        const vec = new Vector2D(1.25312324,3.152)
        const transform = new Transform(100,vec, vec)
        const collider = new Collider(100)
        const resources = new Resources(100.021,20.12,0.0)
        const asteroid = new Asteroid(create_UUID(),vec,vec,100,20)
        const obstacle = new Obstacle(create_UUID(),vec,vec,100)
        const energyCell = new EnergyCell(create_UUID(),vec,vec,20)
        const ship = new Ship(create_UUID(),vec,new Vector2D(0,0),new Vector2D(0,0),20,0)
        const parentUUID = create_UUID()
        const bullet = new Bullet(create_UUID(),vec,vec,20,parentUUID)
        const base = new Base(create_UUID(),vec,20,0)

        console.log("Test Vector2D serialization")
        console.log(Serializer.deserialize(vec.serialize()))

        console.log("Test Transform serialization")
        console.log(Serializer.deserialize(transform.serialize()))

        console.log("Test Collider serialization")
        console.log(Serializer.deserialize(collider.serialize()))

        console.log("Test Resource serialization")
        console.log(Serializer.deserialize(resources.serialize()))

        console.log("Test Asteroid serialization")
        console.log(Serializer.deserialize(asteroid.serialize()))

        console.log("Test Obstacle serialization")
        console.log(Serializer.deserialize(obstacle.serialize()))

        console.log("Test EnergyCell serialization")
        console.log(Serializer.deserialize(energyCell.serialize()))

        console.log("Test Ship serialization")
        console.log(Serializer.deserialize(ship.serialize()))

        console.log("Test Bullet serialization")
        console.log(Serializer.deserialize(bullet.serialize()))

        console.log("Test Base serialization")
        console.log(Serializer.deserialize(base.serialize()))

        // MINIFY

        console.log("Test Vector2D serialization")
        console.log(Serializer.deserializeMini(vec.minify()))

        console.log("Test Transform serialization")
        console.log(Serializer.deserializeMini(transform.minify()))

        console.log("Test Collider serialization")
        console.log(Serializer.deserializeMini(collider.minify()))

        console.log("Test Resource serialization")
        console.log(Serializer.deserializeMini(resources.minify()))

        console.log("Test Asteroid serialization")
        console.log(Serializer.deserializeMini(asteroid.minify()))

        console.log("Test Obstacle serialization")
        console.log(Serializer.deserializeMini(obstacle.minify()))

        console.log("Test EnergyCell serialization")
        console.log(Serializer.deserializeMini(energyCell.minify()))

        console.log("Test Ship serialization")
        console.log(Serializer.deserializeMini(ship.minify()))

        console.log("Test Bullet serialization")
        console.log(Serializer.deserializeMini(bullet.minify()))

        console.log("Test Base serialization")
        console.log(Serializer.deserializeMini(base.minify()))

        // PACKETIFY

        const goArr = [asteroid,obstacle,energyCell,ship,bullet,base]
        console.log(Serializer.packetifyGameObjectList(goArr))
        console.log(Serializer.unpacketify(Serializer.packetifyGameObjectList(goArr)))

    }
}