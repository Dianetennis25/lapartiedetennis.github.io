
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
  return abbrMap[lower] || (Object.values(abbrMap).find(x => x.toLowerCase() === lower) || null);
}

function formatQuestion(entry) {
  let text = entry.question
    .replace(/\*\*(.*?)\*\*/g, '<span class="bold">$1</span>')
    .replace(/\*(.*?)\*\*/g, '*$1**')  // sécurité
    .replace(/\*(.*?)\*/g, '<span class="italic">$1</span>');
  return `<p>${entry.numero}. ${text}</p>`;
}

async function fetchEntry(command, type) {
  const resultBox = document.getElementById(type === 'qr' ? 'qr-result' : 'bris-result');
  const parts = command.trim().split(/\s+/);
  if (parts.length !== 2) {
    resultBox.innerHTML = '<p>Commande invalide.</p>';
    return;
  }

  const [rawCategory, rawNumber] = parts;
  const category = normalizeCategory(rawCategory);
  const number = parseInt(rawNumber);

  if (!category || isNaN(number)) {
    resultBox.innerHTML = '<p>Commande invalide.</p>';
    return;
  }

  try {
    const response = await fetch(`data/${category}.json`);
    const data = await response.json();
    const entry = data.find(item => item.numero === number);
    if (entry) {
      resultBox.innerHTML = formatQuestion(entry);
    } else {
      resultBox.innerHTML = '<p>Fiche non trouvée.</p>';
    }
  } catch {
    resultBox.innerHTML = '<p>Erreur de chargement.</p>';
  }
}

document.getElementById('qr-command').addEventListener('keydown', function(event) {
  if (event.key === 'Enter') fetchEntry(this.value, 'qr');
});
document.getElementById('bris-command').addEventListener('keydown', function(event) {
  if (event.key === 'Enter') fetchEntry(this.value, 'bris');
});
