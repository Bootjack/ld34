define([
    'jquery',
    'proscenium',
    'jquery.mobile'
], function (
    $,
    Proscenium
) {

    var keyInputs = {
        // assigned to the name of the key for now
        // but should be replaced by function reference for movement or action
        32: 'spacebar',
        87: 'w',
        65: 'a',
        83: 's',
        68: 'd'
    }
    function inputHandler(event) {
        Proscenium.actors.player.set('action', 'pointing at '+event.pageX+', '+event.pageY);
    }
    function keypressHandler(event) {
        Proscenium.actors.player.set('action', 'pressed key $keyname'.replace('$keyname', keyInputs[event.which]));
    }
    function teleport(event) {
        player = Proscenium.actors.player;
        offset = $stage.offset();
        // test
        event.preventDefault();
        offset = $('#game-container').offset();
        console.log(event.pageX+", "+event.pageY);
        console.log(offset);
        player.set('x', event.pageX - offset.left);
        player.set('y', event.pageY - offset.top);
        player.set('action', 'teleporting');
    }

    return {
        // element: 'input-curtain',
        // element: Proscenium.stage.snap.snap.node, //--> undefined at time this runs
        element: 'game-container', // works but not the most appropriate element to associate?
        init: function () {
            var player;
            player = Proscenium.actors.player;
            $stage = $(this.element);
            // listen for abstracted/virtualized events provided through jquery.mobile
            $stage.on({
                vmouseup: inputHandler,
                vmousedown: teleport,
                vmousemove: inputHandler,
            });
            // support keyboard control as a secondary input method
            $(document).on('keydown.inputCurtain', keypressHandler);
        },
    };
});
