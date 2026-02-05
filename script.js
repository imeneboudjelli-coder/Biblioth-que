// ================= LIVRES =================

// Charger les livres depuis localStorage ou liste par défaut
//******   JSON.parse ::::: transforme le texte stocké en vrai tableau JavaScript */
let livres = JSON.parse(localStorage.getItem("livres")) || [
  //Si aucun livre n’est trouvé dans le localStorage, on utilise cette liste par défaut
  { titre: "Les Misérables", auteur: "Victor Hugo", annee: 1862 },
  { titre: "Le Petit Prince", auteur: "Antoine de Saint-Exupéry", annee: 1943 },
  { titre: "L'Étranger", auteur: "Albert Camus", annee: 1942 },
  { titre: "Alice au pays des merveilles", auteur: "Lewis Carroll", annee: 1865 },
  { titre: "1984", auteur: "George Orwell", annee: 1949 }
];

// Sauvegarder les livres
function saveLivres() {
  localStorage.setItem("livres", JSON.stringify(livres));//JSON.stringify() transforme le tableau en texte pour pouvoir le stocker.
}

// ================= AFFICHAGE LIVRES =================
function afficherLivres() {
  const table = document.getElementById("liste-livres");//recuperer tableau HTML avec son id
  if (!table) return; // Si le tableau n'existe pas on arrete la fonction 

  while (table.rows.length > 1) {
    table.deleteRow(1); //On supprime toutes les lignes du tableau sauf l’entête pour eviter d'afficher plusieurs livres.
  }

  livres.forEach((livre, index) => { //parcourir chaque livre du tableau 
    const row = table.insertRow();// inserer une ligne
    row.insertCell(0).textContent = livre.titre;
    row.insertCell(1).textContent = livre.auteur;
    row.insertCell(2).textContent = livre.annee;

    const actionCell = row.insertCell(3); // on ajoute une 4 eme colonne pour les bouttons
    actionCell.innerHTML = `
      <button onclick="emprunterLivre(${index})">Emprunter</button>
      <button onclick="supprimerLivre(${index})">Supprimer</button>
    `;
  });
}

// Ajouter un livre via formulaire
const form = document.getElementById("form-livre");
if (form) {
  form.addEventListener("submit", function(e) {
    e.preventDefault();//Empêche le rechargement de la page.

    const titre = document.getElementById("titre").value.trim(); //recuperer les valeurs e enlever les espaces inutiles 
    const auteur = document.getElementById("auteur").value.trim();
    const annee = document.getElementById("annee").value.trim();

    if (!titre || !auteur || !annee) {
      alert("Tous les champs sont obligatoires !");
      return;
    } //verifier que rien n'est vide 

    livres.push({ titre, auteur, annee });//ajouter le nouveu livre au tableau 
    saveLivres(); //sauvegarder 
    form.reset(); //vider formulaire 
    afficherLivres();//mettre a jour l'affichage
  });
}

// Supprimer un livre
function supprimerLivre(index) {
  livres.splice(index, 1); //supprimer le livre selon la position
  saveLivres();
  afficherLivres();
}

// ================= EMPRUNTS =================

// Toujours lire les emprunts depuis localStorage
function getEmprunts() {
  return JSON.parse(localStorage.getItem("emprunts")) || [
    { titre: "1984", auteur: "George Orwell", annee: 1949 }
  ];
}


function saveEmprunts(emprunts) {
  localStorage.setItem("emprunts", JSON.stringify(emprunts));
}

// Emprunter un livre depuis index.html
function emprunterLivre(index) {
  let emprunts = getEmprunts();

  emprunts.push(livres[index]);  // ajouter aux emprunts
  livres.splice(index, 1);       // retirer de la bibliothèque

  saveLivres();
  saveEmprunts(emprunts);

  alert("Livre emprunté !");
  afficherLivres();
}

// ================= AFFICHAGE EMPRUNTS =================
function afficherEmprunts() {
  const table = document.getElementById("liste-emprunts");
  if (!table) return;

  const emprunts = getEmprunts();

  // Supprimer toutes les lignes sauf l'entête
  while (table.rows.length > 1) {
    table.deleteRow(1);
  }

  emprunts.forEach((livre, index) => {
    const row = table.insertRow();
    row.insertCell(0).textContent = livre.titre;
    row.insertCell(1).textContent = livre.auteur;
    row.insertCell(2).textContent = livre.annee;

    const actionCell = row.insertCell(3);
    actionCell.innerHTML = `<button onclick="retournerLivre(${index})">Retourner</button>`;
  });
}

// Retourner un livre dans index.html
window.retournerLivre = function(index) {
  let livres = JSON.parse(localStorage.getItem("livres")) || [];
  let emprunts = getEmprunts();

  livres.push(emprunts[index]);  // remettre dans livres
  emprunts.splice(index, 1);     // retirer des emprunts

  saveLivres();
  saveEmprunts(emprunts);

  afficherLivres();
  afficherEmprunts();
}

// ================= CHARGEMENT DES PAGES =================
document.addEventListener("DOMContentLoaded", function () {
  // Lire les livres depuis localStorage
  livres = JSON.parse(localStorage.getItem("livres")) || livres;
  
  afficherLivres();
  afficherEmprunts();
});
