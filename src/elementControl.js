const drawInfoPanels = function(){
    document.getElementById("team-info").innerHTML = GameStateManager.serialize()
    document.getElementById("team0-ships").innerHTML = "team 0: " + GameObjectManager.getShipsByTeam(0).filter((x) => x.toString())
    document.getElementById("team1-ships").innerHTML = "team 1: " + GameObjectManager.getShipsByTeam(1).filter((x) => x.toString())
}

const togglePause = function(){

    console.log(Serializer.deserializeGameObjectList(Serializer.serializeGameObjectList(GameObjectList)))

    if(PAUSED){
        PAUSED = false
        console.log("Unpaused!")
        window.requestAnimationFrame(step);
    }else{
        PAUSED = true
        console.log("Paused!")
    }
    
}

const stepFrame = function(){
    PAUSED = false
    window.requestAnimationFrame((function() {
        step()
        PAUSED = true
    }))
}