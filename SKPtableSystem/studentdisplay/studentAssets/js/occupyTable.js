const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const page = urlParams.get('page');

const userID = 11;

let classroom = 'MU7-' + page;
let gridFields = [];

function setGrid(numberOfSeats){
  for (let i = 1; i < numberOfSeats; i++) {
    tableid = "grid" + i;
    gridFields.push( tableid );
  }
}
setGrid(109);

var gridBox = gridFields.map(t => {
  return `
  <div
    id="${t}"
    ondrop="drop(event, this.id)"
    ondragover="allowDrop(event)"
  ></div>
  `;
}).join("");
let gridOutput = document.getElementById("dropZone");
if (gridOutput) {
  gridOutput.innerHTML = gridBox;
}

let commands = [];
let oldTablePosition;

function saveCommand(action, id, old) {
  if(action == 'moved'){
    commands.push({
      action: action,
      tableID: id,
      oldPosition: old
    })
  }
  if(action == 'occupied'){
    commands.push({
      action: action,
      tableID: id,
      studentID: old
    })
  }
  if(action == 'added'){
    commands.push({
      action: action,
      tableID: id,
      added: old
    })
  }
  if(action == 'reverseMove'){
    commands.push({
      action: action,
      oldTable: id,
      userID: old
    })
  }
  console.log(commands);
}
async function undoChange(event) {
  event.preventDefault();
  const lastCommand = commands.pop();
  if (!lastCommand) return;

  if(lastCommand.action == 'moved'){
    let id = lastCommand.tableID;
    let position = lastCommand.oldPosition;

    var tableID = "t" + id;

    if(position != "1"){
      const table = document.getElementById(tableID);
      document.getElementById(position).appendChild(table);
      await Table.updateTablePosition(id, position, classroom);
    }
    if(position == "1"){
      const table = document.getElementById(tableID);
      const list = document.getElementById("tablesHolder");
      list.insertBefore(table, list.children[0]);
      await Table.updateTablePosition(id, position, classroom);      
    }
  }

  if(lastCommand.action == 'occupied'){
    let id = lastCommand.tableID;
    let studentID = lastCommand.studentID;

    var tableID = "t" + id;

    if(studentID != "0"){
      let sID = await Student.updateTableOccupationStatus(id, "green", 0, studentID);

      await Table.getTables(classroom); 
      await runOnLoad();
     
    }
  }
  if(lastCommand.action == 'reverseMove'){
    let oldTableId = lastCommand.oldTable;
    let studentID = lastCommand.userID;
    let table = await Table.getTables(classroom); 


    const currentTableId = table.filter(t => {
      if (t.studentID == userID){
        return t;
      }
    });

    let currentTable = currentTableId[0].id;

    let currentTableID = await Student.updateTableOccupationStatus(currentTable, "green", 0, 0);
    let oldTable = await Student.updateTableOccupationStatus(oldTableId, "red", 1, studentID);
  }

  if(lastCommand.action == 'added'){
    let idArray = lastCommand.tableID;
    let added = lastCommand.added;
    await Table.deleteNewTables(idArray, added);
    //window.location.reload();
  }

  Table.getTables(classroom);
  runOnLoad();
}

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
        
      `;
    }  
  }).join("");
  let tableOutput = document.getElementById("tablesHolder");
  if (tableOutput) {
    tableOutput.innerHTML = elements;
  }

  tables.map(async t => {
    const id = "t" + t.id;
    let color = "green";
    if(t.isOccupied == 1){
      color = "red";
    }
    let idBtn = "t" + t.id + "-btn";
    if(t.position != 1){
      let tableOutput2 = document.getElementById(t.position);

      if (tableOutput2) {
        tableOutput2.innerHTML = `<div id="${id}" style="background-color: ${color}" class="table">
          <p>${id}</p>
          <p id="${idBtn}" class="occupyBtn"></p>
        </div>`;
      
      }
      if(t.isOccupied == 0){
        document.getElementById(idBtn).innerHTML = `<button onclick="occupyTable(${t.id}); " value="true">Optag</button>`;
        
      }
      if(t.isOccupied == 1){
        await Student.getStudentName(t.studentID, t.id);
      }
    }
  });
  await Table.getTables(classroom);
}

async function occupyTable(tableID){
  let sId = 3;
  let student = await Student.getOneStudent(userID);
  let table = await Table.getTables(classroom); 

  if(student.isSeated == 1){
    const oldTableId = table.filter(t => {
      if (t.studentID == userID){
        return t;
      }
    });

    let oldTableID = await Student.updateTableOccupationStatus(oldTableId[0].id, "green", 0, 0);
    let newTable = await Student.updateTableOccupationStatus(tableID, "red", 1,  userID);

    saveCommand('reverseMove', oldTableID, userID);

    await Table.getTables(classroom); 
    await runOnLoad();
    return;
  }

  let studentID = await Student.updateTableOccupationStatus(tableID, "red", 1, userID);
  saveCommand('occupied', tableID, studentID);
   
  await Table.getTables(classroom); 
  await runOnLoad();
}

if(page != "frontpage"){
  runOnLoad();

}


//  STUDENTS   //

Student.getStudents();













