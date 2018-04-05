import { NgModule, Type, Injector } from "@angular/core";
import { CommonModule } from "@angular/common";
import { WithCustomElementComponent } from "../element-registry";
import { TestComponent } from "./test-comp";
import { createCustomElement } from "@angular/elements";
@NgModule({
  imports: [CommonModule],
  declarations: [TestComponent],
  entryComponents: [TestComponent]
})
export class TestCompModule implements WithCustomElementComponent {
  customElementComponent: Type<any> = TestComponent;
}
