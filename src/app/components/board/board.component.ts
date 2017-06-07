import { Component } from '@angular/core';
import { MdSnackBar } from '@angular/material';
// import { trigger, state, transition, style, animate, keyframes, AnimationEvent } from '@angular/animations';
// import { Router, ActivatedRoute } from '@angular/router';
// import { Subscription } from 'rxjs/Rx';
// import { isUndefined, isNull, find } from 'lodash';
// import { Store } from '@ngrx/store';

// contains the shared app state code
// import { ApiController } from '../../services';
// import * as model from '../../model';
// import * as fromRoot from '../../reducers';
// import * as actions from '../../actions';

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'board',  // <home></home>
  // We need to tell Angular's Dependency Injection which providers are in our app.
  providers: [],
  // Our list of styles in our component. We may add more to compose many styles together
  styleUrls: [ './board.css' ],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './board.html'
})
export class BoardComponent {
  public board: number[] = [0, -1, -1, -1, -1, 1, -1, -1, -1];
  // [tl, tm, tr, ml, mm, mr, bl, bm, br]
  // t = top
  // m = middle
  // b = bottom
  // l = left
  // r = right

  constructor(
    public snackBar: MdSnackBar
  ) {}

  public onClick(node: number) {
    if ( this.board[node] === -1 ) {
      this.board[node] = 0;
    } else {
      this.snackBar.open('Can\'t Touch this....', 'Understood', {duration: 2000});
    }
  }
}
