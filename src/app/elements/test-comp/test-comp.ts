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
