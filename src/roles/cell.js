define([
    'src/utility'
], function (
    util
) {

    var baseEnergyDrain, energyTransferFactor, specializations;

    baseEnergyDrain = 0.02;
    energyTransferFactor = 0.1;

    specializations = {
        // efficiency of passing energy and material to adjacent cells
        transmission: {
            energyCoeff: 1,
            impedes: ['sensation', 'locomotion']
        },
        // efficiency at absorbing material from environment or adjacent cells
        collection: {
            energyCoeff: 1,
            impedes: ['sensation', 'protection']
        },
        // force applied against environment
        locomotion: {
            energyCoeff: 1,
            impedes: ['protection', 'transmission']
        },
        // range or detecting nearby objects and relaying positions to nucleus
        sensation: {
            energyCoeff: 1,
            impedes: ['transmission', 'collection']
        },
        // resilience against damage and foreign intrusions
        protection: {
            energyCoeff: 1,
            impedes: ['collection', 'locomotion']
        }
    };

    function noop() {}

    function kill() {
        this.set('isDead', true);
    }

    function getColorFromRGB(rgb) {
        var keys, result;
        keys = ['r', 'g', 'b'];
        result = '#';
        keys.forEach(function (key) {
            var hex = Math.round(255 * rgb[key] * rgb.a).toString(16);
            console.log(rgb.a, hex);
            result += (hex.length > 1 ? hex : '0' + hex);
        });
        return result;
    }

    return {
        init: function () {
            var state = this.state;
            this.network = {
                a: null,
                b: null,
                c: null,
                d: null,
                e: null,
                f: null,
                self: this
            };
            this.neighbors = [];
            this.set('energy', 1);
            Object.keys(specializations).forEach(function (key) {
                state[key] = 0.45 + 0.1 * Math.random();
            });
        },
        evaluate: function () {
            var energyDrain, self;

            self = this;
            energyDrain = baseEnergyDrain;

            Object.keys(specializations).forEach(function (spec) {
                energyDrain *= specializations[spec].energyCoeff * self.state[spec];
            });

            return function () {
                self.set('energy', Math.max(0, self.state.energy - energyDrain));
            };
        },
        getColor: function () {
            var color, state;

            state = this.state;
            color = getColorFromRGB({
                r: 0.1 + state.transmission,
                b: 0.1 + state.protection,
                g: 0.1 + state.collection,
                a: state.energy
            });

            return (state.isDead ? '#000' : color);
        },
        specialize: function (key, factor) {
            var spec, state;
            factor = factor || 0.1;
            state = this.state;
            spec = specializations[key];
            if (spec) {
                state[key] = Math.min(1, state[key] + (state[key] * factor));
                spec.impedes.forEach(function (impeded) {
                    state[impeded] = Math.max(0, state[impeded] - (state[impeded] * factor));
                });
            }
        },
        connect: function (cell, port) {
            var network, ports;
            network = this.network;

            // Find free ports
            if (!port) {
                ports = Object.keys(network).filter(function (port) {
                    return !network[port];
                });
                port = ports.length && util.selectRandom(ports);
            }

            if (port) {
                // Disconnect existing
                if (network[port]) {
                    network[port].disconnect(this);
                    this.disconnect(network[port]);
                }

                network[port] = cell;
                this.neighbors.push(cell);
            }

            return port;
        },
        disconnect: function (cell) {
            var network, port;
            network = this.network;
            this.neighbors.splice(this.neighbors.indexOf(cell), 1);
            Object.keys(network).some(function (p) {
                if (network[p] === cell) {
                    delete network[port];
                    return port = p;
                }
            });
            return port;
        },
        snap: {
            origin: {x: 0, y: 0},
            points: [
                {x: 0.9, y: 0},
                {x: 0.9, y: 0.9},
                {x: 0, y: 0.9}
            ]
        }
    };
});
