import { Component, AfterViewInit, ViewChild, ElementRef } from "@angular/core";

import { NodeEditor, Engine } from "rete";
import ConnectionPlugin from "rete-connection-plugin";
import ContextMenuPlugin from "rete-context-menu-plugin";
import { WorkFlowComponent } from "./components/workflow-component";
import { AddComponent } from "./components/add-component";
import { AngularRenderPlugin } from "rete-angular-render-plugin";
import { DataNodeService } from '../services/data-node.service';


@Component({
  selector: "app-rete",
  template: `
    <div class="wrapper">
      <div #nodeEditor class="node-editor"></div>
    </div>
  `,
  styles: [
    `.wrapper {
        width: 100%;
        height: 100%;
      }
      .socket.number {
        background: #96b38a;
      }
    `
  ]
})
export class ReteComponent implements AfterViewInit {
  @ViewChild("nodeEditor") el: ElementRef;
  editor = null;
  values = [];

  constructor(
    private dataNodeService: DataNodeService
  ) {}

  async ngAfterViewInit() {
    this.dataNodeService.getValue().subscribe( data => {
      this.values = data;
      // console.log('VALUES ===== ', this.values)
      });
    setTimeout(async () => {
      const container = this.el.nativeElement;

      const components = [new WorkFlowComponent(), new AddComponent()];

      const editor = new NodeEditor("demo@0.2.0", container);

      editor.use(ConnectionPlugin);
      console.log("AngularRenderPlugin", AngularRenderPlugin);
      editor.use(AngularRenderPlugin); //, { component: MyNodeComponent });
      editor.use(ContextMenuPlugin);

      const engine = new Engine("demo@0.2.0");

      components.map(c => {
        editor.register(c);
        engine.register(c);
      });

      const add = await components[1].createNode();
      add.position = [500, 240];
      editor.addNode(add);

      if(this.values.length !== 0) {
        let n = [];
        for(let i = 0; i < this.values.length; i++){
          n[i] = await components[0].createNode({
            str: this.values[i]
          });
          n[i].position = [80, (i + 1) * 200];
          editor.addNode(n[i]);
          editor.connect(n[i].outputs.get("str"), add.inputs.get(`str`));
        }
      }


      editor.on(["process", "nodecreated", "noderemoved", "connectioncreated", "connectionremoved"], (async () => {
        await engine.abort();
        await engine.process(editor.toJSON());
      }) as any);

      editor.view.resize();
      editor.trigger("process");
    }, 800);
  }
}

