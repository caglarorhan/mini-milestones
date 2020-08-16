const wlS = window.localStorage;

let state = {
    roads:{},
    autocompletes:{},
    modals:{}
}


window.addEventListener('load',fullyLoaded);


function cE(elemId){
    return document.getElementById(elemId);
}


function fullyLoaded(){
    //check localStorage and sync before here
    cE('createNewRoadButton').addEventListener('click',createNewRoadModal);
    state.autocompletes['autocompleteRoadName']=  M.Autocomplete.init(cE('autocompleteRoadName'), {onAutocomplete: drawRoadMap});
    lastRoadNames();
}

function lastRoadNames(howMany=10){
    cE('lastRoadNames').innerHTML='';
    if(Object.entries(state.roads).length===0){return false}
    Object.keys(state.roads).reverse().forEach((roadName,index)=>{
        if(index>(howMany-1)){return}
        cE('lastRoadNames').innerHTML+=` <button class="waves-effect btn btn-small drawRoadMapButton" data-map="${roadName}">${roadName}</button>`;
    })
    document.querySelectorAll('.drawRoadMapButton').forEach(oBtn=>{
                oBtn.addEventListener('click',(e)=>{
                        let map = e.target.dataset.map;
                        drawRoadMap(map);
                    })
    })
}

function createNewRoadModal(){
    state.modals['roadCreatorForm'] = M.Modal.init(cE('roadCreatorForm'), {});
    state.modals['roadCreatorForm'].open();
    cE('createNewRoad').addEventListener('click',createNewRoad);

    console.log(wlS.getItem('state'));
}

function createMileStoneModal(e){
    let map = e.target.dataset.map.split(",");
    //console.log(map);
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
    lastRoadNames();

    console.log(wlS.getItem('state'));
}



function createNewMileStone(){
    let newMileStoneName = cE('newMileStoneName').value;
    let map = cE('map').value.split(",");
    //console.log(`gelen map degeri: ${map}`);

    let targetNode  = state.roads;
    map.forEach((node)=>{
        targetNode = targetNode[node];
        //console.log(`newTargetNode is: ${targetNode}`)
    });

     targetNode[newMileStoneName]={};

        //cleaning
    cE('newMileStoneName').value='';
    state.modals['milestoneCreatorForm'].destroy();
    //console.log(state.roads);
    drawRoadMap(map[0]);
}




function drawRoadMap(roadname){
    //console.log(state.roads);
    let roadName = roadname || cE('autocompleteRoadName').value;
    let roadMap = cE('theRoadDiv');
    roadMap.innerHTML=`<h4><i class="material-icons">all_inclusive</i> ${roadName} <button class="btn btn-floating btn-small waves-effect"><i class="material-icons addStoneButton" data-map="${roadName}">add</i></button></h4>`;

        let curRoute = state.roads[roadName];

        subMileStoneControl(curRoute);

        function subMileStoneControl(tillPoint){
            let routeArray = [roadName];
            Object.entries(tillPoint).forEach(
                ([key,val])=>{
                    routeArray.push(key);
                    roadMap.innerHTML+=`
        <div><i class="material-icons">assistant_photo</i>${key} <button class="btn btn-floating btn-small waves-effect"><i class="material-icons addStoneButton" data-map="${routeArray.toString()}">add</i></button></div>
        `;
                // console.log(`Son key :${key} ;
                // Buna ait alt key (varsa) sayisi: ${Object.keys(tillPoint[key]).length}
                // `);
                if(Object.keys(tillPoint[key]).length>0){ subMileStoneControl(tillPoint[key])}

                }
            );
        }


    roadMap.querySelectorAll('.addStoneButton').forEach(item=>item.addEventListener('click',createMileStoneModal))

}


function updateRoadSearchData(){
    let roadNames = {};
    Object.keys(state.roads).forEach(
        roadName=>roadNames[roadName]=null
    );

    state.autocompletes['autocompleteRoadName'].updateData(roadNames);
}
