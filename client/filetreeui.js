const UiJsTree = require("ui-tree")

module.exports = class   {
    constructor(element,onFileSelectFn) {
        this.element = element

        let options = {
            initialLevel: 3,
            /*onSelect: function(nodeData, el) {
                console.log(nodeData);
            }*/
        };

        this.treeui = new UiJsTree({}, element, options);
    }


    _transformFileTreeData(ftdata) {
        let tt = {}
        console.log(ftdata)

        switch (ftdata.kind) {
            case "file":
                tt.title = ftdata.name
                break;
            case "dir":
                tt.title = ftdata.name
                tt.children = []
                ftdata.children.foreach
                for (let i = 0 ; i < ftdata.children.length ; i++) {
                    tt.children.push(this._transformFileTreeData(ftdata.children[i]))
                }
                break;
        }
        return tt
    }

    render(fileTreeData) {
        let transformed = this._transformFileTreeData(fileTreeData)

        console.log(transformed)

        this.treeui.load(transformed)
        this.treeui.render();
    }
}







