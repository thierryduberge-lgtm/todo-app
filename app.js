const input = document.getElementById('inputTache');
const btnAjouter = document.getElementById('btnAjouter');
const liste = document.getElementById('listeTaches');
const compteur = document.getElementById('compteur');

// Récupération sécurisée des outils Firebase
const { collection, addDoc, onSnapshot, query, updateDoc, doc, deleteDoc, orderBy } = window.fdb;
const tachesCol = collection(window.db, 'taches');

// On demande les tâches triées par date de création
const q = query(tachesCol, orderBy("createdAt", "asc"));

// Écoute Live de Firestore
onSnapshot(q, (snapshot) => {
  liste.innerHTML = '';
  let totalRestantes = 0;

  snapshot.forEach((docSnap) => {
    const tache = docSnap.data();
    const id = docSnap.id;
    if (!tache.terminee) totalRestantes++;

    const li = document.createElement('li');
    if (tache.terminee) li.classList.add('terminee');

    li.innerHTML = `
      <div class="cercle"></div>
      <span>${tache.texte}</span>
      <button>✕</button>
    `;

    // Clic sur le cercle pour valider/dévalider
    li.querySelector('.cercle').onclick = () => {
      updateDoc(doc(window.db, 'taches', id), { terminee: !tache.terminee });
    };

    // Clic sur la croix pour supprimer
    li.querySelector('button').onclick = () => {
      deleteDoc(doc(window.db, 'taches', id));
    };

    liste.appendChild(li);
  });

  compteur.textContent = totalRestantes + ' tâche(s) restante(s)';
});

// Ajouter une tâche sur Firestore
btnAjouter.onclick = async () => {
  const texte = input.value.trim();
  if (!texte) return;
  
  await addDoc(tachesCol, {
    texte: texte,
    terminee: false,
    createdAt: Date.now()
  });
  input.value = '';
};

input.onkeypress = (e) => { if (e.key === 'Enter') btnAjouter.click(); };