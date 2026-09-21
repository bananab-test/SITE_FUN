# Question surprise

Petit site statique compatible avec **GitHub Pages**. La personne écrit d’abord
son nom, puis le bouton « Non » se déplace. Un clic sur « Oui » affiche une
confirmation et peut envoyer un courriel avec son nom et son commentaire facultatif.

## Personnaliser la question

Ouvre [script.js](./script.js) et modifie :

```js
question: "Ta nouvelle question ici",
```

Tu peux ensuite republier les fichiers sur GitHub Pages.

## Recevoir le « Oui » par courriel

GitHub Pages ne possède pas de serveur, donc il faut utiliser un service de
formulaire externe. La solution gratuite la plus simple ici est [Formspree](https://formspree.io/) :

1. Crée un compte gratuit et un nouveau formulaire.
2. Confirme l’adresse courriel qui doit recevoir les réponses.
3. Copie l’URL du formulaire (elle ressemble à `https://formspree.io/f/xxxxx`).
4. Colle-la dans `emailEndpoint` dans [script.js](./script.js).

Sans `emailEndpoint`, le site fonctionne quand même mais n’envoie pas de courriel.
Tu peux aussi renseigner `fallbackEmail` : cela ouvrira le logiciel de courriel
de la personne, mais son envoi dépendra de celle-ci.

Avant l’envoi, une fenêtre de confirmation affiche le nom, la réponse et le
commentaire qui seront transmis. Après un envoi Formspree réussi, une fenêtre
animée confirme la réussite et le bouton est désactivé. Le navigateur bloque les
nouveaux envois pendant 5 minutes depuis le même appareil. Cette protection est
côté navigateur; pour une protection anti-spam complète, conserve aussi les
protections anti-spam de Formspree. L’heure locale d’envoi est également
transmise dans le courriel au format 24 heures; l’horodatage automatique de
Formspree peut toutefois suivre le fuseau horaire de son serveur.

Un champ administrateur permet aussi de déverrouiller immédiatement le formulaire.
La valeur n’est pas écrite en clair dans le dépôt, mais elle reste récupérable dans
le JavaScript livré au navigateur. Ce mécanisme n’est donc pas une vraie sécurité.

## Publier avec GitHub Pages

1. Crée un dépôt GitHub public et téléverse `index.html`, `styles.css` et `script.js`.
2. Dans **Settings → Pages**, choisis **Deploy from a branch**, puis la branche
   `main` et le dossier `/ (root)`.
3. GitHub affichera l’adresse partageable du site après quelques instants.
