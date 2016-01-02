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
            var $organismStats, organism, text;

            organism = Proscenium.actors.organism;
            if (organism && organism.nucleus) {
                text = 'Nucleus energy: $energy'
                    .replace('$energy', round(organism.nucleus.state.energy));

                $organismStats = $(this.element).find('.organism-stats');
                $organismStats.text(text);
            }
        }
    };
});
