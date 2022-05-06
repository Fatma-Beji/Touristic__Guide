import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { AngularFireDatabase } from 'angularfire2/database';
import{ filter } from 'rxjs/operators';


@Injectable()
export class DataS{

    ref;
    reference: any;
    items;

    constructor(
      public angularFireDatabase:AngularFireDatabase,

    ) {

      this.ref = this.angularFireDatabase.database.ref('/countries');
      this.angularFireDatabase.list('/countries').snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key,...action.payload.val() }));
    }).subscribe((data) => {
      this.items=data;
      console.log(this.items);
      console.log(this.items.name);
      },
       (err)=>{ console.log( err) });

      this.reference=[
        {"name":"Sousse"},
        {"name":"Tunis"},



        ];

    }

    filterItems(searchTerm){
       return this.reference.filter((item) => {
            return item.name.toLowerCase().includes(searchTerm.toLowerCase());
        });

    }

}
