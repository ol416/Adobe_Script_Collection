#target photoshop
app.bringToFront();

// =======================================================
// Photoshop ExtendScript: 合并脚本 - 缩放+垂直对齐+水平居中
// 整合了原有的三个脚本功能，避免多次运行action
// =======================================================

<javascriptresource>
<name>Character Combined</name>
<category>Character_crop</category>
</javascriptresource>

function characterCombined() {
    if (!app.documents.length) {
        alert("请先打开一个文档并选择图层");
        return;
    }

    var doc = app.activeDocument;
    var layer = doc.activeLayer;

    // 配置参数
    var topOffset = 50;      // 顶部偏移量（像素）
    var scaleOffset = 8;     // 缩放偏移量（像素）
    var verticalTopOffset = 5; // 垂直对齐的顶部偏移量（像素）

    // 第一步：获取或生成选区（只需一次action）
    var bounds = getSelectionBounds();
    if (!bounds) {
        // 没有选区，播放动作生成选区（只需一次）
        try {
            app.doAction("选中上半身", "test");
        } catch (e) {
            alert("未找到动作 test/选中上半身，请检查动作是否存在");
            return;
        }

        bounds = getSelectionBounds();
        if (!bounds) {
            alert("没有有效的选区，请先运行动作生成选区");
            return;
        }
    }

    // 第三步：缩放后获取新的选区Bounds（选区已同步缩放）
    var scaledBounds = scaleLayerToFitBounds(layer, bounds, scaleOffset);
    if (!scaledBounds) {
        alert("缩放后未能获取选区，请检查选区是否仍然存在");
        return;
    }

    // 第四步：计算最终的移动量（垂直和水平同时移动）
    var moveX = 0;
    var moveY = 0;

    // 计算水平移动量（使用缩放后的选区）
    var xLeft = scaledBounds.left;
    var xRight = scaledBounds.right;
    var xCenter = (xLeft + xRight) / 2;
    var docCenter = doc.width.as("px") / 2;
    moveX = docCenter - xCenter;

    // 计算垂直移动量（使用缩放后的选区进行垂直对齐）
    var yMin = scaledBounds.top;
    moveY = -yMin + verticalTopOffset;

    // 第六步：一次性移动图层（同时完成垂直和水平对齐）
    layer.translate(moveX, moveY);

    // 取消选区
    doc.selection.deselect();

    // alert("合并操作完成 ✅");
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

    // 缩放图层
    layer.resize(scale, scale, AnchorPosition.MIDDLECENTER);

    // === 手动计算缩放后的选区坐标 ===
    var scaleFactor = scale / 100.0;
    var newBounds = {
        left:   (bounds.left   - doc.width.as("px")/2) * scaleFactor + doc.width.as("px")/2,
        right:  (bounds.right  - doc.width.as("px")/2) * scaleFactor + doc.width.as("px")/2,
        top:    (bounds.top    - doc.height.as("px")/2) * scaleFactor + doc.height.as("px")/2,
        bottom: (bounds.bottom - doc.height.as("px")/2) * scaleFactor + doc.height.as("px")/2
    };
    newBounds.width  = newBounds.right - newBounds.left;
    newBounds.height = newBounds.bottom - newBounds.top;

    return newBounds;
}


// 执行函数
characterCombined();
