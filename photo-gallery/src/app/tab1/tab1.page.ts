import { ElementSchemaRegistry } from '@angular/compiler';
import { Component } from '@angular/core';
export const favs =[];
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page {
   
  constructor() {}

  like(id:string)
  {
    alert("Added to favourites!");
    
    var img = document.getElementById(id);
    var src = img.getAttribute('src');
    favs.push(src);
    console.log(src);

  }
}
