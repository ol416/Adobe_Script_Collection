var doc = app.activeDocument;

function resizeSmartObject() {

    //target current active layer

    var ref = new ActionReference();

    ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));

    //check the type of layer

    //1 = ArtLayer

    //2 = Adjustment

    //3 = Text

    //4 = Shape

    //5 = Smart Object

    // ...

    //9 = Gradient Fil

    //10 = Pattern Fill

    //11 = Solid Fill

    var layerType = executeActionGet(ref).getInteger(stringIDToTypeID("layerKind"));

    //if layer is a smart object, get diminensions of source

    if (layerType == "5") {

        var obj = executeActionGet(ref).getObjectValue(stringIDToTypeID("smartObjectMore"));

        with(obj) {

            var _tmp = getObjectValue(stringIDToTypeID("size"));

            var size = new Object({

                width: _tmp.getDouble(stringIDToTypeID("width")),

                height: _tmp.getDouble(stringIDToTypeID("height")),

            });
            alert(size.width + " " + size.height);

        }

        //divide the original/current

        var bounds = app.activeDocument.activeLayer.bounds;

        var w_new = (size.width / (bounds[2].value - bounds[0].value)) * 100;

        var h_new = (size.height / (bounds[3].value - bounds[1].value)) * 100;

        app.activeDocument.activeLayer.resize(w_new, h_new);

        return;

    } else {
        return;
    }

}

function cycleLayers(set) {

    for (var i = 0; i < set.layers.length; i++) {

        // doc.activeLayer = set.layers;

        if (doc.activeLayer.typename == 'LayerSet') {

            if (doc.activeLayer.layers.length > 0) {

                cycleLayers(doc.activeLayer);

            }

        } else {

            resizeSmartObject();

        }

    }

}

cycleLayers(doc);