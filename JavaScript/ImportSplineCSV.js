//Author-Autodesk Inc.
//Description-Create spline based on the data imported from CSV file.
/*globals adsk*/
(function () {

    "use strict";

    if (adsk.debug === true) {
        /*jslint debug: true*/
        debugger;
        /*jslint debug: false*/
    }

    var ui;
    try {
        
        var app = adsk.core.Application.get();
        ui = app.userInterface;
        
        var design = adsk.fusion.Design(app.activeProduct);
        var title = 'Import Spline CSV';
        if (!design) {
            ui.messageBox('No active design', title);
            adsk.terminate();
            return;
        }
        
        var dlg = ui.createFileDialog();
        dlg.title = 'Open CSV File';
        dlg.filter = 'Comma Separated Values (*.csv);;All Files (*.*)';
        if (dlg.showOpen() !== adsk.core.DialogResults.DialogOK) {
            adsk.terminate();
            return;
        }
        var filename = dlg.filename;
        
        var buffer = adsk.readFile(filename);
        if (!buffer) {
            ui.messageBox('Failed to open ' + filename);
            adsk.terminate();
            return;
        }
        var data = adsk.utf8ToString(buffer);
        data = data.split('\n');
        var i, j, points = adsk.core.ObjectCollection.create();
        for (i = 0;i < data.length;++i) {
            data[i] = data[i].split(',');
            for (j = 0;j < data[i].length;++j) {
                data[i][j] = parseFloat(data[i][j]);
            }
            if (data[i].length >= 3) {
                var point = adsk.core.Point3D.create(data[i][0], data[i][1], data[i][2]);
                points.add(point);
            }
        }
        
        var root = design.rootComponent;
        var sketch = root.sketches.add(root.xYConstructionPlane);
        sketch.sketchCurves.sketchFittedSplines.add(points);
        
    } 
    catch(e) {
        if (ui) {
            ui.messageBox('Failed : ' + (e.description ? e.description : e));
        }
    }

    adsk.terminate();
}());
