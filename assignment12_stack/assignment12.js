function Stack() {
  this.obj = {};
  this.length = 0;
}
Stack.prototype.push = function(x) {
  this.obj[this.length] = x;
  this.length++ ;
};
Stack.prototype.pop = function() {
  var num = this.obj[this.length - 1];
  var local = this.obj;
  this.obj = {};
  for(var i = 0; i < (this.length - 1); i++ ) {
    this.obj[i] = local[i];
  }
  // delete this.obj[this.length - 1];
  this.length-- ;
  if(this.length == -1) this.length = 0;
  return num;
};
