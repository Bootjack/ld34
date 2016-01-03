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
                $cellStats.find('.energy').text( Math.round(100*targetCell.state.energy)/100 );
                $cellStats.find('.transmission').text( Math.round(100*targetCell.state.transmission)/100 );
                $cellStats.find('.collection').text( Math.round(100*targetCell.state.collection)/100 );
                $cellStats.find('.sensation').text( Math.round(100*targetCell.state.sensation)/100 );
                $cellStats.find('.locomotion').text( Math.round(100*targetCell.state.locomotion)/100 );
                $cellStats.find('.protection').text( Math.round(100*targetCell.state.protection)/100 );
            }

        }
    };
});
