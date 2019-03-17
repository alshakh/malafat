let PrjRoot =`${require('path').dirname(require.main.filename)}/../..`;
var PathTree = require(`${PrjRoot}/js/pathtree.js`)


console.log(PrjRoot)
console.log(`${PrjRoot}/test/__sample-dir1`,`${PrjRoot}/test/__sample-dir1`)
PathTree.pathTree(`${PrjRoot}/test/__sample-dir1`,`${PrjRoot}/test/__sample-dir1`)
    .then( r => {
        console.log(JSON.stringify(r,null,4))
    })
    .catch ( e => {
        console.error(e)
    })

