const icecream = document.getElementById('icecream');
const disBtn = document.getElementById('disassembleBtn');
const asmBtn = document.getElementById('assembleBtn');

disBtn.addEventListener('click', () => {
  icecream.classList.add('disassembled');
  disBtn.style.display = 'none';
  asmBtn.style.display = 'inline-block';
});

asmBtn.addEventListener('click', () => {
  icecream.classList.remove('disassembled');
  asmBtn.style.display = 'none';
  disBtn.style.display = 'inline-block';
});
