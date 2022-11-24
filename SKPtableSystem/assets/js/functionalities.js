const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const page = urlParams.get('page');

const userID = 4;

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

// async function tempStudents () {
//   let testStudentData;
//   await fetch(`https://itd-skp.sde.dk/api/find-sko-st.php?what=students-table`)
//   .then((res) => { return res.json() })
//   .then((students) => {
//     console.log(students)
//     testStudentData = students;
//     console.log(testStudentData);   
//   })
//   .catch((error) => { console.error('Error:', error); });
//   return testStudentData;
// }

// tempStudents();

async function studentPhotos (studentID) {
  let testStudentData;
  await fetch(`https://itd-skp.sde.dk/uploads/${studentID}.png`)
  .then((res) => { return res.json() })
  .then((students) => {
    testStudentData = students;
    console.log(testStudentData);   
  })
  .catch((error) => { console.error('Error:', error); });
  return testStudentData;
}