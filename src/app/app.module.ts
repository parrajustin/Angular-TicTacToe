// Angular imports
import { MdSnackBarModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ApplicationRef } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout'; // used for layout design
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from './environment';
import { ROUTES } from './app.routes';
import { ApiController } from './services';
import { GetDataPipe, GetDataHeaders, InCart } from './pipes';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';

// App is our top level component
import { AppComponent } from './app.component';
import { BoardComponent } from './components/board';
import { NodeComponent } from './components/node';
// import { ListComponent } from './components/home';
// import { MapComponent } from './components/map';
// import { NoContentComponent } from './components/no-content';
// import { MyComponent } from './components/my';
// import { SplashComponent } from './components/Splash';
// import { ScrollModule } from './components/scrollWrapper';

// App state
import { StoreModule } from '@ngrx/store';
import { RouterStoreModule } from '@ngrx/router-store';
import { reducer } from './reducers';

import '../styles/styles.scss';
import '../styles/headings.css';

// Application wide providers
const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS,
  ApiController
];

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [
    AppComponent,
    BoardComponent,
    NodeComponent,
    GetDataPipe,
    GetDataHeaders,
    InCart,
  ],
  imports: [ // import Angular's modules
    FlexLayoutModule,
    BrowserAnimationsModule,
    MdSnackBarModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES, { useHash: true, preloadingStrategy: PreloadAllModules }),

    /**
     * StoreModule.provideStore is imported once in the root module, accepting a reducer
     * function or object map of reducer functions. If passed an object of
     * reducers, combineReducers will be run creating your application
     * meta-reducer. This returns all providers for an @ngrx/store
     * based application.
     */
    StoreModule.provideStore(reducer),

    /**
     * @ngrx/router-store keeps router state up-to-date in the store and uses
     * the store as the single source of truth for the router's state.
     */
    RouterStoreModule.connectRouter(),
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    ENV_PROVIDERS,
    APP_PROVIDERS
  ]
})
export class AppModule {}
