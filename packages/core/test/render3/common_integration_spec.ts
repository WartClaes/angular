/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {NgForOfContext} from '@angular/common';

import {defineComponent} from '../../src/render3/index';
import {bind, container, containerRefreshEnd, containerRefreshStart, elementEnd, elementProperty, elementStart, text, textBinding} from '../../src/render3/instructions';

import {NgForOf} from './common_with_def';
import {renderComponent, toHtml} from './render_util';

describe('@angular/common integration', () => {
  describe('NgForOf', () => {
    it('should update a loop', () => {
      class MyApp {
        items: string[] = ['first', 'second'];

        static ngComponentDef = defineComponent({
          type: MyApp,
          factory: () => new MyApp(),
          selector: [[['my-app'], null]],
          // <ul>
          //   <li *ngFor="let item of items">{{item}}</li>
          // </ul>
          template: (myApp: MyApp, cm: boolean) => {
            if (cm) {
              elementStart(0, 'ul');
              { container(1, liTemplate, undefined, ['ngForOf', '']); }
              elementEnd();
            }
            elementProperty(1, 'ngForOf', bind(myApp.items));
            containerRefreshStart(1);
            containerRefreshEnd();

            function liTemplate(row: NgForOfContext<string>, cm: boolean) {
              if (cm) {
                elementStart(0, 'li');
                { text(1); }
                elementEnd();
              }
              textBinding(1, bind(row.$implicit));
            }
          },
          directiveDefs: () => [NgForOf.ngDirectiveDef]
        });
      }

      const myApp = renderComponent(MyApp);
      expect(toHtml(myApp)).toEqual('<ul><li>first</li><li>second</li></ul>');
    });
    // TODO: Test inheritance
  });
});
