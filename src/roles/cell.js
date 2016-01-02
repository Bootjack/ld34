define([
    'proscenium',
    'src/utility'
], function (
    Proscenium,
    util
) {

    var baseEnergyDrain, baseEnergyStorage, inverseConnectionMap, positionedNeighborMap,
        sharedConnectionMap, specializations;


    baseEnergyDrain = 1;
    baseEnergyStorage = 2;

    specializations = {
        // efficiency of passing energy and material to adjacent cells
        transmission: {
            energyCoeff: 1,
            hueAngle: 0, // red
            impedes: ['sensation', 'locomotion']
        },
        // efficiency at absorbing material from environment or adjacent cells
        collection: {
            energyCoeff: 1,
            hueAngle: 60, // yellow
            impedes: ['sensation', 'protection']
        },
        // force applied against environment
        locomotion: {
            energyCoeff: 1,
            hueAngle: 120, // green
            impedes: ['protection', 'transmission']
        },
        // range or detecting nearby objects and relaying positions to nucleus
        sensation: {
            energyCoeff: 1,
            hueAngle: 180, // cyan
            impedes: ['transmission', 'collection']
        },
        // resilience against damage and foreign intrusions
        protection: {
            energyCoeff: 1,
            hueAngle: 240, // blue
            impedes: ['collection', 'locomotion']
        }
    };

    /**
     * The shared connection map describes the relationship between the ports of one cell relative
     * to an adjacent cell. The six ports a-f are positioned clockwise around the each cell:
     *
     *     f a
     *    e @ b
     *     d c
     *
     * When a cell refers to its neighbor at port b (cell.network.b) we may need to know that the
     * neighbor's port f connects to the same cell as the first cell's port a, which we can look up:
     *
     * sharedConnectionMap.b.f = 'a'
     */
    sharedConnectionMap = {
        a: {d: 'self', c: 'b', e: 'f'},
        b: {e: 'self', d: 'c', f: 'a'},
        c: {f: 'self', a: 'b', e: 'd'},
        d: {a: 'self', b: 'c', f: 'e'},
        e: {b: 'self', a: 'f', c: 'd'},
        f: {c: 'self', b: 'a', d: 'e'}
    };

    inverseConnectionMap = {
        a: 'd',
        b: 'e',
        c: 'f',
        d: 'a',
        e: 'b',
        f: 'c'
    };

    positionedNeighborMap = {
        a: {x: 0.5, y: -1},
        b: {x: 1, y: 0},
        c: {x: 0.5, y: 1},
        d: {x: -0.5, y: 1},
        e: {x: -1, y: 0},
        f: {x: -0.5, y: -1}
    };

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
            console.log(state);
        },
        evaluate: function (interval) {
            var energyDrain, energyRation, energySurplus, energyTransfers, freePortCount, networkSize, result, self;

            self = this;
            networkSize = Object.keys(self.network).length;
            freePortCount = self.getFreePorts().length;
            energyTransfers = [];

            // Calculate energy use
            energyDrain = 0.001 * interval * this.getEnergyDrain();

            // Calculate surplus energy distribution
            energySurplus = Math.max(0, this.state.energy - 1 - energyDrain) * this.state.transmission;
            if (freePortCount && energySurplus >= 0.2 * (networkSize - freePortCount - 1)) {
                console.log(0.2 * (networkSize - freePortCount));
                energyDrain += 1;
                result = function () {
                    self.drain(energyDrain);
                    self.spawn();
                }
            } else if (energySurplus > 0) {
                energyRation = 0.001 * interval * energySurplus / this.neighbors.length;
                energyTransfers = [].concat(this.neighbors).sort(function (a, b) {
                    return b.state.collection - a.state.collection;
                }).map(function (neighbor, i) {
                    return {
                        cell: neighbor,
                        ration: energyRation * neighbor.state.collection
                    };
                });
                result = function () {
                    self.drain(energyDrain);
                    energyTransfers.forEach(function (transfer) {
                        transfer.cell.energize(transfer.ration);
                        self.drain(transfer.ration);
                    });
                };
            } else {
                result = function () {
                    self.drain(energyDrain);
                }
            }

            return result;
        },
        getColor: function () {
            var backup, color, focus, specs, state;

            state = this.state;
            specs = Object.keys(specializations).map(function (spec) {
                return {name: spec, value: state[spec], hue: specializations[spec].hueAngle};
            }).sort(function (a, b) {
                return b.value - a.value;
            });

            focus = specs.pop();
            backup = specs.pop();

            color = Snap.hsl(
                0.5 * (focus.hue + backup.hue),
                50 + 25 * (focus.value + backup.value),
                10 + 70 * Math.max(0, Math.min(1, state.energy))
            );

            return color;
        },
        getEnergyCapacity: function () {
            var collectionFactor = (1 + this.state.collection) * (1 + this.state.collection);
            return baseEnergyStorage * collectionFactor;
        },
        getEnergyDrain: function () {
            var energyDrain, self;

            self = this;
            energyDrain = baseEnergyDrain;

            Object.keys(specializations).forEach(function (spec) {
                energyDrain *= specializations[spec].energyCoeff * self.state[spec];
            });

            return energyDrain;
        },
        getFreePorts: function () {
            var network = this.network;
            return Object.keys(network).filter(function (port) {
                return !network[port];
            });
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
        spawn: function () {
            var child, position, port, self;

            self = this;
            child = Proscenium.actor().role(['entity', 'cell']);
            child.organism = self.organism;
            self.organism.addCell(child);

            port = self.connect(child);
            position = positionedNeighborMap[port];
            child.set('x', self.state.x + position.x)
                .set('y', self.state.y + position.y);

            // Find shared connections and connect each to the new child cell
            Object.keys(sharedConnectionMap[port]).forEach(function (p) {
                var cell, relativePort;
                relativePort = sharedConnectionMap[port][p];
                cell = self.network[relativePort];
                if (cell) {
                    child.connect(cell, p);
                    cell.connect(child, inverseConnectionMap[p]);
                }
            });
        },
        energize: function (amount) {
            var energyCapacity = this.getEnergyCapacity();
            amount += this.state.energy;
            this.set('energy', Math.min(amount, energyCapacity));
        },
        drain: function (amount) {
            this.energize(-1 * amount);
        },
        connect: function (cell, port) {
            var network, ports;
            network = this.network;

            // Find free ports
            if (!port) {
                ports = this.getFreePorts();
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
