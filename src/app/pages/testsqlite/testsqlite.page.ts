import { Component } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

@Component({
  selector: 'app-testsqlite',
  templateUrl: './testsqlite.page.html',
  styleUrls: ['./testsqlite.page.scss'],
})
export class TestsqlitePage {

  db:SQLiteObject;
  book_name:string;
  book_price:string;
  bookData:book[];

  constructor(
    private sqlite: SQLite
  ) { }

  createOpenDatabase() {
    console.log('Create/Open database');
    try {
      this.sqlite.create({
        name: 'naosql',
        location: 'defalut'
      })
      .then((db: SQLiteObject) => {
        this.db = db;
        alert('databse created/opend');
      })
      .catch(e => alert(JSON.stringify(e)));
    }
    catch(err:any)
    {
      console.log(err);
      alert(err);
    }
  }

  createTable() {
    console.log('Dentro de createTable');
    this.db.executeSql('create table IF NOT EXISTS books(name VARCHAR(32), price varchar(10)', [])
    .then((result) => alert('table created'))
    .catch(e => alert(JSON.stringify(e)));
  }

  insertData() {
    let query:string = 'insert into books(name,price) values("'+this.book_name+'","'+this.book_price+'")';
    this.db.executeSql(query,[])
    .then(() => alert('Record inserted'))
    .catch(e => alert(JSON.stringify(e)));
  }

  selectData() {
    this.bookData=[];
    this.db.executeSql('select * from books', [])
    .then((result) => {
      for(let i=0;i<result.rows.length;i++) {
        this.bookData.push({
          book_name:result.rows.item(i).name,
          "book_price":result.rows.item(i).price
        })
      }
    })
    .catch(e => alert(JSON.stringify(e)));
  }


}

class book {
  public book_name:string;
  public book_price:string;
}
