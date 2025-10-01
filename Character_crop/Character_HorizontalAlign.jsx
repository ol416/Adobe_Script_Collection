#target photoshop
// =======================================================
// Photoshop ExtendScript: 水平居中脚本
// 前提：图层已被选中，选区可由动作生成（如 test/上半身 或 人物主体）
// =======================================================

<javascriptresource>
<name>3.水平居中对齐</name>
<category>Character_crop</category>
</javascriptresource>

// Photoshop ExtendScript: 水平居中脚本
// 前提：图层已被选中，选区可由动作生成（如 test/上半身 或 人物主体）

function characterHorizontalAlign() {
    if (!app.documents.length) {
        alert("请先打开一个文档并选择图层");
        return;
    }

    var doc = app.activeDocument;
    var layer = doc.activeLayer;

    // Step 1: 先检查是否有选区
    try {
        var bounds = doc.selection.bounds; // [left, top, right, bottom]
    } catch (e) {
        // 没有选区，播放动作生成选区
        try {
            app.doAction("选中上半身", "test"); // 动作名称, 动作组
        } catch (e) {
            alert("未找到动作 test/选中上半身，请检查动作是否存在");
            return;
        }

        // 再次检查是否有选区
        try {
            var bounds = doc.selection.bounds;
        } catch (e) {
            alert("没有有效的选区，请先运行动作生成选区");
            return;
        }
    }

    // Step 2: 选区水平中心
    var xLeft = bounds[0].as("px");
    var xRight = bounds[2].as("px");
    var xCenter = (xLeft + xRight) / 2;

    // Step 3: 画布水平中心
    var docCenter = doc.width.as("px") / 2;

    // Step 4: 平移量
    var shiftX = docCenter - xCenter;

    // Step 5: 移动图层
    layer.translate(shiftX, 0);

    // 取消选区
    doc.selection.deselect();

    // alert("水平居中完成 ✅");
}

// 执行函数
characterHorizontalAlign();
