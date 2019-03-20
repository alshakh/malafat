const UiJsTree = require("ui-tree")
//const fileicons = require("file-icons")

const colors = {
    green : "#51cf66",
    blue : "#339af0",
    red : "#ff6b6b",
    orange : "#ff922b",
    darkgreen : "#20c997",
    purple : "#845ef7",
    pink : "#f06595",
}

function getIconClass(extension, isdir) {
    if ( isdir ) {
        switch( extension ){
            case "git":
                return "fas fa-code-branch"
            default:
                return "fas fa-folder-open"
        }
    } else {
        switch ( extension) {
            case "pdf" :
                return "fas fa-file-pdf"
            case "md":
                return "fas fa-book"
            case "txt":
            case "gitignore":
                return "fas fa-file-alt"
            case "js":
            case "json":
            case "css":
            case "py":
            case "sh":
            case "bash":
            case "html":
            case "c":
            case "cxx":
                return "fas fa-file-code"
            case "zip":
            case "z":
            case "tar":
            case "gz":
            case "rar":
            case "xz":
                return "fas fa-file-archive"
            default:
                return "fas fa-file"
        }
    }
}
function getIconColor(extension) {
    extension = extension || '9' // just any random text if undefined

    // predefined
    switch ( extension) {
        case "pdf":
            return colors.red

        default:
            let hash = 0;
            for (let i = 0; i < extension.length; i++) {
                hash += Math.pow(extension.charCodeAt(i) * 31, extension.length - i);
                hash = hash & hash; // Convert to 32bit integer
            }
            return  Object.values(colors)[Math.abs(hash) % Object.values(colors).length]
    }
}


module.exports = class   {
    constructor(element,onFileSelectFn) {
        this.element = element

        let options = {
            initialLevel: 3,
            onSelect: (nodeData, el) => {
                onFileSelectFn(nodeData.path)
            },
            nodeRenderFn: (data, el) => {
                console.log(data)
                let filename = data.title
                let span = document.createElement('span')

                let ext = undefined
                if ( data.name.lastIndexOf('.') !== -1 ) {
                    ext = data.name.substr(data.name.lastIndexOf('.') + 1);
                }

                let icon = document.createElement('i')
                icon.setAttribute('class', getIconClass(ext, data.kind === 'dir'))
                icon.setAttribute('style', "color : "+getIconColor(ext))
                span.appendChild(icon)
                span.appendChild(document.createTextNode(' ' + filename))
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
