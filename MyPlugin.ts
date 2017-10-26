// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import {
  ILayoutRestorer, JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';

import {
  InstanceTracker
} from '@jupyterlab/apputils';

/**
 * The name of the factory that creates CSV widgets.
 */
const FACTORY = 'NetCDF';


/**
 * The table file handler extension.
 */
const plugin: JupyterLabPlugin<void> = {
  activate,
  id: '@jupyterlab/nc-viewer-extension:plugin',
  requires: [],
  autoStart: true
};


/**
 * Export the plugin as default.
 */
export default plugin;


/**
 * Activate the table widget extension.
 */
function activate(app: JupyterLab): void {
  const factory = new NCFactory({
    name: FACTORY,
    fileTypes: ['nc'],
    defaultFor: ['nc'],
    readOnly: true
  });
  const tracker = new InstanceTracker<NCFactory>({ namespace: 'nc-viewer' });

  // Handle state restoration.
//   restorer.restore(tracker, {
//     command: 'docmanager:open',
//     args: widget => ({ path: widget.context.path, factory: FACTORY }),
//     name: widget => widget.context.path
//   });

  app.docRegistry.addWidgetFactory(factory);
  let ft = app.docRegistry.getFileType('nc');
  factory.widgetCreated.connect((sender, widget) => {
    // Track the widget.
    tracker.add(widget);
    // Notify the instance tracker if restore data needs to update.
    widget.context.pathChanged.connect(() => { tracker.save(widget); });

    if (ft) {
      widget.title.iconClass = ft.iconClass;
      widget.title.iconLabel = ft.iconLabel;
    }
  }); 
}

class NCFactory extends DocumentRegistry.IWidgetFactory<NCDimensionLoaderPanel> {

}