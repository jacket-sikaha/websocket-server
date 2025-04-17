class name {
  b: number;
  constructor(public a: number) {}
  aa() {
    this.b = this.a;
    this.a = Math.random();
  }
}

const asd = new name(1);
console.log('123123', asd);

export default asd;

export function isJSON(str) {
  if (typeof str == 'string') {
    try {
      var obj = JSON.parse(str);
      if (typeof obj == 'object' && obj) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.log('error：' + str + '!!!' + e);
      return false;
    }
  }
}
