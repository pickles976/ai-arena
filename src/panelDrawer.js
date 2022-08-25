const drawInfoPanels = function(){
    document.getElementById("team-info").innerHTML = GameStateManager.serialize()
    document.getElementById("team0-ships").innerHTML = "team 0: " + GameObjectManager.getShipsByTeam(0).filter((x) => x.toString())
    document.getElementById("team1-ships").innerHTML = "team 1: " + GameObjectManager.getShipsByTeam(1).filter((x) => x.toString())
}