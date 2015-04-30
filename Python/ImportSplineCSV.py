#Author-Autodesk Inc
#Description-Import spline from csv file

import adsk.core, adsk.fusion, traceback

def main():
    ui = None
    try:
        app = adsk.core.Application.get()
        ui  = app.userInterface
        # Get all components in the active design.
        product = app.activeProduct
        design = product
        title = 'Import Spline csv'
        if not design:
            ui.messageBox('No active Fusion design', title)
            return
        
        dlg = ui.createFileDialog()
        dlg.title = 'Open CSV File'
        dlg.filter = 'Comma Separated Values (*.csv);;All Files (*.*)'
        if dlg.showOpen() != adsk.core.DialogResults.DialogOK :
            return
        
        filename = dlg.filename
        f = open(filename, 'r')
        points = adsk.core.ObjectCollection.create()
        line = f.readline()
        data = []
        while line:
            pntStrArr = line.split(',')
            for pntStr in pntStrArr:
                data.append( float(pntStr))
        
            if len(data) >= 3 :
                point = adsk.core.Point3D.create(data[0], data[1], data[2])
                points.add(point)
            line = f.readline()
            data.clear()            
        f.close()        
        root = design.rootComponent;
        sketch = root.sketches.add(root.xYConstructionPlane);
        sketch.sketchCurves.sketchFittedSplines.add(points);     
    except:
        if ui:
            ui.messageBox('Failed:\n{}'.format(traceback.format_exc()))
main()
