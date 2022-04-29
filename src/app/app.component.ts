import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { Element } from 'models/element';
import { AppState } from 'store/app.state';
import { clearTabletop, infuseElement } from 'store/tabletop/tabletop.actions';
import { selectElementalInfusion, selectRound } from 'store/tabletop/tabletop.selectors';
import { redo, undo } from 'store/time-machine/time-machine.actions';
import { selectFuture, selectPast } from 'store/time-machine/time-machine.selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  title = $localize`:@@title:Haven Keeper`;

  public round$ = this.store.select(selectRound);

  public hasPast$ = this.store.select(selectPast)
    .pipe(
      map((past) => Boolean(past.length))
    );
  public hasFuture$ = this.store.select(selectFuture)
    .pipe(
      map((future) => Boolean(future.length))
    );

  public elementalInfusions$ = this.store.select(selectElementalInfusion)
    .pipe(
      map((elementalInfusion) => Object.entries(elementalInfusion)
        .map(([element, strength]) => ({
          element: element as Element,
          strength
        }))
      )
    );

  constructor(private store: Store<AppState>) { }

  undo() {
    this.store.dispatch(undo({ length: 1 }));
  }

  redo() {
    this.store.dispatch(redo({ length: 1 }));
  }

  infuseElement(element: Element) {
    this.store.dispatch(infuseElement({ element }));
  }

  clearTabletop() {
   this.store.dispatch(clearTabletop()); 
  }
}
