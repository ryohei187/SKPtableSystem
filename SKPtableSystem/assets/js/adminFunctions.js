

function allowDrop(event) {
  event.preventDefault();
}
function drag(event) {
  event.dataTransfer.setData("text", event.target.id);
}
async function drop(event, el) {
  event.preventDefault();

  var data = event.dataTransfer.getData("text");

  event.target.appendChild(document.getElementById(data));
  let id = data.slice(1);
  let position = event.srcElement.id;

  if(!position.startsWith("t")){
    oldTablePosition = await Table.updateTablePosition(id, position, classroom);
    saveCommand('moved', id, oldTablePosition);
  }
  Table.getTables(classroom);
  runOnLoad();
}

function RandArray2(array){
  let arr = array[0];

  var rand = Math.random()*arr.length | 0;
  var rValue = arr[rand].id;
  return rValue;
}


//   TABLE    //

async function runOnLoad(){
  const user = await Student.getOneStudent(userID);
  let tables = await Table.getTables(classroom);
  var elements = tables.map(t => {
    if(t.position == 1){
      const id = "t" + t.id;
      return `
        <div id="${id}" style="background-color: ${t.color}" class="table" draggable="true" ondragstart="drag(event)">${id}</div> 
      `;
    }  
  }).join("");
  let tableOutput = document.getElementById("tablesHolder");
  if (tableOutput) {
    tableOutput.innerHTML = elements;
  }
  const position = tables.filter(t => t.position === '1');
  const tableHolder = document.getElementById("tablesHolder");

  if(position.length === 0){
    tableHolder.innerHTML = `
    <div class="createNewTables">
      <p>Opret nye borde</p>
      <p>Indtast antallet af nye borde til lokalet</p>
      <form onsubmit="return false">
        <label for="numberOfNewTables">Antal: </label>
        <input type="number" name="numberOfNewTables" id="numberOfNewTables" min="1">
        <input type="submit" id="createNewTables" onclick="createXtables()" value="Opret">
      </form>
    </div>
    `;
  }

  tables.map(async t => {
    let isOccupied = 0;
    if (t.isOccupied != 0){
      isOccupied = "true"
    } 
    const id = "t" + t.id;
    let idBtn = "t" + t.id + "-btn";
    let color = "green";
    if(t.isOccupied == 1){
      color = "red";
    }
    if(t.position != 1){
      let tableOutput2 = document.getElementById(t.position);

      if (tableOutput2) {
        tableOutput2.innerHTML = `<div id="${id}" style="background-color: ${color}" class="table" draggable="true" ondragstart="drag(event)">
          <p>${id}</p>
          <p id="${idBtn}" class="occupyBtn"></p>
        </div>`;
      }
      if(t.isOccupied == 0){
        document.getElementById(idBtn).innerHTML = `<button onclick="deleteTable(${t.id}); " value="true">Slet bord</button>`;
        
      }
      if(t.isOccupied == 1){
        console.log(t.studentID)
        await Student.getStudentName(t.studentID, t.id);
      }
    }
  });
  await Table.getTables(classroom);
  return;
  
}



if(page != "frontpage"){
  runOnLoad();

}


async function createXtables(){
  let numberOfNewTables = document.getElementById("numberOfNewTables").value;
  if (!numberOfNewTables) { return alert("Please enter a number"); }
  
  await Table.postXtables(numberOfNewTables, classroom);
  await Table.getTables(classroom);
  await runOnLoad(); 
  let arr = await Table.getTables(classroom);
  const newTables = arr.slice(-numberOfNewTables);

  saveCommand('added', newTables, numberOfNewTables); 
}

//   RESET   //
async function resetClassroom(classroom){
  
  await Student.resetSeatedStudents(classroom);
  await Table.resetTable(classroom); 
  window.location.reload();
}


//  STUDENTS   //

Student.getStudents();
''

