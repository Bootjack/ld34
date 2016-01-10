define([
    'jquery',
    'proscenium'
], function (
    $,
    Proscenium
) {

    function round(num) {
        return Math.round(10 * num) / 10;
    }

    function winButtonClickHandler() {
        Proscenium.actors.player.state.isDead = true;
    }

    return {
        element: 'controls-curtain',
        init: function () {
            var $element = $(this.element);

            $element.on('click', 'button.win', winButtonClickHandler.bind(this));
            Proscenium.actors.player.on('update', this.render, this);
        },
        render: function () {
            var $organismStats, $playerStats, $cellStats, organism, targetCell, text;

            organism = Proscenium.actors.organism;
            if (organism && organism.nucleus) {
                text = 'Nucleus energy: $energy'
                    .replace('$energy', round(organism.nucleus.state.energy));

                $organismStats = $(this.element).find('.organism-stats');
                $organismStats.text(text);
            }

            text = 'Player $action'
                .replace('$action', Proscenium.actors.player.state.action);
            $playerStats = $(this.element).find('.player-stats');
            $playerStats.text(text);

            if( targetCell = Proscenium.actors.player.state.targetCell ){
                $cellStats = $(this.element).find('.cell-stats');
                $cellStats.find('.energy').text( round(targetCell.state.energy) );
                $cellStats.find('.transmission').text( round(targetCell.state.transmission) );
                $cellStats.find('.collection').text( round(targetCell.state.collection) );
                $cellStats.find('.sensation').text( round(targetCell.state.sensation) );
                $cellStats.find('.locomotion').text( round(targetCell.state.locomotion) );
                $cellStats.find('.protection').text( round(targetCell.state.protection) );
            }

        }
    };
});
