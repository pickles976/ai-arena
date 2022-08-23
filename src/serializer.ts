class Serializer{

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

    static listToObj(list : Array<any>){
        if (list.slice !== undefined){
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

    static test(){
        const vec = new Vector2D(1.25312324,3.152)

        console.log("Test Vector2D serialization")
        console.log(Serializer.deserialize(vec.serialize()))

        console.log("Test Transform serialization")
        console.log(Serializer.deserialize(new Transform(100,vec, vec).serialize()))

        console.log("Test Collider serialization")
        console.log(Serializer.deserialize(new Collider(100).serialize()))

        console.log("Test Resource serialization")
        console.log(Serializer.deserialize(new Resources(100.021,20.12,0.0).serialize()))

        console.log("Test Asteroid serialization")
        console.log(Serializer.deserialize(new Asteroid(create_UUID(),vec,vec,100,20).serialize()))

        console.log("Test Obstacle serialization")
        console.log(Serializer.deserialize(new Obstacle(create_UUID(),vec,vec,100).serialize()))

        console.log("Test EnergyCell serialization")
        console.log(Serializer.deserialize(new EnergyCell(create_UUID(),vec,vec,20).serialize()))

        console.log("Test Ship serialization")
        const parentUUID = create_UUID()
        console.log(Serializer.deserialize(new Ship(create_UUID(),vec,20,0).serialize()))

        console.log("Test Bullet serialization")
        console.log(Serializer.deserialize(new Bullet(create_UUID(),vec,vec,20,parentUUID).serialize()))

        console.log("Test Base serialization")
        console.log(Serializer.deserialize(new Base(create_UUID(),vec,20,0).serialize()))
    }
}