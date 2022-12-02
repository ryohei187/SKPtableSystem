const tableHTML = "http://172.16.3.117:5000";

class Table {
  tableData = [];

  constructor( tableData) {
    this.tableData = tableData;
  }

  static async getTables (classroom) {
    this.tableData;
    await fetch(`${tableHTML}/api/Table/${classroom}`)
    .then((res) => { return res.json() })
    .then((tables) => {
      this.tableData = tables;   
    })
    .catch((error) => { console.error('Error:', error); });
    return this.tableData;
  }

  static async postXtables(numberOfNewTables, classroom){
    const newTable = {
      color: "green",
      isOccupied: 0,
      studentID: 0,
      classroomID: classroom,
      position: "1",
    };

    for (let i = 1; i <= numberOfNewTables; i++) {
      await fetch(`${tableHTML}/api/Table`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTable)
      })
        .then((response) => {
            return response.json();
        })
        .catch((error) => { console.error('Error:', error); 
      });
    }
  } 
  
  static async deleteNewTables(idArray, added){
    idArray.forEach(t => {
      console.log(t.id)
      fetch(`${tableHTML}/api/Table/${t.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })
        .then((response) => {
            return response.json();
        })
        .catch((error) => { console.error('Error:', error); 
      });
    });

  }  

  static async resetTable(classroom) {
    const tableBody = {
      color: 'green',
      isOccupied: 0,
      studentID: 0,
      position: "1"
    };
    await fetch(`${tableHTML}/api/Reset/${classroom}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tableBody)
    })
      .then((response) => {return response.json();})
      .catch((error) => { console.error('Error:', error); 
    }); 
  }
  static async updateTablePosition(id, position, classroom) {
    let table = this.tableData.filter(t => t.id == id);
    let undoTableChange = table[0].position;
    const positionBody = {
      position: position,
    };
    fetch(`${tableHTML}/api/Table/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(positionBody)
    })
      .then(response => response.json())
      .then((data) => { Table.getTables(classroom); })
      .catch((error) => { console.error('Error:', error); 
    });
    return undoTableChange;
  }

}

// setTable() {
  //   console.log(`Table id: ${this.id} table color: ${this.color} is the table occupied ${this.isOccupied}`);
  // }

