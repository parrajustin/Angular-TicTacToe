import { Component, AfterContentChecked, OnDestroy, OnInit, AfterViewChecked,
   ElementRef, ViewChild, HostListener, Input, Output, EventEmitter, Renderer2 } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { isUndefined } from 'lodash';

import { DataTypes } from '../../model';
import * as state from '../../actions/state';
import * as fromRoot from '../../reducers';

@Component({
  selector: 'scrollWrapper',
  styleUrls: [ './scroll.component.css' ],
  templateUrl: './scroll.component.html'
})
export class ScrollComponent implements OnDestroy, OnInit, AfterViewChecked {

  /**
   * The total number of elments to be displayed
   * provided by parent
   *
   * @type {number}
   * @memberof ScrollComponent
   */
  @Input() public numElements: number;

  /**
   * The height of each individual element
   * provided by parent
   *
   * @type {number}
   * @memberof ScrollComponent
   */
  @Input() public elementHeight: number;

  /**
   * The height of the scroll container
   *
   * @type {number}
   * @memberof ScrollComponent
   */
  public scrollDivHeight: number = 0;

  /**
   * The total height of all elements
   *
   * @type {number}
   * @memberof ScrollComponent
   */
  public scrollTotalHeight: number = 0;

  /**
   * The top spacer div height
   *
   * @type {number}
   * @memberof ScrollComponent
   */
  public scrollTop: number = 0;

  /**
   * The height of the top spacer div
   *
   * @type {number}
   * @memberof ScrollComponent
   */
  public scrollTopDivHeight: number = 0;

  /**
   * The scroll container element reference to handle scrolling
   *
   * @type {ElementRef}
   * @memberof ScrollComponent
   */
  @ViewChild('scrollContainer') public scroll: ElementRef;

  /**
   * Ng model getter
   *
   * @readonly
   *
   * @memberof ScrollComponent
   */
  @Input()
  get scrollStartIndex() {
    return this.scrollStartIndexValue;
  }

  /**
   * Ng model setter, also emits value for output
   *
   *
   * @memberof ScrollComponent
   */
  set scrollStartIndex(val: number) {
    this.scrollStartIndexValue = val;
  }

  /**
   * Ng model getter
   *
   * @readonly
   *
   * @memberof ScrollComponent
   */
  @Input()
  get scrollStopIndex() {
    return this.scrollStopIndexValue;
  }

  /**
   * Ng model setter, also emits value for output
   *
   *
   * @memberof ScrollComponent
   */
  set scrollStopIndex(val: number) {
    this.scrollStopIndexValue = val;
  }

  /**
   * The local value for where rendering should stop
   *
   * @private
   * @type {number}
   * @memberof ScrollComponent
   */
  private scrollStopIndexValue: number = 0;

  /**
   * The local value for where rendering should start
   *
   * @private
   * @type {number}
   * @memberof ScrollComponent
   */
  private scrollStartIndexValue: number = 0;

  /**
   * Function used to dispose of scroll event listener
   *
   * @private
   * @type {Function}
   * @memberof ScrollComponent
   */
  private listenFunc: Function;

  /**
   * The current data type that we are vieweing, or at least believe to be viewing
   *
   * @private
   * @type {DataTypes}
   * @memberof ScrollComponent
   */
  private dataName: DataTypes;

  private dataSubscription: Subscription;

  private forceUpdate: boolean = false;

  private lastType: DataTypes;

  private lastStopIndex: number = 0;

  /**
   * Creates an instance of ScrollComponent.
   * @param {Renderer2} renderer used to create event listener
   * @param {Store<fromRoot.State>} store the global app redux store
   *
   * @memberof ScrollComponent
   */
  constructor(
    public renderer: Renderer2,
    private store: Store<fromRoot.State>
  ) {}

  public ngOnInit() {
    // renderer listen function
    this.listenFunc = this.renderer.listen(this.scroll.nativeElement, 'scroll', (event) => {
      this.scrollHandler();
    });

    // creates the dataType store subscription
    this.dataSubscription = this.store.select(fromRoot.getDataType).subscribe(
      (value: DataTypes) => {
        this.dataName = value;
        this.forceUpdate = true;
        this.scrollHandler();
      }
    );
  }

  public ngAfterViewChecked() {

    const height = this.scroll.nativeElement.offsetHeight;
    const totalHeight = Math.max(0, this.numElements * this.elementHeight - 5);

    if ( this.scrollDivHeight !== height || this.scrollTotalHeight !== totalHeight ) {
      this.scrollDivHeight = height;

      // Each element is elmentHeight px tall or
      // the last elements margin-bottom isn't included that is why the -5 is there
      this.scrollTotalHeight = totalHeight;
      this.scroll.nativeElement.scrollTop = 0;
      this.scrollStartIndex = 0;
      this.scrollStopIndex = 0;

      this.scrollHandler();
    }

    const num = Math.max(0, Math.floor(this.scrollDivHeight / this.elementHeight) - 1);
    if ( num > this.scrollStopIndex - this.scrollStartIndex ) {
      this.forceUpdate = true;
      this.scrollHandler();
    }
  }

  // public ngAfterViewChecked() {
  //   // if ( this.viewCheck === undefined && this.scrollStartIndex === this.scrollStopIndex && this.numElements !== 0 ) {
  //   //   this.scrollHandler();
  //   //   // this.cdr.detectChanges();

  //   //   let timer = Observable.timer(500, 500);
  //   //   this.viewCheck = timer.subscribe(
  //   //     (value: number) => {
  //   //       this.scrollHandler();
  //   //       if ( this.scrollStartIndex !== this.scrollStopIndex ) {
  //   //         this.scrollStartIndexChange.emit(this.scrollStartIndexValue);
  //   //         this.scrollStopIndexChange.emit(this.scrollStopIndexValue + 1);
  //   //         this.scrollStopIndexChange.emit(this.scrollStopIndexValue);
  //   //         console.log('emit');
  //   //       }
  //   //     },
  //   //     (error: any) => {
  //   //       throw new Error(JSON.stringify(error) || '');
  //   //     }, () =>  {
  //   //       //
  //   //     }
  //   //   );
  //   // }
  // }

  public ngOnDestroy() {
    this.listenFunc();
    this.dataSubscription.unsubscribe();
    // this.viewCheck.unsubscribe();
  }

  /**
   * Scroll handler that runs every time a scroll event is found on the scroll container
   *
   *
   * @memberof ScrollComponent
   */
  public scrollHandler() {
    const top = this.scroll.nativeElement.scrollTop;

    if ( this.scrollTop !== top || this.forceUpdate ) {
      this.scrollTop = top;

      this.forceUpdate = false;
      // if ( this.dataName !== dataname ) {
      //   this.dataName = dataname;
      //   if ( !isUndefined(this.viewCheck) ) {
      //     this.viewCheck.unsubscribe();
      //     this.viewCheck = undefined;
      //   }
      // }

      // set the top scroll height
      if ( this.scrollTop <= 0 ) {
        this.scrollStartIndex = 0;
        this.scrollTopDivHeight = 0;
      } else {
        /**
         * the total number of elements that fit fully into the space
         * also take away an element such that there is a little bit of a spacer when scrolling
         */
        const numberOfElements = Math.max(0, Math.floor(this.scrollTop / this.elementHeight) - 1 );
        const height = numberOfElements * this.elementHeight;
        if ( height !== this.scrollTopDivHeight ) {
          this.scrollStartIndex = numberOfElements;
          this.scrollTopDivHeight = height;
        }
      }

      const remainingElements = this.numElements - this.scrollStartIndex;
      const lastValidElement = Math.max(0, Math.min(remainingElements, Math.floor(this.scrollDivHeight / this.elementHeight) + 2));
      this.scrollStopIndex = this.scrollStartIndex + lastValidElement;

      if ( this.lastStopIndex !== this.scrollStopIndex ) {
        this.lastStopIndex = this.scrollStopIndex;
        this.store.dispatch(new state.SetEmitterAction([this.scrollStartIndex, this.scrollStopIndex]));
      }
    }
  }
}