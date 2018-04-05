import { BrowserModule } from "@angular/platform-browser";
import {
  NgModule,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA
} from "@angular/core";

import { AppComponent } from "./app.component";
import { ElementsModule } from "./elements/elements.module";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, ElementsModule],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  entryComponents: []
})
export class AppModule {

}
