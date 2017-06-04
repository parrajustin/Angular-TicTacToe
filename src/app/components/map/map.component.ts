import { Component, OnInit, OnDestroy, AfterContentChecked, ElementRef, ViewChild, ChangeDetectorRef   } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

// contains the shared app state code
import { AppState } from '../app.service';
// import { Title } from './title';
// import { XLargeDirective } from './x-large';

// contains the form that the list data is in
// import { DataCreatorStub } from './list.data';
// import * as _ from 'lodash';

//  hhhhhhh
//  h:::::h
//  h:::::h
//  h:::::h
//   h::::h hhhhh          ooooooooooo      mmmmmmm    mmmmmmm       eeeeeeeeeeee
//   h::::hh:::::hhh     oo:::::::::::oo  mm:::::::m  m:::::::mm   ee::::::::::::ee
//   h::::::::::::::hh  o:::::::::::::::om::::::::::mm::::::::::m e::::::eeeee:::::ee
//   h:::::::hhh::::::h o:::::ooooo:::::om::::::::::::::::::::::me::::::e     e:::::e
//   h::::::h   h::::::ho::::o     o::::om:::::mmm::::::mmm:::::me:::::::eeeee::::::e
//   h:::::h     h:::::ho::::o     o::::om::::m   m::::m   m::::me:::::::::::::::::e
//   h:::::h     h:::::ho::::o     o::::om::::m   m::::m   m::::me::::::eeeeeeeeeee
//   h:::::h     h:::::ho::::o     o::::om::::m   m::::m   m::::me:::::::e
//   h:::::h     h:::::ho:::::ooooo:::::om::::m   m::::m   m::::me::::::::e
//   h:::::h     h:::::ho:::::::::::::::om::::m   m::::m   m::::m e::::::::eeeeeeee
//   h:::::h     h:::::h oo:::::::::::oo m::::m   m::::m   m::::m  ee:::::::::::::e
//   hhhhhhh     hhhhhhh   ooooooooooo   mmmmmm   mmmmmm   mmmmmm    eeeeeeeeeeeeee
@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'map',  // <home></home>
  // We need to tell Angular's Dependency Injection which providers are in our app.
  providers: [],
  // Our list of styles in our component. We may add more to compose many styles together
  styleUrls: [ './map.component.css' ],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './map.component.html'
})
export class MapComponent {
}
