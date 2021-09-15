const path = require('path');
const { fs, log, util } = require('vortex-api');

const GAME_ID = 'hardspaceshipbreaker';
const STEAMAPP_ID = '1161580';

function findGame() {
    return util.GameStoreHelper.findByAppId([STEAMAPP_ID])
        .then(game => game.gamePath);
}

function prepareForModding(discovery) {
    fs.ensureDirAsync(path.join(discovery.path, 'BepInEx', 'plugins'));
}

function main(context) {
    context.requireExtension('modtype-bepinex');

    context.registerGame({
        id: GAME_ID,
        name: 'Hardspace: Shipbreaker',
        mergeMods: true,
        queryPath: findGame,
        supportedTools: [],
        queryModPath: () => 'BepInEx/plugins',
        logo: 'assets/logo.jpg',
        executable: () => 'Shipbreaker.exe',
        requiredFiles: [],
        setup: (discovery) => {
            context.once(() => alert(discovery.path));
            prepareForModding(discovery);
        },
        environment: {
            SteamAPPId: STEAMAPP_ID,
        },
        details: {
            steamAppId: STEAMAPP_ID,
        },
    });

    context.once(() => {
        if (context.api.ext.bepinexAddGame !== undefined) {
            context.api.ext.bepinexAddGame({ gameId: GAME_ID, autoDownloadBepInEx: true });
        }
    });

    return true;
}

exports.default = main;