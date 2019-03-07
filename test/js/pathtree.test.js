let PrjRoot =`${require('path').dirname(require.main.filename)}/../..`;
var PathTree = require(`${PrjRoot}/js/pathtree.js`)




PathTree.pathTree(PrjRoot,PrjRoot)
    .then( r => {
        console.log(JSON.stringify(r,null,4))
    })
    .catch ( e => {
        console.error(e)
    })

