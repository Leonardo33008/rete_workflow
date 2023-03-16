import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";

import { Engine, NodeEditor } from "rete";
import ConnectionPlugin from "rete-connection-plugin";
import ContextMenuPlugin from "rete-context-menu-plugin";
import { AngularRenderPlugin } from "rete-angular-render-plugin";
import { InicialComponent } from "./components/inicial-component";
import { FaseComponent } from "./components/fase-component";
import { FinalComponent } from "./components/final-component";
import { DataNodeService } from '../services/data-node.service';
import { ToastService } from '../services/toast.service';


@Component({
  selector: "app-rete", template: `
    <div class="wrapper">
      <div #nodeEditor class="node-editor">
        <div class="divBtn">
          <ion-button color="success" (click)="salvar()">Salvar</ion-button>
        </div>
      </div>
    </div>
  `, styles: [`.wrapper {
    width: 100%;
    height: 100%;
  }

  .divBtn {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  `]
})

export class ReteComponent implements AfterViewInit {
  @ViewChild("nodeEditor") el: ElementRef;
  editor = null;
  dataValue: any;
  isDuplicado: boolean;
  existe: boolean;
  haveConnection: boolean;
  inicioConnection: boolean;
  fimConnection: boolean;

  constructor(
    private dataNodeService: DataNodeService,
    private toastService: ToastService)
  {
  }

  async ngAfterViewInit() {
    this.dataNodeService.getAll().subscribe(async (valueJson) => {
      await localStorage.setItem('_WorkFlow', JSON.stringify(valueJson));
    });
    this.dataValue = await JSON.parse(localStorage.getItem('_WorkFlow'));
    setTimeout(async () => {

      const container = this.el.nativeElement;

      const components = [new InicialComponent(), new FaseComponent(), new FinalComponent()];

      const editor = new NodeEditor("demo@0.2.0", container);

      editor.use(ConnectionPlugin);
      console.log("AngularRenderPlugin", AngularRenderPlugin);
      editor.use(AngularRenderPlugin); //, { component: MyNodeComponent });
      editor.use(ContextMenuPlugin, {
        searchBar: false, delay: 1200
      });

      const engine = new Engine("demo@0.2.0");

      components.map(c => {
        editor.register(c);
        engine.register(c);
      });

      await editor.view.resize();
      editor.trigger("process");

      await editor.fromJSON(this.dataValue);
      const data = await editor.toJSON();

      localStorage.setItem('_WorkFlow', JSON.stringify(data));

      editor.on("nodecreated", (node) => {
        const data = editor.toJSON();
        let nodes = Object.keys(data.nodes);
        let last = nodes[nodes.length - 1];
        let name = data.nodes[last].name;
        data.nodes[last].data["addValue"] = {id: +last, faseName: name, alias: '', name: '', flag: ''};
        data.nodes[last].data["params"] = {qtd1: '', qtd2: '', tmp1: '', tmp2: '', table: []};

        localStorage.setItem('_WorkFlow', JSON.stringify(data));
      });

      editor.on("noderemoved", (node) => {
        const data = editor.toJSON();
        localStorage.setItem('_WorkFlow', JSON.stringify(data));
      });

      editor.on(["connectioncreated", "connectionremoved"], (connect) => {
        const data = editor.toJSON();
        localStorage.setItem('_WorkFlow', JSON.stringify(data));
      });

      editor.on(["process", "nodecreated", "noderemoved", "connectioncreated", "connectionremoved"], (async () => {
        await engine.abort();
        await engine.process(editor.toJSON());
      }) as any);
    }, 1200);
  }

  verificaDuplicidade() {
    const data = JSON.parse(localStorage.getItem('_WorkFlow'));
    this.isDuplicado = false;
    let verifica = Object.values(data.nodes);
    let inicioDuplicado = verifica.filter(item => item["name"] === 'Início');
    if (inicioDuplicado.length > 1) {
      this.toastService.toastError(`Deve existir apenas um card Início!`);
      this.isDuplicado = true;
    }
    let fimDuplicado = verifica.filter(item => item["name"] === 'Fim');
    if (fimDuplicado.length > 1) {
      this.toastService.toastError(`Deve existir apenas um card Fim!`);
      this.isDuplicado = true;
    }
  }

  verificaExistencia() {
    const data = JSON.parse(localStorage.getItem('_WorkFlow'));
    let verifica = Object.values(data.nodes);

    let exiteInicio = verifica.find((item) => item["name"] === 'Início');
    this.existe = true;
    if (!exiteInicio) {
      this.toastService.toastError(`Deve existir ao menos um card Início!`);
    }
    let exiteFim = verifica.find((item) => item["name"] === 'Fim');
    if (!exiteFim) {
      this.toastService.toastError(`Deve existir ao menos um card Fim!`);
    }
    if (!exiteInicio || !exiteFim) {
      this.existe = false;
    }
  }

  verificaConexao() {
    const data = JSON.parse(localStorage.getItem('_WorkFlow'));
    this.haveConnection = true;
    let verifica = Object.values(data.nodes);
    const fases = verifica.filter(item => item["name"] === 'Fase');
    for (let item of fases) {
      let inp = Object.values(item["inputs"]);
      let connectionsIn = inp.filter(connect => connect['connections'].length !== 0);
      if (connectionsIn.length === 0) {
        this.haveConnection = false;
        this.toastService.toastError('A Fase deve possuir ao menos um input');
      }
      let out = Object.values(item["outputs"]);
      let connectionsOut = out.filter(connect => connect['connections'].length !== 0);
      if (connectionsOut.length === 0) {
        this.haveConnection = false;
        this.toastService.toastError('A Fase deve possuir ao menos um output');
      }
    }
  }

  verificaInicio() {
    const data = JSON.parse(localStorage.getItem('_WorkFlow'));
    this.inicioConnection = true;
    let verificaConexao = Object.values(data.nodes);
    const inicio = verificaConexao.filter(item => item["name"] === 'Início');
    if (inicio.length > 1) {
      this.toastService.toastError('Deve existir apenas um card Início!');
    }
    if (!inicio.length) {
      this.toastService.toastError('Deve existir ao menos um card Início!');
    } else {
      let out = Object.values(inicio[0]["outputs"]);
      let connectionsOut = out.filter(connect => connect['connections'].length !== 0);
      if (connectionsOut.length === 0) {
        this.inicioConnection = false;
        this.toastService.toastError('O Início deve possuir ao menos uma conexão');
      }
    }
  }

  verificaFim() {
    const data = JSON.parse(localStorage.getItem('_WorkFlow'));
    this.fimConnection = true;
    let verificaConexao = Object.values(data.nodes);
    const fim = verificaConexao.filter(item => item["name"] === 'Fim');
    if (fim.length > 1) {
      this.toastService.toastError('Deve existir apenas um card Fim!');
    }
    if (!fim.length) {
      this.toastService.toastError('Deve existir ao menos um card Fim!');
    } else {
      let inp = Object.values(fim[0]["inputs"]);
      let connectionsInp = inp.filter(connect => connect['connections'].length !== 0);
      if (connectionsInp.length === 0) {
        this.fimConnection = false;
        this.toastService.toastError('O Fim deve possuir ao menos uma conexão');
      }
    }
  }

  salvar() {
    const data = JSON.parse(localStorage.getItem('_WorkFlow'));
    let nodes = Object.values(data.nodes);
    const existeFase = nodes.find(item => item["name"] === 'Fase');

    if (existeFase) {
      this.verificaInicio();
      this.verificaFim();
      this.verificaExistencia();
      this.verificaDuplicidade();
      this.verificaConexao();

      if (this.isDuplicado === false && this.existe === true && this.haveConnection === true &&
        this.inicioConnection === true && this.fimConnection === true) {
        this.dataNodeService.post(data).subscribe(() => {
          this.toastService.toastSuccess('Salvando...');
        });
      }
    } else {
      this.toastService.toastError('Deve existir ao menos um card Fase!');
    }
  }
}
