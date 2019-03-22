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
    if ( extension ) {
        extension = extension.toLowerCase()
    }
    //
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
            case "jpg":
            case "jpeg":
            case "exif":
            case "tiff":
            case "tif":
            case "gif":
            case "bmp":
            case "png":
            case "ppm":
            case "pgm":
            case "pbm":
            case "pnm":
                return "fas fa-file-image"
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



class FileViewer {
    constructor(options){
        this.element = options.element
        this.dir = options.dir

        this.requestFileContentFn = options.requestFileContentFn // (f) => {}
        this.requestFileTreeFn = options.requestFileTreeFn // (dir) => {}
        //
        this.openfile = undefined



        //// prepare element
        this.element.setAttribute('style',"display:flex;flex-wrap:nowrap")

        let leftpane = document.createElement('div')
        this.element.appendChild(leftpane)

        let rightpane = document.createElement('div')
        leftpane.setAttribute('style',"overflow-y:scroll")
        rightpane.setAttribute('style',"width:100%; margin-left:20px")
        let filetextEl = document.createElement("TEXTAREA")
        this.contentTextAreaElement = filetextEl
        filetextEl.setAttribute("readonly","true")
        filetextEl.setAttribute("style","width:100%; height:100%" )
        rightpane.appendChild(filetextEl)
        this.element.appendChild(rightpane)


        //
        //

        this.filetree = new FileTree(leftpane, (fileselected) => {
            this.openfile = fileselected
            this.requestFileContentFn(fileselected)
        })
        console.log(this)
    }
    newTree(){
        this.requestFileTreeFn()
    }
    recieveFileContent(filepath,content) {
        if ( this.openfile === filepath ) {
            this.contentTextAreaElement.value = content
        }
    }
    recieveFileTree(filetree) {
        this.filetree.render(filetree) //TODO
    }
    notifyFileChanged(filepath) {
        if ( this.openfile === filepath ) {
            this.requestFileContentFn(filepath)
        }
    }
}

class FileTree  {
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

                if ( data.name.charAt(0) === '.' ) {
                    span.setAttribute("style","opacity: 0.7;")
                }

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

//
module.exports = FileViewer
