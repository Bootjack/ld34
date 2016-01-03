define([
    'jquery',
    'proscenium',
    'jquery.mobile'
], function (
    $,
    Proscenium
) {

    function inputHandler(event) {
        Proscenium.actors.player.set('action', 'pointing at '+event.pageX+', '+event.pageY);
    }
    function keypressHandler(event) {
        Proscenium.actors.player.set('pressed key $keyname'.replace('$keyname', event.which));
    }

    return {
        // element: 'input-curtain',
        // element: Proscenium.stage.snap.snap.node, //--> undefined at time this runs
        element: 'game-container', // works but not the most appropriate element to associate
        init: function () {
            var player = Proscenium.actors.player;
            $stage = $(this.element);
            // $(document).on('keydown.inputCurtain', function (evt) {
            //     if (evt.which === 32) {
            //         //player.flap();
            //     }
            // });
            // listen for abstracted/virtualized events provided through jquery.mobile
            $stage.on({
                vmouseup: inputHandler,
                vmousedown: inputHandler,
                vmousemove: inputHandler,
                keydown: keypressHandler
            });
        },
    };
});
