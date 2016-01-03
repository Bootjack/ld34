require.config({
    paths: {
        jquery: 'bower_components/jquery/dist/jquery.min',
        'jquery.mobile': 'lib/jquery.mobile',
        proscenium: 'lib/proscenium/proscenium',
        snapsvg: 'bower_components/Snap.svg/dist/snap.svg-min',
        text: 'bower_components/text/text'
    }
});

require([
    'proscenium',

    'src/stages/collision',
    'src/stages/snap',

    'src/roles/cell',
    'src/roles/nucleus',
    'src/roles/organism',
    'src/roles/player',

    'src/curtains/splash',
    'src/curtains/input',
    'src/curtains/controls',
    'src/curtains/result',

    'src/scenes/start',
    'src/scenes/growing',
    'src/scenes/result'
], function (
    Proscenium,

    collisionStage,
    snapStage,

    cellRole,
    nucleusRole,
    organismRole,
    playerRole,

    splashCurtains,
    inputCurtain,
    controlsCurtain,
    resultCurtain,

    startScene,
    growingScene,
    resultScene
) {
    Proscenium.stage('collision', collisionStage);
    Proscenium.stage('snap', snapStage);

    Proscenium.role('entity');
    Proscenium.role('cell', cellRole);
    Proscenium.role('nucleus', nucleusRole);
    Proscenium.role('organism', organismRole);

    Proscenium.role('player', playerRole);
    Proscenium.actor('player').role(['entity', 'player']);

    Proscenium.curtain('splash', splashCurtains);
    Proscenium.curtains.splash.levels = [{
        number: 1,
        scene: 'growing'
    }];

    Proscenium.curtain('input', inputCurtain);
    Proscenium.curtain('controls', controlsCurtain);
    Proscenium.curtain('result', resultCurtain);

    Proscenium.scene('start', startScene);
    Proscenium.scene('growing', growingScene);
    Proscenium.scene('result', resultScene);

    Proscenium.scenes.start.begin();

    // for debugging purposes
    window.Proscenium = Proscenium;
});
