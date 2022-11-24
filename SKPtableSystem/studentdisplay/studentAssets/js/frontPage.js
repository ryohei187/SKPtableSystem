async function getClassroomData(){  
  let zone;
  let teacher;
  let subject;
  await fetch(`http://192.168.184.1:5000/api/Classroom`)
  .then((res) => { return res.json() })
  .then((classroom) => {
    var elements = classroom.map(c => {
      let name = c.name;
      teacher = c.teacher;
      subject = c.subject;
      zone = name.slice(4, 9);

      let color;
      if(c.subject == "Programmering"){
        color = "orange"
      }
      if(c.subject == "Infrastruktur"){
        color = "skyblue"
      }
      if(c.subject == "IT-support"){
        color = "yellowgreen"
      }

      let number = name.slice(8,9);
        return `
        <a href="index.php?page=${zone}" id="${zone}" class="tooltipMenu" style="background-color: ${color}">
          <p>${c.name}</p>
          <p>Pladser</p>
          <div class="flexNumbers">
            <p class="free" id="zone${number}free">0</p>
            <p class="occupied" id="zone${number}occupied">0</p>
          </div>
          <span class="tooltiptext">${subject} ${teacher}</span>
        </a>
        `; 
    }).join("");
    let classroomOutput = document.getElementById("navigation");
    if (classroomOutput) {
      classroomOutput.innerHTML = elements;
    }

  })
  .catch((error) => { console.error('Error:', error); });
}
getClassroomData();


async function getTableCount(classrooms, freeID, occupiedID) {
  await fetch(`http://192.168.184.1:5000/api/Table/${classrooms}`)
  .then((res) => { return res.json() })
  .then((tables) => {
    
    var free =  tables.filter(function(t) {
      return t.isOccupied == "false" && t.position != 1;
    });
    var occupied =  tables.filter(function(t) {
      return t.isOccupied == "true";
    });
    let countFree = free.length;
    let countOccupied = occupied.length;

    let freeCount = document.getElementById(freeID);
    let occupiedCount = document.getElementById(occupiedID);
    if (freeCount) {
      freeCount.innerHTML = countFree;
    }
    if (occupiedCount) {
      occupiedCount.innerHTML = countOccupied;
    }
  })
  .catch((error) => { console.error('Error:', error); });
}

getTableCount("MU7-zone3", "zone3free", "zone3occupied");
getTableCount("MU7-zone5", "zone5free", "zone5occupied");
getTableCount("MU7-zone6", "zone6free", "zone6occupied");
getTableCount("MU7-zone8", "zone8free", "zone8occupied");
getTableCount("MU7-zone9", "zone9free", "zone9occupied");




