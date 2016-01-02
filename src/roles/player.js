define([], function () {
    var batAcceleration = 100,
        batFlapDuration = 50,
        batFlapCooldown = 100;

    return {
        init: function () {
            this.state.x = 0;
            this.state.y = 0;
            this.state.velocity = 0;
            this.state.acceleration = 0;
            this.state.flapDuration = 0;
            this.state.flapCooldown = 0;
            this.state.action = 'idle';
        },
        evaluate: function (interval) {
            var flapDuration, handler;

            flapDuration = this.state.flapDuration;
            handler = flapDuration > 0 ? function () {} : this.set.bind(this, 'acceleration', 0);

            this.set('flapDuration', flapDuration - interval);
            this.set('flapCooldown', this.state.flapCooldown - interval);

            return handler;
        },
        flap: function () {
            if (this.state.flapCooldown < 0) {
                this.set('flapDuration', batFlapDuration);
                this.set('flapCooldown', batFlapCooldown);
                this.set('acceleration', batAcceleration);
            }
        },
        snap: {
            origin: {x: -0.2, y: 0},
            points: [
                {x: -0.8, y: -0.6},
                {x: -0.8, y: -0.8},
                {x: 0.5, y: -0.8},
                {x: 0.8, y: 0},
                {x: 0.5, y: 0.8},
                {x: 0.8, y: 0.8},
                {x: -0.8, y: 0.8},
                {x: -0.8, y: 0.6},
                {x: -0.2, y: 0}
            ]
        }
    };
});
