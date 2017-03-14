/**
 * A custom-progress animation.
 * @param stage
 * @constructor
 * @extends Animation
 */
function CustomAnimation(stage) {
    Animation.call(this, stage);
}

Utils.extendClass(CustomAnimation, Animation);
