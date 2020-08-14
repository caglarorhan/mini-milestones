const wlS = window.localStorage;

wlS.setItem('state',JSON.stringify({
    roads:{},
    modals:{},
    autocompletes:{}
}));

let state = new Proxy(JSON.parse(wlS.getItem('state')),{
    get: (target,prop)=>{
       return target[prop];
    },
    set: (target,prop,value)=>{
        target[prop]=value;
        wlS.setItem('state',JSON.stringify(target));
    }
});

window.addEventListener('load',fullyLoaded);


function cE(elemId){
    return document.getElementById(elemId);
}


function fullyLoaded(){

    //check localStorage and sync before here
    cE('createNewRoadButton').addEventListener('click',createNewRoadModal);
    state.autocompletes['autocompleteRoadName'] =  M.Autocomplete.init(cE('autocompleteRoadName'), {onAutocomplete: drawRoadMap});

}

function createNewRoadModal(){
    state.modals['roadCreatorForm'] = M.Modal.init(cE('roadCreatorForm'), {});
    state.modals['roadCreatorForm'].open();
    cE('createNewRoad').addEventListener('click',createNewRoad);

}

function createMileStoneModal(e){
    let map = e.target.dataset.map.split(",");
    state.modals['milestoneCreatorForm'] = M.Modal.init(cE('milestoneCreatorForm'),{});
    state.modals['milestoneCreatorForm'].open();
    cE('createNewMileStone').addEventListener('click', createNewMileStone);
    cE('map').value=map.join(",");
}

function createNewRoad(){
    let newRoadName = cE('newRoadName');
    if(!newRoadName.value){
        alert('Road name can not be empty!');
        newRoadName.focus()
        return;
    }
    if(state.roads[newRoadName.value]){
        alert('This road name is already exist.');
        return false;
    }else{
        state.roads[newRoadName.value] = {};
        updateRoadSearchData();
    }

    newRoadName.value='';
    state.modals['roadCreatorForm'].destroy();
}

function createNewMileStone(){
    let newMileStoneName = cE('newMileStoneName');
    let map = cE('map').value.split(",");
    state.roads[map[0]][map[1]]=null;
    drawRoadMap(map[0]);
}

function drawRoadMap(roadname){
    let roadName = roadname || cE('autocompleteRoadName').value;
    let roadMap = cE('theRoadDiv');
    roadMap.innerHTML=`<h4><i class="material-icons">all_inclusive</i> ${roadName} <button class="btn btn-floating btn-small waves-effect"><i class="material-icons addStoneButton" data-map="${roadName}">add</i></button></h4>`;
    Object.entries(state.roads[roadName]).forEach(
        (key,val)=>{
        roadMap.innerHTML+=`
        <div><i class="material-icons">assistant_photo</i>${key} <button class="btn btn-floating btn-small waves-effect"><i class="material-icons addStoneButton" data-map="${roadName},${key}">add</i></button></div>
        `;
    }
            );
    roadMap.querySelectorAll('.addStoneButton').forEach(item=>item.addEventListener('click',createMileStoneModal))

}


function updateRoadSearchData(){
    let roadNames = {};
    Object.keys(state.roads).forEach(
        roadName=>roadNames[roadName]=null
    );

    state.autocompletes['autocompleteRoadName'].updateData(roadNames);
}
