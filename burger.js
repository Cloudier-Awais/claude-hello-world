const burger = document.getElementById('burger');
const disBtn = document.getElementById('disassembleBtn');
const asmBtn = document.getElementById('assembleBtn');

disBtn.addEventListener('click', () => {
  burger.classList.add('disassembled');
  disBtn.style.display = 'none';
  asmBtn.style.display = 'inline-block';
});

asmBtn.addEventListener('click', () => {
  burger.classList.remove('disassembled');
  asmBtn.style.display = 'none';
  disBtn.style.display = 'inline-block';
});
