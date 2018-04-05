import {
  NgModule,
  NgModuleFactoryLoader,
  SystemJsNgModuleLoader,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA
} from "@angular/core";

import { CommonModule } from "@angular/common";
import { ROUTES } from "@angular/router";
import { ElementsLoader } from "./elements-loader";
import {
  ELEMENT_MODULE_PATHS_TOKEN,
  ELEMENT_MODULE_PATHS,
  ELEMENT_MODULE_PATHS_AS_ROUTES
} from "./element-registry";
import { BrowserModule } from "@angular/platform-browser";

@NgModule({
  imports: [CommonModule, BrowserModule],
  providers: [
    ElementsLoader,
    {
      provide: NgModuleFactoryLoader,
      useClass: SystemJsNgModuleLoader
    },
    { provide: ELEMENT_MODULE_PATHS_TOKEN, useValue: ELEMENT_MODULE_PATHS },
    {
      provide: ROUTES,
      useValue: ELEMENT_MODULE_PATHS_AS_ROUTES,
      multi: true
    }
  ]
})
export class ElementsModule {}
