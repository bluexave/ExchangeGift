class Member {
  constructor(name) {
    this.name = name;
    this.index = null;
    this.baby = null;
  }

  getName() {
    return this.name;
  }

  setIndex(index) {
    this.index = index;
  }

  getIndex() {
    return this.index;
  }

  setBaby(baby) {
    this.baby = baby;
  }

  getBaby() {
    return this.baby;
  }
}

module.exports = Member;
