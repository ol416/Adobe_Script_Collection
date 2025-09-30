#target photoshop
app.bringToFront();

<javascriptresource>
<name>1.缩放</name>
<category>Character_crop</category>
</javascriptresource>

function main() {
    if (!app.documents.length) {
        alert("请打开一个文档并选择图层");
        return;
    }

    var doc = app.activeDocument;
    var layer = doc.activeLayer;

    // 配置顶部偏移量（像素），可以根据需要调整
    var topOffset = 50; // 从画布顶部偏移50像素，可修改此值

    // 配置缩放偏移量（像素），可以根据需要调整
    var scaleOffset = 8; // 在缩放计算中增加100像素偏移，可修改此值

    // 1. 播放动作（生成上半身选区）
    app.doAction("选中上半身", "test");  // 动作名: 选中上半身，组名: test

    // 2. 获取选区矩形
    var bounds = getSelectionBounds();
    if (!bounds) return;

    // 3. 缩放图层（带缩放偏移）
    scaleLayerToFitBounds(layer, bounds, scaleOffset);

    // 4. 去掉选区
    doc.selection.deselect();

    // 5. 进行图层顶对齐（带顶部偏移）
    alignLayerToTop(layer, topOffset);
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

function scaleLayerToFitBounds(layer, bounds, scaleOffset) {
    var doc = app.activeDocument;
    var docH = doc.height.as("px");
    var selHeight = bounds.height;

    // 在缩放计算中增加固定的像素偏移量
    var adjustedHeight = selHeight + scaleOffset;
    var scale = (docH / adjustedHeight) * 100;

    layer.resize(scale, scale, AnchorPosition.MIDDLECENTER);
}

function alignLayerToTop(layer, topOffset) {
    var doc = app.activeDocument;
    var layerBounds = layer.bounds;

    // 获取图层顶部位置
    var layerTop = layerBounds[1].as("px");

    // 计算需要移动的距离（考虑顶部偏移）
    var moveDistance = topOffset - layerTop;

    // 平移图层到指定偏移位置
    layer.translate(0, moveDistance);
}

main();
