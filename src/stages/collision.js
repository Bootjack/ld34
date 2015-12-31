define([
    'jquery',
    'proscenium',
    'snapsvg'
], function(
    $,
    Proscenium,
    Snap
) {

    var entityIndex = 0,
        offset = {x: 0, y: 0},
        scale = 40; // pixels per meter

    function buildTranslationMatrix(point) {
        return new Snap.matrix().translate(
            scale * (point.x + offset.x),
            scale * (-1 * point.y - offset.y)
        );
    }

    return {
        evaluate: function () {
            var collision, entity, entities, entityAbsolute, entityMatrix,
                player, playerAbsolute, playerMatrix;

            player = Proscenium.actors.player;
            playerMatrix = buildTranslationMatrix(player.state);

            playerAbsolute = Snap.path.map(player.svg, playerMatrix);

            entities = Proscenium.roles.entity.members;
            entity = entities[entityIndex++] || entities[entityIndex = 0];

            entityMatrix = buildTranslationMatrix(entity.state);
            entityAbsolute = Snap.path.map(entity.svg, entityMatrix);

            collision = Snap.path.isPointInside(entityAbsolute, playerMatrix.x(player.state.x, player.state.y), playerMatrix.y(player.state.x, player.state.y));
            collision = collision || Snap.path.intersection(playerAbsolute, entityAbsolute).length;

            if (collision) {
                //Proscenium.actors.player.set('isDead', true);
            }
        }
    };
});
