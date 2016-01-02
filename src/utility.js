define([], function () {
    return {
        selectRandom: function (arr) {
            var index = Math.floor(arr.length * Math.random());
            return arr[index];
        }
    };
});
