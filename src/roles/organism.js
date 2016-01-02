define([
    'src/utility',
    'proscenium'
], function (
    util,
    Proscenium
) {

    return {
        init: function () {
            this.cells = [];
            this.nucleus = Proscenium.actor().role(['entity', 'cell', 'nucleus']);
            this.nucleus.organism = this;
        },
        addCell: function (cell) {
            this.cells.push(cell);
        }
    }
});
