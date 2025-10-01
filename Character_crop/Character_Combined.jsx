#target photoshop
app.bringToFront();

// =======================================================
// Photoshop ExtendScript: 合并脚本 - 缩放+垂直对齐+水平居中（带多偏移量）
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

    // === 配置参数 ===
    var CONFIG = {
        topOffset: 50,          // 顶部安全边距
        bottomOffset: 0,       // 底部安全边距
        leftOffset: 0,          // 左边距修正
        rightOffset: 0,         // 右边距修正
        centerOffsetX: 0,       // 居中水平修正
        centerOffsetY: 0,       // 居中垂直修正
        scaleOffset: 8,         // 缩放高度偏移
        verticalTopOffset: 5    // 垂直对齐时的额外顶部偏移
    };

    // === 第一步：获取或生成选区 ===
    var bounds = getSelectionBounds();
    if (!bounds) {
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

    // === 第二步：缩放图层并计算新选区 ===
    var scaledBounds = scaleLayerToFitBounds(layer, bounds, CONFIG.scaleOffset);
    if (!scaledBounds) {
        alert("缩放后未能获取选区，请检查选区是否仍然存在");
        return;
    }

    // === 第三步：计算移动量 ===
    var moveX = 0;
    var moveY = 0;

    // --- 水平方向 ---
    var xCenter = (scaledBounds.left + scaledBounds.right) / 2;
    var docCenterX = doc.width.as("px") / 2;
    moveX = (docCenterX - xCenter) + CONFIG.centerOffsetX;

    // 左右边距修正
    if (CONFIG.leftOffset !== 0) moveX += CONFIG.leftOffset;
    if (CONFIG.rightOffset !== 0) moveX -= CONFIG.rightOffset;

    // --- 垂直方向 ---
    var yMin = scaledBounds.top;
    var yMax = scaledBounds.bottom;
    var docH = doc.height.as("px");

    // 以顶部为基准对齐
    moveY = -yMin + CONFIG.verticalTopOffset + CONFIG.centerOffsetY;

    // 顶部边距修正
    if (CONFIG.topOffset > 0) moveY += CONFIG.topOffset;

    // 底部边距修正（保证留白）
    if (yMax + moveY + CONFIG.bottomOffset > docH) {
        var overflow = (yMax + moveY + CONFIG.bottomOffset) - docH;
        moveY -= overflow;
    }

    // === 第四步：一次性移动图层 ===
    layer.translate(moveX, moveY);

    // 取消选区
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

function scaleLayerToFitBounds(layer, bounds, scaleOffset) {
    var doc = app.activeDocument;
    var docH = doc.height.as("px");
    var selHeight = bounds.height;

    // 缩放计算：加入额外偏移量
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
