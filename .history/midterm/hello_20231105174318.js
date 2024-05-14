
function Alien() {
this.numberOfLimbs = 4;
var retractableLimbs = false;
this.setNumberOfLimbs = function(numLimbs) {
this.numberOfLimbs = numLimbs;
}
this.print = function() {
console.log("Number of Limbs: " + this.numberOfLimbs);
console.log("Retractable Limbs: " + retractableLimbs);
}
}
Alien.prototype.setNumberOfLimbs = function(numLimbs) {
this.numberOfLimbs = 2*numLimbs;
}
Alien.prototype.setRetractableLimbs = function(canRetract) {
retractableLimbs = canRetract;
}
var experiment626 = new Alien();
experiment626.setNumberOfLimbs(6);
experiment626.setRetractableLimbs(true);
experiment626.print();

