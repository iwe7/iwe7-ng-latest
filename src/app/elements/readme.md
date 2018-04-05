## angular/elements 
> 用于将 Angular 组件包装为 Web Components， 简化了在 Angular 应用外部的动态创建过程。
> [演示地址](https://angular-elements.firebaseapp.com/)

## 核心
```
import { createCustomElement } from "@angular/elements";
```

## 测试使用
- NgModuleFactoryLoader -> SystemJsNgModuleLoader 动态加载 并去掉无用提醒
```
providers:[
    {
        provide: NgModuleFactoryLoader,
        useClass: SystemJsNgModuleLoader
    }
],
schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
```

## 加载器
```
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
```
- app-root 根组件使用编译组件内容
```ts
import { Component, ViewChild, ElementRef } from "@angular/core";
import { ElementsLoader } from "./elements/elements-loader";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "app";
  constructor(public element: ElementsLoader, public ele: ElementRef) {}
  ngOnInit() {
    // 核心在这里
    this.element.loadContainingCustomElements(this.ele.nativeElement);
  }
}
```


## 编写elements组件

```ts
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "test-comp",
  template: ` test comp `
})
export class TestComponent implements OnInit {
  constructor() {}
  ngOnInit() {}
}

import { NgModule, Type, Injector } from "@angular/core";
import { CommonModule } from "@angular/common";
import { WithCustomElementComponent } from "../element-registry";
import { createCustomElement } from "@angular/elements";
@NgModule({
  imports: [CommonModule],
  declarations: [TestComponent],
  entryComponents: [TestComponent]
})
export class TestCompModule implements WithCustomElementComponent {
  customElementComponent: Type<any> = TestComponent;
}
```

## 让angular编译器编译这个组件，并配置到loader map中
```
export const ELEMENT_MODULE_PATHS_AS_ROUTES = [
  {
    selector: "test-comp",
    loadChildren: "./test-comp/test-comp.module#TestCompModule"
  }
];

ELEMENT_MODULE_PATHS_AS_ROUTES.forEach(route => {
  ELEMENT_MODULE_PATHS.set(route.selector, route.loadChildren);
});

providers: [
    {
      provide: ROUTES,
      useValue: ELEMENT_MODULE_PATHS_AS_ROUTES,
      multi: true
    }
]
```


## 总结
完全去掉angular root 的方法我还没找到，期待我大NG相关文档赶紧完善，让我等小粉也体验一把！
