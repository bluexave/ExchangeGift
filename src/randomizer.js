class Randomizer {
  static seededRandom(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  static randomInRange(min, max, seed, exceptions = []) {
    const exceptionSet = new Set(exceptions);
    const validNumbers = [];

    for (let i = min; i <= max; i++) {
      if (!exceptionSet.has(i)) {
        validNumbers.push(i);
      }
    }

    if (validNumbers.length === 0) {
      throw new Error('No valid numbers available in range after applying exceptions');
    }

    const randomValue = this.seededRandom(seed);
    const randomIndex = Math.floor(randomValue * validNumbers.length);
    return validNumbers[randomIndex];
  }
}

module.exports = Randomizer;
