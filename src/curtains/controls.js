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
            var $batStats, height, text, velocity;

            height = round(Proscenium.actors.player.state.y);
            velocity = round(Proscenium.actors.player.state.velocity);

            text = 'Player height $height m. Player velocity $velocity m/s.'
                .replace('$height', height)
                .replace('$velocity', velocity);

            $batStats = $(this.element).find('.player-stats');

            $batStats.text(text);
        }
    };
});
