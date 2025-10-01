#target photoshop
<javascriptresource>
  <name>激活对象选择工具</name>
  <category>自定义工具</category>
</javascriptresource>

/**
 * 激活Photoshop的对象选择工具，并在文档左上角模拟一次点击。
 * 这将触发对象选择工具的查找程序。
 * 如果该位置没有可识别对象，可能不会创建选区，但工具的查找过程会被激活。
 */
function activateObjectSelectionFinderClick() {
    // 前提：已打开一个文档。
    var docRef = app.activeDocument;

    // 1. 激活“对象选择工具”
    var idslct = charIDToTypeID( "slct" );
        var desc1 = new ActionDescriptor();
        var idnull = charIDToTypeID( "null" );
            var ref1 = new ActionReference();
            var idmagicLassoTool = stringIDToTypeID( "magicLassoTool" );
            ref1.putClass( idmagicLassoTool );
        desc1.putReference( idnull, ref1 );
        var iddontRecord = stringIDToTypeID( "dontRecord" );
        desc1.putBoolean( iddontRecord, true );
        var idforceNotify = stringIDToTypeID( "forceNotify" );
        desc1.putBoolean( idforceNotify, true );
    executeAction( idslct, desc1, DialogModes.NO );

    // 2. 模拟在文档左上角 (0,0) 进行一次点击
    // 对象选择工具在点击时会尝试在点击位置查找对象并生成选区。
    // 如果没有找到对象，它可能不会报错，而是简单地不生成选区。

    var clickX = 0; // 文档左上角X坐标
    var clickY = 0; // 文档左上角Y坐标

    // 确保点击坐标在文档范围内
    clickX = Math.max(0, Math.min(clickX, docRef.width.as("px") - 1));
    clickY = Math.max(0, Math.min(clickY, docRef.height.as("px") - 1));

    try {
        // 这个命令是直接模拟对象选择工具进行“点击”操作时，Photoshop生成的ActionDescriptor。
        // 它不是设置“选区”，而是触发工具的“选择”行为。
        // 我在PS 2023中重新录制了一个对象选择工具在一个点点击的操作，
        // 它的命令ID和参数是这样的：
        var idslct = charIDToTypeID( "slct" ); // 再次使用 'slct'，但这次是工具的“选择动作”
            var desc2 = new ActionDescriptor();
            var idnull_target = charIDToTypeID( "null" );
                var ref2 = new ActionReference();
                var idmagicLassoTool = stringIDToTypeID( "magicLassoTool" );
                ref2.putClass( idmagicLassoTool );
            desc2.putReference( idnull_target, ref2 );
            // 'T ' (To) Point
            var idT = charIDToTypeID( "T   " );
                var desc3 = new ActionDescriptor();
                var idHrzn = charIDToTypeID( "Hrzn" );
                var idPxl = charIDToTypeID( "#Pxl" );
                desc3.putUnitDouble( idHrzn, idPxl, clickX );
                var idVrtc = charIDToTypeID( "Vrtc" );
                desc3.putUnitDouble( idVrtc, idPxl, clickY );
            var idPnt = charIDToTypeID( "Pnt " );
            desc2.putObject( idT, idPnt, desc3 );
            // 这两个布尔值通常与对象选择工具的点击操作一起出现
            var iddeepSelect = stringIDToTypeID( "deepSelect" );
            desc2.putBoolean( iddeepSelect, true );
            var idMrgd = charIDToTypeID( "Mrgd" ); // Sample All Layers
            desc2.putBoolean( idMrgd, true );

        executeAction( idslct, desc2, DialogModes.NO );

        // 验证：虽然我们不期望一定有选区，但可以尝试获取选区边界来确认是否有东西被选中。
        // 如果没有选区，docRef.selection.bounds 会抛出错误。
        // 你可以根据自己的需求决定是否需要这个检查
        try {
            var selBounds = docRef.selection.bounds;
            // 如果执行到这里，说明成功创建了选区，即使它很小或在看不到的地方
        } catch (_e) {
            // 没有选区，这是正常的，如果点击位置没有可识别的对象
        }

    } catch (e) {
        // 如果点击操作本身失败，通常意味着ActionDescriptor参数不正确或PS内部状态问题
        alert("执行对象查找点击操作失败。请确保你的Photoshop版本支持此操作。\n错误: " + e.description + " (Line " + e.line + ")");
    }
}

// ============== 运行示例 ==============
// 确保已打开一个文档
activateObjectSelectionFinderClick();
