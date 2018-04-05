import {
  Inject,
  Injectable,
  NgModuleFactoryLoader,
  NgModuleRef
} from "@angular/core";
import { ELEMENT_MODULE_PATHS_TOKEN } from "./element-registry";
import { of } from "rxjs/observable/of";
import { from as fromPromise } from "rxjs/observable/from";
import { Observable } from "rxjs/Observable";
import { createCustomElement } from "@angular/elements";

@Injectable()
export class ElementsLoader {
  elementsToLoad: Map<string, string>;
  constructor(
    private moduleFactoryLoader: NgModuleFactoryLoader,
    private moduleRef: NgModuleRef<any>,
    @Inject(ELEMENT_MODULE_PATHS_TOKEN) elementModulePaths
  ) {
    this.elementsToLoad = new Map(elementModulePaths);
  }
  loadContainingCustomElements(element: HTMLElement): Observable<void> {
    const selectors: any[] = Array.from(this.elementsToLoad.keys()).filter(s =>
      element.querySelector(s)
    );
    if (!selectors.length) {
      return of(undefined);
    }
    return fromPromise(
      Promise.all(selectors.map(s => this.register(s))).then(
        result => undefined
      )
    );
  }
  private register(selector: string) {
    const modulePath = this.elementsToLoad.get(selector)!;
    return this.moduleFactoryLoader
      .load(modulePath)
      .then(elementModuleFactory => {
        if (!this.elementsToLoad.has(selector)) {
          return;
        }
        const elementModuleRef = elementModuleFactory.create(
          this.moduleRef.injector
        );
        const CustomElementComponent =
          elementModuleRef.instance.customElementComponent;
        const CustomElement = createCustomElement(CustomElementComponent, {
          injector: elementModuleRef.injector
        });
        customElements!.define(selector, CustomElement);
        this.elementsToLoad.delete(selector);
        return customElements.whenDefined(selector);
      });
  }
}
