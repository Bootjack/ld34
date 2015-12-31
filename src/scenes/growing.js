define([
    'jquery',
    'proscenium'
], function(
    $,
    Proscenium
) {

    function populateCells() {
        Proscenium.actor().role(['entity', 'cell'])
            .set('x', 5)
            .set('y', 5);
        Proscenium.actor().role(['entity', 'cell'])
            .set('x', 4.5)
            .set('y', 6);
        Proscenium.actor().role(['entity', 'cell'])
            .set('x', 5.5)
            .set('y', 6);
    }

    return {
        curtains: ['input', 'controls'],
        stages: ['snap', 'collision'],
        init: function () {
            var self = this;

            this.conditions.push({
                test: function () {
                    return Proscenium.actors.player.state.isDead;
                },
                run: function () {
                    self.end();
                    Proscenium.scenes.result.begin({
                        currentScene: self,
                        nextScene: Proscenium.scenes.level2
                    });
                }
            });
        },
        prep: function () {
            var player;

            player = Proscenium.actors.player
                .set('x', 2)
                .set('y', 2)
                .set('velocity', 5);

            populateCells();

            this.actors = this.actors.concat(player, Proscenium.roles.cell.members);

            $(Proscenium.curtains.controls.element).show();
            $(Proscenium.curtains.input.element).show();
        },
        clear: function () {
            $(Proscenium.curtains.input.element).hide();
            Proscenium.actors.player.state.isDead = false;
            $(Proscenium.curtains.controls.element).hide();
            this.actors = [];
        }
    }
});
