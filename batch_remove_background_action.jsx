#target photoshop
<javascriptresource>
<name>批量删除图层背景</name>
<category>custom</category>
</javascriptresource>

function main() {
    if (!documents.length) {
        alert("请打开一个文档并选择至少一个图层。");
        return;
    }

    var doc = app.activeDocument;
    var selectedLayers = getSelectedLayers(doc);

    if (selectedLayers.length === 0) {
        alert("没有选中的图层。");
        return;
    }

    for (var i = 0; i < selectedLayers.length; i++) {
        var layer = selectedLayers[i];
        // if (layer.kind == LayerKind.SMARTOBJECT) {
        //     continue; // 跳过智能对象图层
        // }
        // if (layer.linkedLayers.length > 0) {
        //     continue; // 跳过链接的图层
        // }
        if (i == 0 && selectedLayers.length > 1) {
            doc.activeLayer = selectedLayers[1];
        }
        doc.activeLayer = layer;
        app.doAction("删除图层背景", "动作"); // 确保替换为你的实际动作组名
    }
}

cTID = function(s) { return app.charIDToTypeID(s); };
sTID = function(s) { return app.stringIDToTypeID(s); };

function newGroupFromLayers(doc) {
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putClass(sTID('layerSection'));
    desc.putReference(cTID('null'), ref);
    var lref = new ActionReference();
    lref.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
    desc.putReference(cTID('From'), lref);
    executeAction(cTID('Mk  '), desc, DialogModes.NO);
};

function undo() {
    executeAction(cTID("undo"), undefined, DialogModes.NO);
};

function getSelectedLayers(doc) {
    var selLayers = [];
    newGroupFromLayers(doc);

    var group = doc.activeLayer;
    var layers = group.layers;

    for (var i = 0; i < layers.length; i++) {
        selLayers.push(layers[i]);
    }

    undo();

    return selLayers;
};

main();
