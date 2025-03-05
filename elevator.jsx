
{
    init: function(elevators, floors) {
        var topFloor = floors.length - 1;
        var upQueue = new Set();
        var downQueue = new Set();

        for (let i = 0; i < floors.length; i++){
            var floor = floors[i];

            floor.on("up_button_pressed", function() {
                upQueue.add(i);
            });

            floor.on("down_button_pressed", function() {
                downQueue.add(i);
            });
        };

        for (let elevator of elevators){
            var queue = new Set();

            elevator.on("idle", function() {
                elevator.goToFloor(0);
                elevator.goToFloor(topFloor);
            });

            elevator.on("stopped_at_floor", function(floorNum) {
                if (floorNum === 0) {
                    elevator.goingUpIndicator(true);
                    elevator.goingDownIndicator(false);
                }
                if (floorNum === topFloor) {
                    elevator.goingUpIndicator(false);
                    elevator.goingDownIndicator(true);
                }

            })

            elevator.on("floor_button_pressed", function(floorNum) {
                queue.add(floorNum);
            });

            elevator.on("passing_floor", function(floorNum, direction) {
                if (queue.has(floorNum)){
                    elevator.destinationQueue.unshift(floorNum);
                    elevator.checkDestinationQueue();

                    queue.delete(floorNum)

                    if(direction === "up"){
                        upQueue.delete(floorNum);
                    } else if (direction === "down"){
                        downQueue.delete(floorNum);
                    }
                }

                if (upQueue.has(floorNum) && direction === "up"){
                    elevator.destinationQueue.unshift(floorNum);
                    elevator.checkDestinationQueue();

                    upQueue.delete(floorNum)

                }

                if (downQueue.has(floorNum) && direction === "down"){
                    elevator.destinationQueue.unshift(floorNum);
                    elevator.checkDestinationQueue();

                    downQueue.delete(floorNum)
                }

            });

        }

    },
        update: function(dt, elevators, floors) {
            // We normally don't need to do anything here
        }
}