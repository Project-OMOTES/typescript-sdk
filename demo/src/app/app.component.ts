import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { JobTypeName } from '@omotes/sdk';
import { Subject, map, merge, share, switchMap } from 'rxjs';
import { OmotesService } from './omotes.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private readonly trigger$ = new Subject<void>();
  private readonly omotesService = inject(OmotesService);
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly result$ = this.getResultStream();
  protected readonly loading$ = this.getLoadingStream();

  protected readonly form = this.fb.group({
    esdl: this.fb.control('', Validators.required),
    jobType: this.fb.control<JobTypeName>('grow_optimizer', Validators.required),
  });

  protected submit() {
    if (this.form.valid) {
      this.trigger$.next();
    }
  }

  protected reset() {
    this.form.reset();
  }

  protected onEditorLoad() {
    this.omotesService.loadDemoESDL().subscribe((esdl) => {
      this.form.controls.esdl.setValue(esdl);
    });
  }

  private getResultStream() {
    return this.trigger$.pipe(
      switchMap(() => {
        const { esdl, jobType } = this.form.getRawValue();
        return this.omotesService.submit(esdl, jobType);
      })
    ).pipe(share());
  }

  private getLoadingStream() {
    return merge(
      this.trigger$.pipe(map(() => true)),
      this.result$.pipe(map(() => false))
    ).pipe(share());
  }
}
