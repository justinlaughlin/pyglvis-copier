import { DOMWidgetModel, DOMWidgetView } from '@jupyter-widgets/base';
const version = require('../package.json').version;
const glvis = require("glvis");
/**
 * Initialization data for the glvis extension.
 */
const plugin = {
    id: 'glvis-jupyter:plugin',
    description: 'A JupyterLab extension.',
    autoStart: true,
    activate: (app) => {
        console.log('JupyterLab extension glvis-jupyter is activated!');
    }
};
// Modifying based off of https://ipywidgets.readthedocs.io/en/latest/examples/Widget%20Custom.html#models-and-views
class GLVisModel extends DOMWidgetModel {
    defaults() {
        return {
            ...super.defaults(),
            _model_name: GLVisModel.model_name,
            _model_module: GLVisModel.model_module,
            _model_module_version: GLVisModel.model_module_version,
            _view_name: GLVisModel.view_name,
            _view_module: GLVisModel.view_module,
            _view_module_version: GLVisModel.view_module_version,
            value: 'Hello World'
        };
    }
}
GLVisModel.model_name = 'GLVisModel';
GLVisModel.model_module = 'glvis-jupyter';
GLVisModel.model_module_version = '^${version}';
GLVisModel.view_name = 'GLVisModel';
GLVisModel.view_module = 'glvis-jupyter';
GLVisModel.view_module_version = '^${version}';
export { GLVisModel };
export class GLVisView extends DOMWidgetView {
    constructor() {
        super(...arguments);
        this.div = document.createElement('div');
        this.glv = null;
        this.width = 0;
        this.height = 0;
    }
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
    handle_message(content) {
        const msg = content.msg;
        // const buffers = content.buffers; // not used
        if (msg.type === 'screenshot') {
            if (msg.use_web) {
                this.glv.saveScreenshot(msg.name);
            }
            else {
                const that = this;
                this.glv.getPNGAsB64().then((v) => {
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
        }
        else {
            this.glv.update(type, data);
        }
    }
}
export default plugin;
export { version };
//# sourceMappingURL=index.js.map