define([
    'jquery',
    'proscenium',
    'snapsvg'
], function(
    $,
    Proscenium,
    Snap
) {

    var offset = {x: 0, y: 0},
        scale = 40; // pixels per meter

    function buildTranslationMatrix(point) {
        return new Snap.matrix().translate(
            scale * (point.x + offset.x),
            scale * (point.y - offset.y)
        );
    }

    function buildPathString(path) {
        var result = 'M' + path.origin.x * scale + ',' + path.origin.y * scale;
        path.points.forEach(function (point) {
            result += 'L' + point.x * scale + ',' + point.y * scale;
        });
        result += 'Z';
        return result;
    }

    function buildRectanglePath(box) {
        return {
            origin: {x: 0, y: 0},
            points: [{
                x: box.width, y: 0
            }, {
                x: box.width, y: box.height
            }, {
                x: 0, y: box.height
            }]
        };
    }

    return {
        init: function () {
            this.snap = Snap('#snap-stage');
        },
        prep: function () {
            var player, snap;

            player = Proscenium.actors.player;
            snap = this.snap;

            player.svg = this.snap.path(buildPathString(player.snap));
        },
        evaluate: function () {
            var player, playerMatrix;

            player = Proscenium.actors.player;
            playerMatrix = buildTranslationMatrix(player.state);

            player.svg.transform(playerMatrix);
        },
        clear: function (scene) {
            scene.actors.forEach(function (actor) {
                if (actor.svg && 'function' === typeof actor.svg.remove) {
                    actor.svg.remove();
                }
            });
        }
    };
});
