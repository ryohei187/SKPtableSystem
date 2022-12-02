


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
  let student = await Student.getOneStudent(userID);
  let table = await Table.getTables(classroom);

  console.log(student)

  if(student.isSeated == 1){
    const oldTableId = table.filter(t => {
      //console.log(t)
      if (t.studentID == userID){
        return t;
      }
    });

    let oldTableID = await Student.updateTableOccupationStatus(oldTableId[0].id, "green", 0, 0);
    let newTable = await Student.updateTableOccupationStatus(tableID, "red", 1, userID);

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


//   RESET   //
async function resetClassroom(classroom){
  
  await Student.resetSeatedStudents(classroom);
  await Table.resetTable(classroom); 
  window.location.reload();
}


//  STUDENTS   //

Student.getStudents();













