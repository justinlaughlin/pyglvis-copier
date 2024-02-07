import {
  DOMWidgetModel,
  DOMWidgetView
} from '@jupyter-widgets/base';

import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';


const version = require('../package.json').version;
const glvis = require("glvis");

/**
 * Initialization data for the glvis extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'glvis-jupyter:plugin',
  description: 'A JupyterLab extension.',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension glvis-jupyter is activated!');
  }
};


// Modifying based off of https://ipywidgets.readthedocs.io/en/latest/examples/Widget%20Custom.html#models-and-views
export class GLVisModel extends DOMWidgetModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: GLVisModel.model_name, //'GLVisModel',
      _model_module: GLVisModel.model_module, //'glvis-jupyter',
      _model_module_version: GLVisModel.model_module_version, //`^${version}`,
      _view_name: GLVisModel.view_name, //'GLVisView',
      _view_module: GLVisModel.view_module, //'glvis-jupyter',
      _view_module_version: GLVisModel.view_module_version, //`^${version}`,
      value : 'Hello World'
    };
  }

  static model_name = 'GLVisModel';
  static model_module = 'glvis-jupyter';
  static model_module_version = '^${version}';
  static view_name = 'GLVisModel';
  static view_module = 'glvis-jupyter';
  static view_module_version = '^${version}';
}

export class GLVisView extends DOMWidgetView {
  private div: HTMLDivElement = document.createElement('div');
  private glv: any = null;
  private width: number = 0;
  private height: number = 0;

  render() {
    this.div.setAttribute('id', `glvis-${Date.now()}`);
    this.div.setAttribute('tabindex', '0');
    this.el.append(this.div);

    this.model.on('change:data_str', this.plot, this);
    this.model.on('change:height', this.set_size, this);
    this.model.on('change:width', this.set_size, this);
    this.model.on('msg:custom', this.handle_message, this);

    this.width = this.model.get('width');
    this.height = this.model.get('height');

    //this.glv = new (window as any).glvis.State(this.div, this.width, this.height);
    this.glv = new glvis.State(this.div, this.width, this.height);
    this.plot();
  }

  handle_message(content: any) {
    const msg = content.msg;
    // const buffers = content.buffers; // not used

    if (msg.type === 'screenshot') {
      if (msg.use_web) {
        this.glv.saveScreenshot(msg.name);
      } else {
        const that = this;
        this.glv.getPNGAsB64().then((v: any) => {
          that.send({ type: 'screenshot', name: msg.name, b64: v });
        });
      }
    }
  }

  set_size() {
    const width = this.model.get('width');
    const height = this.model.get('height');
    this.glv.setSize(width, height);
  }

  plot() {
    const type = this.model.get('data_type');
    const data = this.model.get('data_str');

    const is_new_stream = this.model.get('is_new_stream');
    if (is_new_stream) {
      this.glv.display(type, data);
    } else {
      this.glv.update(type, data);
    }
  }
}

export default plugin;
export { version };
