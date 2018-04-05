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
    this.element.loadContainingCustomElements(this.ele.nativeElement);
  }
}
