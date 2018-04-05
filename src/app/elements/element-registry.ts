import { Type, InjectionToken } from "@angular/core";

export interface WithCustomElementComponent {
  customElementComponent: Type<any>;
}

export const ELEMENT_MODULE_PATHS_TOKEN = new InjectionToken("elements-map");

export const ELEMENT_MODULE_PATHS = new Map<string, string>();

export const ELEMENT_MODULE_PATHS_AS_ROUTES = [
  {
    selector: "test-comp",
    loadChildren: "./test-comp/test-comp.module#TestCompModule"
  }
];

ELEMENT_MODULE_PATHS_AS_ROUTES.forEach(route => {
  ELEMENT_MODULE_PATHS.set(route.selector, route.loadChildren);
});
