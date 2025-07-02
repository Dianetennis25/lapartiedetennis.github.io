
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

function normalizeCategory(input) {
  const lower = input.toLowerCase();
  return abbrMap[lower] || (Object.values(abbrMap).map(x => x.toLowerCase()).includes(lower) ? input : null);
}

function formatQuestion(entry) {
  let text = entry.question
    .replace(/\*\*(.*?)\*\*/g, '<span class="bold">$1</span>')
    .replace(/\*(.*?)\*/g, '<span class="italic">$1</span>');
  return `<p><strong>${entry.numero}.</strong> ${text}</p>`;
}

async function fetchEntry(command) {
  const parts = command.trim().split(/\s+/);
  if (parts.length !== 2) {
    document.getElementById('result').innerHTML = '<p>Commande invalide.</p>';
    return;
  }

  const [rawCategory, rawNumber] = parts;
  const category = normalizeCategory(rawCategory);
  const number = parseInt(rawNumber);

  if (!category || isNaN(number)) {
    document.getElementById('result').innerHTML = '<p>Commande invalide.</p>';
    return;
  }

  try {
    const response = await fetch(`data/${category}.json`);
    const data = await response.json();
    const entry = data.find(item => item.numero === number);
    if (entry) {
      document.getElementById('result').innerHTML = formatQuestion(entry);
    } else {
      document.getElementById('result').innerHTML = '<p>Fiche non trouvée.</p>';
    }
  } catch {
    document.getElementById('result').innerHTML = '<p>Erreur de chargement.</p>';
  }
}

document.getElementById('command').addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    fetchEntry(this.value);
  }
});
