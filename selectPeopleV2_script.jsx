#target photoshop
app.bringToFront();

function main() {
    if (!app.documents.length) {
        alert("请打开一个文档并选择图层");
        return;
    }

    var doc = app.activeDocument;
    var layer = doc.activeLayer;

    // 1. 播放动作（生成上半身选区）
    app.doAction("选中上半身", "test");  // 动作名: 选中上半身，组名: test

    // 2. 获取选区矩形
    var bounds = getSelectionBounds();
    if (!bounds) return;

    // 3. 缩放图层
    scaleLayerToFitBounds(layer, bounds);

    // 4. 去掉选区
    doc.selection.deselect();
}

function getSelectionBounds() {
    try {
        var bounds = app.activeDocument.selection.bounds;
        return {
            left:   bounds[0].as("px"),
            top:    bounds[1].as("px"),
            right:  bounds[2].as("px"),
            bottom: bounds[3].as("px"),
            width:  bounds[2].as("px") - bounds[0].as("px"),
            height: bounds[3].as("px") - bounds[1].as("px")
        };
    } catch (e) {
        return null;
    }
}

function scaleLayerToFitBounds(layer, bounds) {
    var doc = app.activeDocument;
    var docH = doc.height.as("px");
    var selHeight = bounds.height;

    var scale = (docH / selHeight) * 100;
    layer.resize(scale, scale, AnchorPosition.MIDDLECENTER);
}

main();
