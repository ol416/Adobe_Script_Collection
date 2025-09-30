// =======================================================
// Photoshop ExtendScript: 顶对齐脚本（带顶部偏移）
// 使用 Action "test/帽子或者头发" 生成选区，
// 再将图层顶端对齐到画布顶部，允许一定程度的顶部偏移
// =======================================================

<javascriptresource>
<name>2.垂直对齐</name>
<category>Character_crop</category>
</javascriptresource>

(function () {
    if (!app.documents.length) {
        alert("请先打开一个文档并选择图层");
        return;
    }

    var doc = app.activeDocument;
    var layer = doc.activeLayer;

    // 配置顶部偏移量（像素），可以根据需要调整
    var topOffset = 5; // 从画布顶部偏移50像素，可修改此值

    // Step 1: 播放动作 "test/帽子或者头发"
    try {
        app.doAction("帽子或者头发", "test"); // 动作名称, 动作组
    } catch (e) {
        alert("未找到动作 test/帽子或者头发，请检查动作是否存在");
        return;
    }

    // Step 2: 获取选区边界
    if (!doc.selection) {
        alert("未生成有效选区");
        return;
    }

    var bounds = doc.selection.bounds;
    // bounds = [left, top, right, bottom]
    var yMin = bounds[1].as("px");

    // Step 3: 计算需要移动的距离（考虑顶部偏移）
    var shiftY = -yMin + topOffset; // 将选区上边缘移动到 topOffset 位置

    // Step 4: 移动图层
    layer.translate(0, shiftY);

    // 取消选区
    doc.selection.deselect();

})();
