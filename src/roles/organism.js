define([
    'src/utility',
    'proscenium'
], function (
    util,
    Proscenium
) {

    var inverseConnectionMap, maxNeighbors, positionedNeighborMap, sharedConnectionMap;

    maxNeighbors = 6;

    /**
     * The shared connection map describes the relationship between the ports of one cell relative
     * to an adjacent cell. The six ports a-f are positioned clockwise around the each cell:
     *
     *     f a
     *    e @ b
     *     d c
     *
     * When a cell refers to its neighbor at port b (cell.network.b) we may need to know that the
     * neighbor's port f connects to the same cell as the first cell's port a, which we can look up:
     *
     * sharedConnectionMap.b.f = 'a'
     */
    sharedConnectionMap = {
        a: {d: 'self', c: 'b', e: 'f'},
        b: {e: 'self', d: 'c', f: 'a'},
        c: {f: 'self', a: 'b', e: 'd'},
        d: {a: 'self', b: 'c', f: 'e'},
        e: {b: 'self', a: 'f', c: 'd'},
        f: {c: 'self', b: 'a', d: 'e'}
    };

    inverseConnectionMap = {
        a: 'd',
        b: 'e',
        c: 'f',
        d: 'a',
        e: 'b',
        f: 'c'
    };

    positionedNeighborMap = {
        a: {x: 0.5, y: -1},
        b: {x: 1, y: 0},
        c: {x: 0.5, y: 1},
        d: {x: -0.5, y: 1},
        e: {x: -1, y: 0},
        f: {x: -0.5, y: -1}
    };

    return {
        init: function () {
            this.cells = [];
            this.nucleus = Proscenium.actor().role(['entity', 'cell', 'nucleus']);
        },
        grow: function () {
            var candidates, child, mother, position, port;

            child = Proscenium.actor().role(['entity', 'cell']);

            // Find a cell in the organism with at least one free port and connect the child there
            candidates = this.cells.concat(this.nucleus).filter(function (cell) {
                return Object.keys(cell.network).some(function (p) {
                    return !cell.network[p];
                });
            });
            mother = util.selectRandom(candidates);
            port = mother.connect(child);
            position = positionedNeighborMap[port];
            child.set('x', mother.state.x + position.x)
                .set('y', mother.state.y + position.y);

            console.log(mother, port, child);

            this.cells.push(child);

            // Find shared connections and connect each to the new child cell
            Object.keys(sharedConnectionMap[port]).forEach(function (p) {
                var cell, relativePort;
                relativePort = sharedConnectionMap[port][p];
                cell = mother.network[relativePort];
                if (cell) {
                    child.connect(cell, p);
                    cell.connect(child, inverseConnectionMap[p]);
                }
            });
        }
    }
});
