
const abbrMap = {
  'i': 'Qui',
  'oi': 'Quoi',
  'ou': 'Où',
  'an': 'Quand',
  'ent': 'Comment',
  'ien': 'Combien',
  'as': 'As',
  'br': 'Bris'
};

function showSection(id) {
  document.getElementById('qr-section').style.display = id === 'qr' ? 'block' : 'none';
  document.getElementById('bris-section').style.display = id === 'bris' ? 'block' : 'none';
}

function normalizeCategory(input) {
  const lower = input.toLowerCase();
  return abbrMap[lower] || (Object.values(abbrMap).includes(input) ? input : null);
}

function formatQuestion(entry) {
  let text = entry.question
    .replace(/\*\*(.*?)\*\*/g, '<span class="bold">$1</span>')
    .replace(/\*(.*?)\*/g, '<span class="italic">$1</span>');
  return `<p><strong>${entry.numero}.</strong> ${text}</p>`;
}

async function fetchQR() {
  const categoryInput = document.getElementById('qr-category').value.trim();
  const numberInput = document.getElementById('qr-number').value.trim();
  const category = normalizeCategory(categoryInput);
  const resultBox = document.getElementById('qr-result');
  resultBox.innerHTML = '';

  if (!category || !numberInput) {
    resultBox.innerHTML = '<p>Catégorie ou numéro invalide.</p>';
    return;
  }

  try {
    const response = await fetch(`data/${category}.json`);
    const data = await response.json();
    const entry = data.find(item => item.numero === parseInt(numberInput));
    if (entry) {
      resultBox.innerHTML = formatQuestion(entry);
    } else {
      resultBox.innerHTML = '<p>Fiche non trouvée.</p>';
    }
  } catch {
    resultBox.innerHTML = '<p>Erreur lors du chargement.</p>';
  }
}

async function fetchBris() {
  const numberInput = document.getElementById('bris-number').value.trim();
  const resultBox = document.getElementById('bris-result');
  resultBox.innerHTML = '';

  if (!numberInput) {
    resultBox.innerHTML = '<p>Numéro invalide.</p>';
    return;
  }

  try {
    const response = await fetch(`data/Bris.json`);
    const data = await response.json();
    const entry = data.find(item => item.numero === parseInt(numberInput));
    if (entry) {
      resultBox.innerHTML = formatQuestion(entry);
    } else {
      resultBox.innerHTML = '<p>Fiche non trouvée.</p>';
    }
  } catch {
    resultBox.innerHTML = '<p>Erreur lors du chargement.</p>';
  }
}
