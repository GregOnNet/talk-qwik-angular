import {
  AfterViewInit,
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from '@angular/cdk/dialog';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { CdkPortal } from '@angular/cdk/portal';
import { filter, merge, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DialogComponent implements AfterViewInit, OnDestroy {
  private readonly overlayConfig = new OverlayConfig({
    hasBackdrop: true,
    positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
    scrollStrategy: this.overlay.scrollStrategies.block()
  });

  private overlayRef = this.overlay.create(this.overlayConfig);

  @Input() width = 'auto';
  @Input() height = 'auto';

  @Output() closed = new EventEmitter();

  @ViewChild(CdkPortal) public readonly portal?: CdkPortal;

  constructor(private readonly destroyRef: DestroyRef, private readonly overlay: Overlay) {}

  ngAfterViewInit(): void {
    // Wait until the view is initialized to attach the portal to the overlay
    this.overlayRef?.attach(this.portal);

    const escapeKeyPressed = this.overlayRef.keydownEvents().pipe(
      filter(event => event.key.toLowerCase() === 'escape'),
      takeUntilDestroyed(this.destroyRef)
    );

    // telling the parent to destroy the dialog when the user
    // clicks on the backdrop or press escape
    merge(this.overlayRef.backdropClick(), escapeKeyPressed)
      .pipe(
        tap(() => this.closed.emit()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    // parent destroys this component, this component destroys the overlayRef
    this.overlayRef?.detach();
    this.overlayRef?.dispose();
  }
}
