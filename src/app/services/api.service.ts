import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Injectable, OnInit, OnDestroy } from '@angular/core';

import { Observable, Subscription } from 'rxjs/Rx';
import { times, clone, isUndefined } from 'lodash';
import { Store } from '@ngrx/store';

import * as model from '../model';
import * as fromRoot from '../reducers';
import * as actions from '../actions';

//
//
//                                         iiii
//                                        i::::i
//                                         iiii
//
//    aaaaaaaaaaaaa  ppppp   ppppppppp   iiiiiii
//    a::::::::::::a p::::ppp:::::::::p  i:::::i
//    aaaaaaaaa:::::ap:::::::::::::::::p  i::::i
//             a::::app::::::ppppp::::::p i::::i
//      aaaaaaa:::::a p:::::p     p:::::p i::::i
//    aa::::::::::::a p:::::p     p:::::p i::::i
//   a::::aaaa::::::a p:::::p     p:::::p i::::i
//  a::::a    a:::::a p:::::p    p::::::p i::::i
//  a::::a    a:::::a p:::::ppppp:::::::pi::::::i
//  a:::::aaaa::::::a p::::::::::::::::p i::::::i
//   a::::::::::aa:::ap::::::::::::::pp  i::::::i
//    aaaaaaaaaa  aaaap::::::pppppppp    iiiiiiii
//                    p:::::p
//                    p:::::p
//                   p:::::::p
//                   p:::::::p
//                   p:::::::p
//                   ppppppppp
//

/**
 * Class to handle api calls to the server
 *
 * @export
 * @class ApiController
 */
@Injectable()
export class ApiController implements OnDestroy, OnInit {

  /**
   * Contains the subscription for checking the hash of the data
   *
   * @private
   * @type {Subscription}
   * @memberOf ApiController
   */
  private httpSubHash: Subscription;

  /**
   * Contains the change hashes
   * [sites, trs, parts, orders]
   * @private
   * @type {String[]}
   * @memberOf ApiController
   */
  private subHashs: String[] = ['', '', '', ''];

  /**
   * If the api is currently getting the site list
   *
   * @private
   * @type {boolean}
   * @memberOf ApiController
   */
  private runningSiteList: boolean = false;

  /**
   * If teh api is currently getting the tr list
   *
   * @private
   * @type {boolean}
   * @memberOf ApiController
   */
  private runningTrList: boolean = false;

  /**
   * If the api is currently getting the parts list
   *
   * @private
   * @type {boolean}
   * @memberOf ApiController
   */
  private runningPartList: boolean = false;

  /**
   * If the api is currently getting the orders list
   *
   * @private
   * @type {boolean}
   * @memberOf ApiController
   */
  private runningOrderList: boolean = false;

  private typeSubscription: Subscription;
  private dataType: model.DataTypes;

  //
  //
  //      ffffffffffffffff
  //     f::::::::::::::::f
  //    f::::::::::::::::::f
  //    f::::::fffffff:::::f
  //    f:::::f       ffffffuuuuuu    uuuuuunnnn  nnnnnnnn        cccccccccccccccc
  //    f:::::f             u::::u    u::::un:::nn::::::::nn    cc:::::::::::::::c
  //   f:::::::ffffff       u::::u    u::::un::::::::::::::nn  c:::::::::::::::::c
  //   f::::::::::::f       u::::u    u::::unn:::::::::::::::nc:::::::cccccc:::::c
  //   f::::::::::::f       u::::u    u::::u  n:::::nnnn:::::nc::::::c     ccccccc
  //   f:::::::ffffff       u::::u    u::::u  n::::n    n::::nc:::::c
  //    f:::::f             u::::u    u::::u  n::::n    n::::nc:::::c
  //    f:::::f             u:::::uuuu:::::u  n::::n    n::::nc::::::c     ccccccc
  //   f:::::::f            u:::::::::::::::uun::::n    n::::nc:::::::cccccc:::::c
  //   f:::::::f             u:::::::::::::::un::::n    n::::n c:::::::::::::::::c
  //   f:::::::f              uu::::::::uu:::un::::n    n::::n  cc:::::::::::::::c
  //   fffffffff                uuuuuuuu  uuuunnnnnn    nnnnnn    cccccccccccccccc
  //
  //
  //
  //
  //
  //
  //

  constructor(
    private http: Http,
    private store: Store<fromRoot.State>
  ) {}

  public ngOnInit() {
    this.typeSubscription = this.store.select(fromRoot.getDataType).subscribe(
      (value: model.DataTypes) => {
        this.dataType = value;
      }
    );
  }

  public ngOnDestroy() {
    if (!isUndefined(this.typeSubscription)) {
      this.typeSubscription.unsubscribe();
    }
  }

  /**
   * Tell the api host to start a heartbeat with the server to find data
   *
   *
   * @memberOf ApiController
   */
  public startSubscription() {
    // let timer = Observable.timer(0, 2000); // set a timer to run now, and every 2 seconds

    // Timer subscription
    // this.httpSubHash = timer.subscribe((t: any) => {
    //   this.getHashs()
    //     .subscribe(
    //       (response: String[]) => {
    //         if (!this.runningSiteList && response[0] !== this.subHashs[0]) {
    //           this.getSiteList();
    //         } else if (!this.runningTrList && response[1] !== this.subHashs[1]) {
    //           this.getTrList();
    //         } else if (!this.runningPartList && response[2] !== this.subHashs[2]) {
    //           this.getPartList();
    //         } else if (!this.runningOrderList && response[3] !== this.subHashs[3]) {
    //           this.getOrderList();
    //         }
    //       }, // Bind to view
    //       (err: any) => {
    //         console.log(err);
    //       }
    //     );
    // });

    this.dummyData();
  }

  public dummyData() {
    const trTemp = new model.transmission_requirements(
      0,
      '12-101',
      '/',
      new Date(),
      'COMPLETE',
      new Date(),
      new Date(),
      'Comment',
      'jp072h',
      'aj0223',
      'Modifications',
      'Title',
      true
    );

    const site = new model.site_list(
      0,
      'Site name Omega which is somewhat long',
      'CALLSIGN OVER FLOW IDK',
      'clli',
      'SOME address',
      'TX',
      300,
      'model',
      'location',
      'geo',
      'par',
      132.3234,
      33.00,
      'TX',
      true
    );

    const trSite = new model.tr_sites(
      0,
      0
    );

    const user1 = new model.users(
      'jp072h',
      'Justin Parra',
      3,
    );

    const user2 = new model.users(
      'aj0223',
      'Albert Fake',
      0
    );

    const part1 = new model.equipment_reference(
      0,
      model.equipmentType.ANTENNA,
      'Banana Industries',
      'Banana',
      'A yellow fruit',
      'FRUIT',
      '',
      '',
      false,
      '',
      ''
    );

    const part2 = new model.equipment_reference(
      1,
      model.equipmentType.CONVERTER,
      'Wire Industries',
      'Copper-Wire',
      'A wire for wire stuff',
      'WIRE',
      '',
      '',
      true,
      'Length(ft)',
      ''
    );

    let arry = [];
    let arry2 = [];
    for (let i = 0; i < 20; i++ ) {
      let partClone = clone(part2);
      partClone.equip_ref_id += i + 1;
      arry.push(partClone);

      let trClone = clone(trTemp);
      trClone.tr_id += i + 1;
      trClone.tr_number = String(i);
      arry2.push(trClone);
    }

    this.store.dispatch(new actions.tr.LoadAction(arry2));
    this.store.dispatch(new actions.equipment.LoadAction(arry));
    this.store.dispatch(new actions.user.LoadAction([user1, user2]));
    this.store.dispatch(new actions.site.LoadAction([site]));
    this.store.dispatch(new actions.trSite.LoadAction([trSite]));
    this.store.dispatch(new actions.SetUserIdAction('jp072h'));
  }

  /**
   * Will stop all subscriptions for cleanup
   *
   *
   * @memberOf ApiController
   */
  public stopSubscriptions() {
    this.httpSubHash.unsubscribe();
  }

  /**
   * Adds a new list data to the database
   *
   * @param {any} data
   *
   * @memberOf ApiController
   */
  public add(data: any): Observable<model.ResponsePost> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers });

    let str = '';
    switch (this.dataType) {
      case model.DataTypes.trList:
        str = 'TR';
        break;
      case model.DataTypes.siteList:
        str = 'Site';
        break;
      case model.DataTypes.partList:
        str = 'Part';
        break;
      case model.DataTypes.orderList:
        str = 'Order';
        break;
      default:
        break;
    }

    return this.http.post(`http://localhost:8080/api/${ str }`, JSON.stringify(data), options)
      .map((res: Response) => res.json())
      .catch(
        (error: any) => Observable.throw(error.json().error || 'Server error')
      );
      // .subscribe(
      //     (response: Response) => {
      //       console.log('POST');
      //       console.log(response);
      //     }, (err: any) => {
      //       throw new Error(err.json().error || 'ERROR.');
      //     }
      // );
  }

  public uploadFiles(form: FormData): Observable<model.ResponsePost> {
    let headers = new Headers();
    let options = new RequestOptions({ headers });
    let str = '';
    switch (this.dataType) {
      case model.DataTypes.trList:
        str = 'TR';
        break;
      case model.DataTypes.siteList:
        str = 'Site';
        break;
      case model.DataTypes.partList:
        str = 'Part';
        break;
      case model.DataTypes.orderList:
        str = 'Order';
        break;
      default:
        break;
    }

    return this.http.post(`http://localhost:8080/api/${ str }/file`, form, options)
        .map((res) => res.json())
        .catch((error) => Observable.throw(error));
        // .subscribe(
        //     (data) => console.log(data),
        //     (error) => console.log(error)
        // );
  }

  // /**
  //  * Returns all states that belong to a site_list entry
  //  *
  //  * @param {string} siteId the id of the site the states belong to
  //  * @returns string array of the states
  //  *
  //  * @memberOf ApiController
  //  */
  // public getSites(siteId: string) {
  //   return ['', ''];
  // }

  // /**
  //  * Will return an obervable of the server haashes
  //  *
  //  * @private
  //  * @returns {Observable<String[]>}
  //  *
  //  * @memberOf ApiController
  //  */
  // private getHashs(): Observable<String[]> {
  //   return this.http.get('http://localhost:8080/api/hash')
  //     .map((value: Response) => value.json())
  //     .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  // }

  // /**
  //  * Tells the api to do a get for the trs list
  //  *
  //  * @private
  //  *
  //  * @memberOf ApiController
  //  */
  // private getTrList() {
  //   this.runningTrList = true; // we are now runnign a tr list get
  //   (this.http.get('http://localhost:8080/api/tr')
  //     .map((value: Response) => value.json()) // convert the response to json
  //     .catch((err: any) => {
  //           throw new Error(JSON.stringify(err) || 'Api TR List Error Get.');
  //     })).subscribe(
  //         (response: model.ResponseGet) => {
  //           this.cache.getEmitter('list-TR').emit(response.list); // emit the changes to who ever is listening
  //           this.cache.set('list-TR', response.list); // add the changes to the current storage
  //           this.subHashs[1] = response.response['hash']; // update the local hash
  //           this.runningTrList = false; // we finished the get
  //         }, (err: any) => {
  //           throw new Error(JSON.stringify(err) || 'Api TR List Error Sub.');
  //         }
  //       );
  // }

  // /**
  //  * Tells the api to do a get for the orders list
  //  *
  //  * @private
  //  *
  //  * @memberOf ApiController
  //  */
  // private getOrderList() {
  //   this.runningOrderList = true; // we are now runnign a order list get
  //   (this.http.get('http://localhost:8080/api/order')
  //     .map((value: Response) => value.json()) // convert the response to json
  //     .catch((err: any) => {
  //           throw new Error(JSON.stringify(err) || 'Api Order List Error Get.');
  //     })).subscribe(
  //         (response: model.ResponseGet) => {
  //           this.cache.getEmitter('list-Order').emit(response.list); // emit the changes to who ever is listening
  //           this.cache.set('list-Order', response.list); // add the changes to the current storage
  //           this.subHashs[3] = response.response['hash']; // update the local hash
  //           this.runningOrderList = false; // we finished the get
  //         }, (err: any) => {
  //           throw new Error(JSON.stringify(err) || 'Api Order List Error Sub.');
  //         }
  //       );
  // }

  // /**
  //  * Tells the api to do a get for the parts list
  //  *
  //  * @private
  //  *
  //  * @memberOf ApiController
  //  */
  // private getPartList() {
  //   this.runningPartList = true; // we are now runnign a order list get
  //   (this.http.get('http://localhost:8080/api/part')
  //     .map((value: Response) => value.json()) // convert the response to json
  //     .catch((err: any) => {
  //           throw new Error(JSON.stringify(err) || 'Api Order Part Error Get.');
  //     })).subscribe(
  //         (response: model.ResponseGet) => {
  //           this.cache.getEmitter('list-Part').emit(response.list); // emit the changes to who ever is listening
  //           this.cache.set('list-Part', response.list); // add the changes to the current storage
  //           this.subHashs[2] = response.response['hash']; // update the local hash
  //           this.runningPartList = false; // we finished the get
  //         }, (err: any) => {
  //           throw new Error(JSON.stringify(err) || 'Api Order Part Error Sub.');
  //         }
  //       );
  // }

  // private getSiteList() {
  //   this.runningSiteList = true; // we are now runnign a site list get
  //   (this.http.get('http://localhost:8080/api/site')
  //     .map((value: Response) => value.json()) // convert the response to json
  //     .catch((err: any) => {
  //           throw new Error(JSON.stringify(err) || 'Api Site List Error Get.');
  //     })).subscribe(
  //         (response: model.ResponseGet) => {
  //           this.cache.getEmitter('list-Site').emit(response.list); // emit the changes to who ever is listening
  //           this.cache.set('list-Site', response.list); // add the changes to the current storage
  //           this.subHashs[0] = response.response['hash']; // update the local hash
  //           this.runningSiteList = false; // we finished the get
  //         }, (err: any) => {
  //           throw new Error(JSON.stringify(err) || 'Api Site List Error Sub.');
  //         }
  //       );
  // }
}
