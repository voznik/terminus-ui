import { Component } from '@angular/core';

@Component({
  selector: 'demo-typography',
  styleUrls: ['./typography.component.scss'],
  template: `
    <div class="display-4">
      Display 4
    </div>

    <div class="display-3">
      Display 3
    </div>

    <div class="display-2">
      Display 2
    </div>

    <div class="display-1">
      Display 1
    </div>

    <div class="headline">
      Headline
    </div>

    <div class="title">
      Title
    </div>

    <div class="subhead">
      Subhead
    </div>

    <div class="body-2">
      Body 2
    </div>

    <div class="body-1">
      Body 1
    </div>

    <div class="caption">
      Caption
    </div>

    <hr>

    <div class="body-mono">
      Body - Monospaced
    </div>
  `,
})
export class TypographyComponent {
}
