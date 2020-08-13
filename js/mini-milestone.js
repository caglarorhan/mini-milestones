const state = {
    roads:{},
    modals:{},
    autocompletes:{}
};

window.addEventListener('load',fullyLoaded);


function cE(elemId){
    return document.getElementById(elemId);
}


function fullyLoaded(){

    //check localStorage and sync before here
    cE('createNewRoadButton').addEventListener('click',createNewRoadModal);
    cE('createNewRoad').addEventListener('click',createNewRoad);

    state.autocompletes['autocompleteRoadName'] =  M.Autocomplete.init(cE('autocompleteRoadName'), {onAutocomplete: drawRoadMap});

}

function createNewRoadModal(){
    state.modals['roadCreatorForm'] = M.Modal.init(cE('roadCreatorForm'), {});
    state.modals['roadCreatorForm'].open();
    updateRoadSearchData();
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

    console.log(state);
    newRoadName.value='';
    state.modals['roadCreatorForm'].destroy();
}


function drawRoadMap(){
    roadName = cE('autocompleteRoadName').value
    let roadMap = cE('theRoadDiv');
    roadMap.innerHTML+=`<h4>${roadName}</h4>`;
    Object.entries(state.roads[roadName]).forEach(
        (key,val)=>{
        roadMap.innerHTML+=`
        <div>${key}:${val}</div>
        `
    }
    )
}


function updateRoadSearchData(){
    let roadNames = {};
    Object.keys(state.roads).forEach(
        roadName=>roadNames[roadName]=null
    );

    state.autocompletes['autocompleteRoadName'].updateData(roadNames);
}
