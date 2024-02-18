let _score = 0;

export function getScore() {
  return _score;
}

export function setScore(score: number) {
  _score = score;
  document.getElementById('score').innerHTML = 'Score: ' + _score;
}