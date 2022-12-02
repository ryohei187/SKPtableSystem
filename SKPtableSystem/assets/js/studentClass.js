const studentHTML = "http://172.16.3.117:5000";

let students2 = [];
class Student {
  id;
  unilogin;
  firstname;
  lastname;
  isSeated;
  studentData = [];

  constructor(id, unilogin, firstname, lastname, isSeated, studentData) {
    this.id = id;
    this.unilogin = unilogin;
    this.firstname = firstname;
    this.lastname = lastname;
    this.isSeated = isSeated;
    this.studentData = studentData;
  }

  static async getAllStudents () {
    this.studentData;
    await fetch(`${studentHTML}/api/Student`)
    .then((res) => { return res.json() })
    .then((students) => {
      this.studentData = students;   
    })
    .catch((error) => { console.error('Error:', error); });
    return this.studentData;
  }

  static async getOneStudent (id) {
    let student;
    await fetch(`${studentHTML}/api/Student/${id}`)
    .then((res) => { return res.json() })
    .then((s) => {
      student = s;   
    })
    .catch((error) => { console.error('Error:', error); });

    return student[0];
  }

  static async getStudents (){
    let students = await Student.getAllStudents();
      const result = students.filter(st => {
        if (st.id != 1 && st.isSeated != 1){
          return st;
        }
      });
      students2.push(result);    
  }
  static getInitials(string) {
    var names = string.split(' '),
        initials = names[0].substring(0, 1).toUpperCase();
    
    if (names.length > 1) {
        initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
  };
  static async getStudentName(studentId, i){
    if(students2[0].length === 0){
      alert("All students are seated");
      return;
    }
    let id = "t" + i;
    let idBtn = "t" + i + "-btn";
  
    await fetch(`${studentHTML}/api/Student/${studentId}`)
    .then((res) => { return res.json() })
    .then((student) => {
      let firstname = student[0].firstname;
      let lastname = student[0].lastname;
      let fullname = `${firstname} ${lastname}`;

      let initials = Student.getInitials(fullname);
      var dot = ".";
      var placementOfDot = 1;
      var output = [initials.slice(0, placementOfDot), dot, initials.slice(placementOfDot)].join('');

      return document.getElementById(idBtn).innerHTML = `<p class="tooltip">${output}<span class="tooltiptext">${fullname}</span></p>`;

    })
    .catch((error) => { console.error('Error:', error); });
  }

  static async updateTableOccupationStatus(id, color, isOccupied, studentID) {
    let tID = id;
    console.log(studentID)
    
    const updateTableBody = {
      color: color,
      isOccupied: isOccupied,
      studentID: studentID
    };
    console.log(updateTableBody)
    fetch(`${studentHTML}/api/StudentTable/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateTableBody)
    })
      .then((response) => { return response.json(); })
      .then((data) => { Student.updateStudentNowSeated(studentID, 1); })
      .catch((error) => { console.error('Error:', error); 
    });
    if(isOccupied == 0){
      return tID;
    }
    return studentID;  
  }


  static async updateStudentNowSeated(id, action) {

    const seatedBody = {
      isSeated: action
    };

    await fetch(`${studentHTML}/api/Student/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(seatedBody)
    })
      .then((response) => {return response.json();})
      .then((data) => { Table.getTables(classroom);  })
      .catch((error) => { console.error('Error:', error); 
    });      
  }

  
  static async resetSeatedStudents(classroom) {
    let seatedStudentID = [];
    await fetch(`${studentHTML}/api/Table/${classroom}`)
    .then((res) => { return res.json() })
    .then((tables) => {
      tables.forEach(t => {
        if(t.isOccupied == 1){
          console.log(classroom + " " + t.studentID);
          seatedStudentID.push(t.studentID);
        }
      });
    })
    .catch((error) => { console.error('Error:', error); });
    seatedStudentID.forEach(sID => {
      const seatedBody = {
        isSeated: 0
      };

      fetch(`${studentHTML}/api/Student/${sID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(seatedBody)
      })
        .then((response) => {return response.json();})
        .then((data) => { })
        .catch((error) => { console.error('Error:', error); 
      });
    });      
  }

  static async searchStudent(id) {
    let studentData;
    fetch(`${studentHTML}/api/Search/${id}`)
    .then((res) => { return res.json() })
    .then((data) => {
      studentData = data;
    })
    .catch((error) => { console.error('Error:', error); });
   
    return studentData;
  }
}