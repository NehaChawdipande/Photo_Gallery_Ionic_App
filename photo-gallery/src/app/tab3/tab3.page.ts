import { Component } from '@angular/core';
import { favs } from '../tab1/tab1.page';
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  constructor() {}

  
   favourite= favs;
  

}
