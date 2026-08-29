# 🥋 AS Porcelette Arts Martiaux — Front-End

![Vue.js](https://img.shields.io/badge/Vue.js-42B883?style=for-the-badge\&logo=vuedotjs\&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge\&logo=javascript\&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge\&logo=vite\&logoColor=white)
![Vue Router](https://img.shields.io/badge/Vue%20Router-42B883?style=for-the-badge\&logo=vuedotjs\&logoColor=white)
![Pinia](https://img.shields.io/badge/Pinia-FFD859?style=for-the-badge\&logo=vue.js\&logoColor=black)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge\&logo=axios\&logoColor=white)
![PrimeVue](https://img.shields.io/badge/PrimeVue-10B981?style=for-the-badge\&logo=primevue\&logoColor=white)
![PrimeIcons](https://img.shields.io/badge/PrimeIcons-10B981?style=for-the-badge\&logo=primevue\&logoColor=white)
![PrimeFlex](https://img.shields.io/badge/PrimeFlex-10B981?style=for-the-badge\&logo=primevue\&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge\&logo=bootstrap\&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge\&logo=chartdotjs\&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge\&logo=greensock\&logoColor=black)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge\&logo=github\&logoColor=white)

[![Site en ligne](https://img.shields.io/badge/🌐%20Site%20en%20ligne-asporcelette--art--martiaux.fr-success?style=for-the-badge)](https://asporcelette-art-martiaux.fr/)

Interface front-end développée avec **Vue.js 3** pour l'application web de gestion de l'association **AS Porcelette Arts Martiaux**.

Le front-end communique avec une **API REST ASP.NET Core sécurisée** et propose une interface adaptée aux différents profils utilisateurs de l'association.

---

## 🌐 Démonstration

Le site est accessible en ligne :

[**https://asporcelette-art-martiaux.fr/**](https://asporcelette-art-martiaux.fr/)

---

## 🚀 Fonctionnalités

### 🌐 Site public

* Présentation de l'association
* Présentation des disciplines :

  * Judo
  * Aïkido
  * Ju-jitsu
  * Judo Détente
* Présentation des enseignants
* Affichage des actualités
* Affichage des événements
* Informations pratiques et horaires
* Interface responsive
* Navigation avec Vue Router

### 👤 Espace adhérent

* Authentification sécurisée
* Gestion du profil adhérent
* Consultation des informations personnelles
* Gestion des informations liées à l'adhésion
* Suivi du certificat médical
* Affichage de la date du certificat médical
* Calcul et affichage de la date d'expiration du certificat médical
* Gestion de la date de renouvellement
* Interface adaptée aux utilisateurs connectés

### 🛡️ Administration

* Tableau de bord administrateur
* Gestion des adhérents
* Ajout d'un adhérent
* Consultation et modification des informations adhérents
* Gestion des disciplines
* Gestion des rôles utilisateurs
* Gestion des renouvellements
* Suivi des certificats médicaux
* Gestion des dates de certificat médical
* Calcul de la date d'expiration du certificat
* Suivi de la date de rappel du certificat
* Gestion des photos de profil
* Affichage de statistiques
* Graphiques d'évolution des inscriptions
* Statistiques par discipline
* Compteurs dynamiques
* Interface d'administration basée sur des composants réutilisables

### 💰 Comptabilité

* Gestion des données comptables de l'association
* Suivi des dépenses
* Gestion des informations financières par saison
* Organisation des données selon la saison sportive

### 🔐 Sécurité et gestion des accès

* Authentification par **JWT**
* Gestion des rôles
* Protection des routes
* Redirection selon le profil utilisateur
* Gestion des accès administrateur
* Page **403 — Accès interdit**
* Page **404 — Page introuvable**
* Gestion des utilisateurs authentifiés avec Pinia

Les principaux profils utilisateurs sont :

* **Administrateur**
* **Sensei**
* **Adhérent**
* **Comptable**

---

## 📅 Gestion des saisons sportives

L'application prend en compte le fonctionnement saisonnier de l'association.

Une saison sportive est organisée du :

**1er septembre → 30 juin**

Exemple :

**Saison 2026-2027 : 01/09/2026 → 30/06/2027**

Les données liées aux adhésions et aux renouvellements sont ainsi pensées pour fonctionner selon les saisons sportives de l'association.

---

## 🩺 Gestion des certificats médicaux

Le système permet de suivre la validité des certificats médicaux des adhérents.

Les informations gérées comprennent notamment :

* Certificat médical fourni ou non
* Date du certificat
* Date d'expiration
* Date de rappel

La durée de validité actuellement utilisée dans l'application est de **3 ans**.

La date d'expiration est calculée automatiquement à partir de la date du certificat médical.

---

## 🛠️ Technologies

### Front-end

* **Vue.js 3**
* **JavaScript ES6+**
* **Vite**
* **Vue Router**
* **Pinia**
* **Axios**
* **GSAP**

### Interface utilisateur

* **PrimeVue**
* **PrimeIcons**
* **PrimeFlex**
* **Bootstrap**
* CSS personnalisé

### Visualisation des données

* **vue-chart-3**
* **Chart.js**
* **vue-countup-v3**

### Développement

* Git
* GitHub
* Visual Studio Code
* Vue DevTools
