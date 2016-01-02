define([], function () {

    return {
        init: function () {
            var state = this.state;
            state.energy = 3;
            state.transmission = 1;
            state.collection = 0;
            state.locomotion = 0;
            state.protection = 1;
            state.sensation = 0;
            console.log(state);
        },
        getColor: function () {
            return '#ff00ff';
        },
        getEnergyCapacity: function () {
            return 12;
        },
        getEnergyDrain: function () {
            return -0.8
        }
    }
});
