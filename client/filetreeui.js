const UiJsTree = require("ui-tree")
//const fileicons = require("file-icons")


module.exports = class   {
    constructor(element,onFileSelectFn) {
        this.element = element

        let options = {
            initialLevel: 3,
            onSelect: (nodeData, el) => {
                console.log(nodeData);
            },
            nodeRenderFn: (data, el) => {
                console.log(data)
                let filename = data.title
                let span = document.createElement('span')
                span.setAttribute('class', 'file-list-item')

//                let icon = document.createElement('span')
//                icon.setAttribute('class', fileicons.getClassWithColor(filename))
//                span.appendChild(icon)
                span.appendChild(document.createTextNode(filename))
                return span
            },
        };

        this.treeui = new UiJsTree({}, element, options);
    }


    _transformFileTreeData(ftdata) {
        console.log(ftdata)

        switch (ftdata.kind) {
            case "file":
                ftdata.title = ftdata.name
                break;
            case "dir":
                ftdata.title = ftdata.name
                for (let i = 0 ; i < ftdata.children.length ; i++) {
                    this._transformFileTreeData(ftdata.children[i])
                }
                break;
        }
    }

    render(fileTreeData) {
        this._transformFileTreeData(fileTreeData)


        this.treeui.load(fileTreeData)
        this.treeui.render();
    }
}
