define([
    'jquery',
    'proscenium'
], function(
    $,
    Proscenium
) {

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
            var organism, player;

            player = Proscenium.actors.player
                .set('x', 2)
                .set('y', 2)
                .set('velocity', 5);

            organism = Proscenium.actor().role('organism');
            organism.nucleus.set('x', 5).set('y', 5);
            window.organism = organism;

            this.actors = [].concat(player, Proscenium.roles.cell.members);

            $(Proscenium.curtains.controls.element).show();
            $(Proscenium.curtains.input.element).show();
        },
        always: function () {
            this.actors = [].concat(Proscenium.actors.player, Proscenium.roles.cell.members);
        },
        clear: function () {
            $(Proscenium.curtains.input.element).hide();
            Proscenium.actors.player.state.isDead = false;
            $(Proscenium.curtains.controls.element).hide();
            this.actors = [];
        }
    }
});
