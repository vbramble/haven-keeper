import { LayoutModule } from '@angular/cdk/layout';
import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { environment } from 'src/environments/environment';
import { AddCardDialogComponent } from './components/add-card-dialog/add-card-dialog.component';
import { MonsterSetComponent } from './components/monster/monster-set.component';
import { AddStandeeDialogComponent } from './components/monster/add-standee-dialog/add-standee-dialog.component';
import { MonsterAbilityCardComponent } from './components/monster/monster-ability-card/monster-ability-card.component';
import { MonsterStatCardComponent } from './components/monster/monster-stat-card/monster-stat-card.component';
import { MonsterStandeeComponent } from './components/monster/standee/monster-standee.component';
import { TabletopComponent } from './components/tabletop/tabletop.component';
import { TabletopBottomComponent } from './components/tabletop-bottom/tabletop-bottom.component';
import { AnyPipe } from './pipes/any.pipe';
import { ModifierPipe } from './pipes/modifier.pipe';
import { CatalogService } from 'services/catalog.service';
import { MonstersEffects } from 'store/tabletop/monsters/monsters.effects';
import { TimeMachineEffects } from 'store/time-machine/time-machine.effects';
import { timeMachineMetaReducers } from 'store/time-machine/time-machine.meta-reducers';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatModule } from './mat.module';
import { APP_REDUCERS, getReducers } from 'store/app.reducers';

@NgModule({
  declarations: [
    AddCardDialogComponent,
    AddStandeeDialogComponent,
    AppComponent,
    MonsterSetComponent,
    MonsterStandeeComponent,
    MonsterStatCardComponent,
    TabletopComponent,

    AnyPipe,
     TabletopBottomComponent,
     MonsterAbilityCardComponent,
     ModifierPipe
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    EffectsModule.forRoot([MonstersEffects, TimeMachineEffects]),
    FormsModule,
    HttpClientModule,
    LayoutModule,
    MatModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    StoreModule.forRoot(APP_REDUCERS, { metaReducers: [...timeMachineMetaReducers]})
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: (catalogService: CatalogService) => () => catalogService.initialize(), deps: [CatalogService], multi: true },
    {
      provide: APP_REDUCERS,
      useFactory: getReducers,
      deps: [CatalogService]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
