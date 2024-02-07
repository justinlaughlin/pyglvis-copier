import { DOMWidgetModel, DOMWidgetView } from '@jupyter-widgets/base';
import { JupyterFrontEndPlugin } from '@jupyterlab/application';
declare const version: any;
/**
 * Initialization data for the glvis extension.
 */
declare const plugin: JupyterFrontEndPlugin<void>;
export declare class GLVisModel extends DOMWidgetModel {
    defaults(): {
        _model_name: string;
        _model_module: string;
        _model_module_version: string;
        _view_name: string;
        _view_module: string;
        _view_module_version: string;
        value: string;
    };
    static model_name: string;
    static model_module: string;
    static model_module_version: string;
    static view_name: string;
    static view_module: string;
    static view_module_version: string;
}
export declare class GLVisView extends DOMWidgetView {
    private div;
    private glv;
    private width;
    private height;
    render(): void;
    handle_message(content: any): void;
    set_size(): void;
    plot(): void;
}
export default plugin;
export { version };
