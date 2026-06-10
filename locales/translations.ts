import { Language } from '@/contexts/LanguageContext';

export const translations = {
  // Navbar
  nav: {
    home: { nl: 'Home', en: 'Home', fr: 'Accueil' },
    menu: { nl: 'Menu', en: 'Menu', fr: 'Menu' },
    contact: { nl: 'Contact', en: 'Contact', fr: 'Contact' },
  },

  // Menu tabs
  tabs: {
    all: { nl: '🍱 Alles', en: '🍱 All', fr: '🍱 Tout' },
    custom: { nl: '✨ Maak Je Bowl', en: '✨ Custom', fr: '✨ Personnalisé' },
    poke: { nl: '🐟 Poke', en: '🐟 Poke', fr: '🐟 Poke' },
    puree: { nl: '🥣 Puree', en: '🥣 Puree', fr: '🥣 Purée' },
    sides: { nl: '🥦 Bijgerechten', en: '🥦 Sides', fr: '🥦 Accompagnements' },
    drinks: { nl: '🥤 Dranken', en: '🥤 Drinks', fr: '🥤 Boissons' },
  },

  // Menu page
  menu: {
    fullMenu: { nl: 'Volledig Menu', en: 'Full Menu', fr: 'Menu Complet' },
    noItems: { nl: 'Geen items beschikbaar.', en: 'No items available.', fr: 'Aucun article disponible.' },
    order: { nl: 'Bestelling', en: 'Order', fr: 'Commande' },
    changeOrder: { nl: 'Andere bestelling?', en: 'Change order?', fr: 'Changer la commande ?' },
  },

  // Table modal
  table: {
    title: { nl: 'Hoe wil je bestellen?', en: 'How would you like to order?', fr: 'Comment souhaitez-vous commander ?' },
    subtitle: { nl: 'Kies dine in, afhaal of levering om verder te gaan.', en: 'Choose dine in, takeaway, or delivery to continue.', fr: 'Choisissez sur place, a emporter ou livraison pour continuer.' },
    dineIn: { nl: 'Dine in', en: 'Dine in', fr: 'Sur place' },
    takeaway: { nl: 'Afhaal', en: 'Afhaal', fr: 'Afhaal' },
    delivery: { nl: 'Levering', en: 'Delivery', fr: 'Livraison' },
    tableLabel: { nl: 'Tafelnummer', en: 'Table Number', fr: 'Numéro de table' },
    tablePlaceholder: { nl: 'bijv. 5', en: 'e.g. 5', fr: 'ex. 5' },
    nameLabel: { nl: 'Naam', en: 'Name', fr: 'Nom' },
    namePlaceholder: { nl: 'bijv. Sarah', en: 'e.g. Sarah', fr: 'ex. Sarah' },
    phoneLabel: { nl: 'Telefoonnummer', en: 'Phone number', fr: 'Numéro de téléphone' },
    phonePlaceholder: { nl: 'bijv. +32 4xx xx xx xx', en: 'e.g. +32 4xx xx xx xx', fr: 'ex. +32 4xx xx xx xx' },
    streetLabel: { nl: 'Straat', en: 'Street', fr: 'Rue' },
    streetPlaceholder: { nl: 'bijv. Statielei', en: 'e.g. Statielei', fr: 'ex. Statielei' },
    houseNumberLabel: { nl: 'Huisnummer', en: 'House Number', fr: 'Numero' },
    houseNumberPlaceholder: { nl: 'bijv. 25', en: 'e.g. 25', fr: 'ex. 25' },
    postalCodeLabel: { nl: 'Postcode', en: 'Postal Code', fr: 'Code Postal' },
    postalCodePlaceholder: { nl: 'bijv. 2140', en: 'e.g. 2140', fr: 'ex. 2140' },
    cityLabel: { nl: 'Stad', en: 'City', fr: 'Ville' },
    cityPlaceholder: { nl: 'bijv. Borgerhout', en: 'e.g. Borgerhout', fr: 'ex. Borgerhout' },
    addressSuggestions: { nl: 'Adres suggesties', en: 'Address suggestions', fr: 'Suggestions d\'adresse' },
    deliveryInfo: { nl: 'Gratis levering binnen 15 km vanaf Statielei 25 (enkel Antwerpen). Minimum €15.', en: 'Free delivery within 15 km from Statielei 25 (Antwerp only). Minimum €15.', fr: 'Livraison gratuite dans un rayon de 15 km de Statielei 25 (Anvers uniquement). Minimum 15€.' },
    confirmDineIn: { nl: 'Bevestig tafel', en: 'Confirm table', fr: 'Confirmer la table' },
    confirmTakeaway: { nl: 'Bevestig afhaal', en: 'Confirm takeaway', fr: 'Confirmer à emporter' },
    confirmDelivery: { nl: 'Bevestig levering', en: 'Confirm delivery', fr: 'Confirmer la livraison' },
    changeType: { nl: 'Verander type', en: 'Change type', fr: 'Changer le type' },
    error: { nl: 'Vul alle verplichte velden correct in.', en: 'Please fill in all required fields correctly.', fr: 'Veuillez remplir tous les champs obligatoires correctement.' },
    helpText: { nl: 'Heb je hulp nodig? Vraag een teamlid om ondersteuning.', en: 'Need help? Ask a team member.', fr: 'Besoin d\'aide ? Demandez à un membre de l\'équipe.' },
  },

  // Cart
  cart: {
    title: { nl: 'Jouw Bestelling', en: 'Your Order', fr: 'Votre Commande' },
    table: { nl: 'Tafel', en: 'Table', fr: 'Table' },
    takeaway: { nl: 'Afhaal', en: 'Afhaal', fr: 'Afhaal' },
    delivery: { nl: 'Levering', en: 'Delivery', fr: 'Livraison' },
    total: { nl: 'Totaal', en: 'Total', fr: 'Total' },
    perItem: { nl: 'per stuk', en: 'per item', fr: 'par article' },
    specialInstructions: { nl: 'Speciale instructies', en: 'Special instructions', fr: 'Instructions spéciales' },
    instructionsPlaceholder: { nl: 'Allergieën, extra saus, geen uien...', en: 'Allergies, extra sauce, no onions...', fr: 'Allergies, sauce supplémentaire, pas d\'oignons...' },
    placeOrder: { nl: 'Bestelling plaatsen', en: 'Place order', fr: 'Passer commande' },
    placeOrderWithTable: { nl: 'Bestelling plaatsen · Tafel', en: 'Place order · Table', fr: 'Passer commande · Table' },
    placeTakeaway: { nl: 'Afhaal bestellen', en: 'Place takeaway order', fr: 'Commander à emporter' },
    placeDelivery: { nl: 'Levering bestellen', en: 'Place delivery order', fr: 'Commander une livraison' },
    placing: { nl: 'Bestelling plaatsen…', en: 'Placing order…', fr: 'Commande en cours…' },
    scanQR: { nl: 'Scan de QR-code aan uw tafel om te bestellen.', en: 'Scan the QR code at your table to order.', fr: 'Scannez le QR code sur votre table pour commander.' },
    orderPlaced: { nl: 'Bestelling geplaatst!', en: 'Order placed!', fr: 'Commande passée!' },
    orderPlacedTakeaway: { nl: 'Afhaal besteld!', en: 'Afhaal order placed!', fr: 'Afhaal commande placee !' },
    orderPlacedDelivery: { nl: 'Levering besteld!', en: 'Delivery order placed!', fr: 'Commande en livraison passee !' },
    orderSuccess: { nl: 'uw bestelling gaat naar de keuken. 🍣', en: 'your order is on its way to the kitchen. 🍣', fr: 'votre commande est envoyée en cuisine. 🍣' },
    weWillContact: { nl: 'We nemen contact op wanneer je bestelling klaar is.', en: 'We will contact you when your order is ready.', fr: 'Nous vous contacterons quand votre commande sera prête.' },
  },

  // Bowl Builder
  builder: {
    title: { nl: 'Bouw uw eigen Pokebowl', en: 'Build Your Own Pokebowl', fr: 'Créez Votre Propre Pokebowl' },
    backToMenu: { nl: 'Terug naar menu', en: 'Back to menu', fr: 'Retour au menu' },
    summaryTitle: { nl: 'Overzicht van uw keuzes', en: 'Summary of your choices', fr: 'Résumé de vos choix' },
    step: { nl: 'Stap', en: 'Step', fr: 'Étape' },
    of: { nl: 'van', en: 'of', fr: 'de' },
    done: { nl: 'Klaar!', en: 'Done!', fr: 'Terminé!' },
    addToCart: { nl: 'Toevoegen', en: 'Add to Cart', fr: 'Ajouter' },
    back: { nl: 'Terug', en: 'Back', fr: 'Retour' },
    next: { nl: 'Volgende', en: 'Next', fr: 'Suivant' },
    summary: { nl: 'Overzicht', en: 'Summary', fr: 'Résumé' },
    edit: { nl: 'Aanpassen', en: 'Edit', fr: 'Modifier' },

    steps: {
      step1: { nl: 'STAP 1', en: 'STEP 1', fr: 'ÉTAPE 1' },
      step2: { nl: 'STAP 2', en: 'STEP 2', fr: 'ÉTAPE 2' },
      step3: { nl: 'STAP 3', en: 'STEP 3', fr: 'ÉTAPE 3' },
      step4: { nl: 'STAP 4', en: 'STEP 4', fr: 'ÉTAPE 4' },
      step5: { nl: 'STAP 5', en: 'STEP 5', fr: 'ÉTAPE 5' },
      step6: { nl: 'STAP 6', en: 'STEP 6', fr: 'ÉTAPE 6' },

      sizeTitle: { nl: 'Kies uw maat', en: 'Choose your size', fr: 'Choisissez votre taille' },
      sizeDesc: { nl: 'Medium (4 mix-ins) of Large (5 mix-ins) — extra mix-ins / toppings kosten €1 per stuk', en: 'Medium (4 mix-ins) or Large (5 mix-ins) — extra mix-ins / toppings cost €1 each', fr: 'Moyen (4 mix-ins) ou Grand (5 mix-ins) — mix-ins / toppings supplémentaires coûtent 1€ chacun' },
      mixInsIncluded: { nl: 'mix-ins inbegrepen', en: 'mix-ins included', fr: 'mix-ins inclus' },

      baseTitle: { nl: 'Kies uw basis', en: 'Choose your base', fr: 'Choisissez votre base' },
      baseDesc: { nl: 'Kies de basis voor uw bowl', en: 'Choose the base for your bowl', fr: 'Choisissez la base de votre bowl' },

      proteinTitle: { nl: 'Kies uw eiwitten', en: 'Choose your protein', fr: 'Choisissez votre protéine' },
      proteinDesc: { nl: 'Kies uw eiwitbron', en: 'Choose your protein source', fr: 'Choisissez votre source de protéines' },

      mixInsTitle: { nl: 'Kies uw mix-ins', en: 'Choose your mix-ins', fr: 'Choisissez vos mix-ins' },
      mixInsDesc: { nl: 'Kies mix-ins', en: 'Choose mix-ins', fr: 'Choisissez des mix-ins' },
      extraCost: { nl: 'extra = +€1 per stuk', en: 'extra = +€1 each', fr: 'supplément = +1€ chacun' },

      dressingTitle: { nl: 'Kies uw dressing', en: 'Choose your dressing', fr: 'Choisissez votre sauce' },
      dressingDesc: { nl: 'Kies 1 dressing', en: 'Choose 1 dressing', fr: 'Choisissez 1 sauce' },

      toppingsTitle: { nl: 'Kies uw toppings', en: 'Choose your toppings', fr: 'Choisissez vos garnitures' },
      toppingsDesc: { nl: 'Kies toppings', en: 'Choose toppings', fr: 'Choisissez des garnitures' },
      toppingsExtra: { nl: 'extra na 3 = +€1 per stuk', en: 'extra after 3 = +€1 each', fr: 'supplément après 3 = +1€ chacun' },

      noMore: { nl: 'Niets meer voor mij', en: 'No more for me', fr: 'Plus rien pour moi' },
      noMoreCancel: { nl: '✓ Niets meer — annuleer', en: '✓ No more — cancel', fr: '✓ Plus rien — annuler' },
    },

    summary: {
      priceBreakdown: { nl: 'Prijsoverzicht', en: 'Price Breakdown', fr: 'Détail des Prix' },
      baseBowl: { nl: 'Basisbowl', en: 'Base Bowl', fr: 'Bowl de base' },
      extraMixIn: { nl: 'extra mix-in', en: 'extra mix-in', fr: 'mix-in supplémentaire' },
      extraMixIns: { nl: 'extra mix-ins', en: 'extra mix-ins', fr: 'mix-ins supplémentaires' },
      extraTopping: { nl: 'extra topping', en: 'extra topping', fr: 'garniture supplémentaire' },
      extraToppings: { nl: 'extra toppings', en: 'extra toppings', fr: 'garnitures supplémentaires' },
      total: { nl: 'Totaal', en: 'Total', fr: 'Total' },

      size: { nl: 'Maat', en: 'Size', fr: 'Taille' },
      base: { nl: 'Basis', en: 'Base', fr: 'Base' },
      protein: { nl: 'Eiwit', en: 'Protein', fr: 'Protéine' },
      mixIns: { nl: 'Mix-ins', en: 'Mix-ins', fr: 'Mix-ins' },
      dressing: { nl: 'Dressing', en: 'Dressing', fr: 'Sauce' },
      toppings: { nl: 'Toppings', en: 'Toppings', fr: 'Garnitures' },
    },
  },

  // Menu Card
  card: {
    medium: { nl: 'Medium', en: 'Medium', fr: 'Moyen' },
    large: { nl: 'Large', en: 'Large', fr: 'Grand' },
    ingredients: { nl: 'Ingrediënten', en: 'Ingredients', fr: 'Ingrédients' },
  },

  // Admin
  admin: {
    title: { nl: 'Admin Paneel', en: 'Admin Panel', fr: 'Panneau Admin' },
    menu: { nl: 'Menu Beheer', en: 'Menu Management', fr: 'Gestion du Menu' },
    orders: { nl: 'Alle Bestellingen', en: 'All Orders', fr: 'Toutes les Commandes' },
    addItem: { nl: 'Nieuw Item Toevoegen', en: 'Add New Item', fr: 'Ajouter un Article' },
    save: { nl: 'Opslaan', en: 'Save', fr: 'Enregistrer' },
    cancel: { nl: 'Annuleren', en: 'Cancel', fr: 'Annuler' },
    delete: { nl: 'Verwijderen', en: 'Delete', fr: 'Supprimer' },
    edit: { nl: 'Bewerken', en: 'Edit', fr: 'Modifier' },
    available: { nl: 'Beschikbaar', en: 'Available', fr: 'Disponible' },
    unavailable: { nl: 'Niet Beschikbaar', en: 'Unavailable', fr: 'Indisponible' },
  },

  // Kitchen Display
  kitchen: {
    allClear: { nl: 'Alles klaar — geen actieve bestellingen', en: 'All clear — no active orders', fr: 'Tout est clair — aucune commande active' },
    newOrders: { nl: 'Nieuwe bestellingen verschijnen hier in real-time.', en: 'New orders will appear here in real-time.', fr: 'Les nouvelles commandes apparaîtront ici en temps réel.' },
    pending: { nl: 'In Afwachting', en: 'Pending', fr: 'En Attente' },
    preparing: { nl: 'In Voorbereiding', en: 'Preparing', fr: 'En Préparation' },
    waiting_payment: { nl: 'Wacht op Betaling', en: 'Waiting on Payment', fr: 'En Attente de Paiement' },
    completed: { nl: 'Voltooid', en: 'Completed', fr: 'Terminé' },
    cancelled: { nl: 'Geannuleerd', en: 'Cancelled', fr: 'Annulé' },
    table: { nl: 'Tafel', en: 'Table', fr: 'Table' },
    startPreparing: { nl: 'Bereiden', en: 'Start', fr: 'Démarrer' },
    markComplete: { nl: 'Klaar voor betaling', en: 'Ready for payment', fr: 'Prêt pour paiement' },
    markPaid: { nl: 'Betaald', en: 'Paid', fr: 'Payé' },
    cancelOrder: { nl: 'Annuleren', en: 'Cancel', fr: 'Annuler' },
    ago: { nl: 'geleden', en: 'ago', fr: 'il y a' },
  },

  // Common
  common: {
    loading: { nl: 'Laden...', en: 'Loading...', fr: 'Chargement...' },
    error: { nl: 'Fout', en: 'Error', fr: 'Erreur' },
    success: { nl: 'Succes', en: 'Success', fr: 'Succès' },
    close: { nl: 'Sluiten', en: 'Close', fr: 'Fermer' },
  },

  // Home page
  home: {
    badge: { nl: '🌊 Poke & Puree Bowls', en: '🌊 Poke & Puree Bowls', fr: '🌊 Bowls Poke & Purée' },
    heroTitle1: { nl: 'Versheid in', en: 'Freshness in', fr: 'Fraîcheur dans' },
    heroTitle2: { nl: 'Elke Bowl', en: 'Every Bowl', fr: 'Chaque Bowl' },
    heroSubtitle: { nl: 'Handgemaakte bowls van begin tot eind, rechtstreeks naar je tafel geleverd — vers, snel en vol smaak.', en: 'Handcrafted bowls built from scratch, delivered straight to your table while you wait — fresh, fast, and full of flavour.', fr: 'Bowls faits main de A à Z, livrés directement à votre table — frais, rapides et pleins de saveur.' },
    orderNow: { nl: 'Nu Bestellen 🍣', en: 'Order Now 🍣', fr: 'Commander Maintenant 🍣' },
    viewMenu: { nl: 'Bekijk Menu', en: 'View Menu', fr: 'Voir le Menu' },
    scrollToFeatures: { nl: 'Scroll naar functies', en: 'Scroll to features', fr: 'Défiler vers les fonctionnalités' },

    featuresTitle: { nl: 'Waarom Mula Bowls?', en: 'Why Mula Bowls?', fr: 'Pourquoi Mula Bowls?' },
    featuresSubtitle: { nl: 'We combineren tropische ingrediënten met een naadloze digitale bestelervaring voor modern dineren.', en: 'We combine tropical ingredients with a frictionless digital ordering experience built for modern dining.', fr: 'Nous combinons des ingrédients tropicaux avec une expérience de commande numérique fluide pour une restauration moderne.' },

    feature1Title: { nl: 'Altijd Vers', en: 'Always Fresh', fr: 'Toujours Frais' },
    feature1Body: { nl: 'Elk ingrediënt wordt dagelijks vers ingekocht en bereid vlak voordat je bowl wordt samengesteld.', en: 'Every ingredient is sourced daily and prepped right before your bowl is assembled.', fr: 'Chaque ingrédient est acheté quotidiennement et préparé juste avant l\'assemblage de votre bowl.' },

    feature2Title: { nl: 'Bestellen aan Tafel', en: 'Table-Side Ordering', fr: 'Commande à Table' },
    feature2Body: { nl: 'Scan de QR-code, en stel je eigen bowl samen. Deze gaat rechtstreeks naar de keuken - geen wachtrij.', en: 'Scan the QR code, and build your own bowl — it goes straight to the kitchen - no waiting in line.', fr: 'Scannez le QR code et composez votre propre bowl. Il part directement en cuisine - pas de file d\'attente.' },

    feature3Title: { nl: 'Personaliseer Alles', en: 'Customise Everything', fr: 'Personnalisez Tout' },
    feature3Body: { nl: 'Kies je basis, proteïne, toppings en saus. Jouw bowl, jouw keuze.', en: 'Pick your base, protein, toppings, and sauce. Your bowl, your way.', fr: 'Choisissez votre base, protéine, garnitures et sauce. Votre bowl, à votre façon.' },

    ctaTitle: { nl: 'Klaar om je bowl te maken?', en: 'Ready to build your bowl?', fr: 'Prêt à créer votre bowl?' },
    ctaSubtitle: { nl: 'Bestel nu', en: 'Order now', fr: 'Commandez maintenant' },
    browseMenu: { nl: 'Bekijk het Menu →', en: 'Browse the Menu →', fr: 'Parcourir le Menu →' },

    footer: { nl: '© {year} · Verse Pokebowls & More', en: '© {year} · Verse Pokebowls & More', fr: '© {year} · Verse Pokebowls & More' },
  },

  // Contact page
  contact: {
    badge: { nl: 'Neem Contact Op', en: 'Get In Touch', fr: 'Contactez-nous' },
    title: { nl: 'Contact', en: 'Contact', fr: 'Contact' },
    subtitle: { nl: 'Vragen over je bestelling of gewoon even gedag zeggen — we horen graag van je.', en: 'Questions about your order or just saying hello — we\'d love to hear from you.', fr: 'Des questions sur votre commande ou juste pour dire bonjour — nous aimerions vous entendre.' },

    findUs: { nl: 'Vind Ons', en: 'Find Us', fr: 'Nous Trouver' },
    openingHours: { nl: 'Openingsuren', en: 'Opening Hours', fr: 'Heures d\'Ouverture' },

    days: {
      monday: { nl: 'Maandag', en: 'Monday', fr: 'Lundi' },
      tuesday: { nl: 'Dinsdag', en: 'Tuesday', fr: 'Mardi' },
      wednesday: { nl: 'Woensdag', en: 'Wednesday', fr: 'Mercredi' },
      thursday: { nl: 'Donderdag', en: 'Thursday', fr: 'Jeudi' },
      friday: { nl: 'Vrijdag', en: 'Friday', fr: 'Vendredi' },
      saturday: { nl: 'Zaterdag', en: 'Saturday', fr: 'Samedi' },
      sunday: { nl: 'Zondag', en: 'Sunday', fr: 'Dimanche' },
      closed: { nl: 'Gesloten', en: 'Closed', fr: 'Fermé' },
    },

    formTitle: { nl: 'Stuur een Bericht', en: 'Send a Message', fr: 'Envoyer un Message' },
    formName: { nl: 'Naam', en: 'Name', fr: 'Nom' },
    formNamePlaceholder: { nl: 'Jouw naam', en: 'Your name', fr: 'Votre nom' },
    formEmail: { nl: 'E-mail', en: 'E-mail', fr: 'E-mail' },
    formEmailPlaceholder: { nl: 'jij@voorbeeld.com', en: 'you@example.com', fr: 'vous@exemple.com' },
    formMessage: { nl: 'Bericht', en: 'Message', fr: 'Message' },
    formMessagePlaceholder: { nl: 'Hoe kunnen we helpen?', en: 'How can we help?', fr: 'Comment pouvons-nous vous aider?' },
    formSubmit: { nl: 'Versturen', en: 'Send', fr: 'Envoyer' },

    ctaTitle: { nl: 'Liever direct bestellen?', en: 'Prefer to order directly?', fr: 'Préférez commander directement?' },
    ctaSubtitle: { nl: 'Bekijk ons menu en bestel rechtstreeks vanaf je tafel.', en: 'Check out our menu and order directly from your table.', fr: 'Consultez notre menu et commandez directement depuis votre table.' },
    ctaButton: { nl: 'Bekijk Menu →', en: 'View Menu →', fr: 'Voir le Menu →' },

    footerText: { nl: 'Statielei 25, 2140 Borgerhout', en: 'Statielei 25, 2140 Borgerhout', fr: 'Statielei 25, 2140 Borgerhout' },
  },

  // MenuCard
  menuCard: {
    add: { nl: '+ Toevoegen', en: '+ Add', fr: '+ Ajouter' },
    edit: { nl: 'Bewerken', en: 'Edit', fr: 'Modifier' },
    delete: { nl: 'Verwijderen', en: 'Delete', fr: 'Supprimer' },
    editTitle: { nl: 'Bewerken —', en: 'Edit —', fr: 'Modifier —' },
    deleteConfirm: { nl: 'verwijderen?', en: 'delete?', fr: 'supprimer?' },
    name: { nl: 'Naam', en: 'Name', fr: 'Nom' },
    price: { nl: 'Prijs (€)', en: 'Price (€)', fr: 'Prix (€)' },
    description: { nl: 'Beschrijving', en: 'Description', fr: 'Description' },
    imageUrl: { nl: 'Afbeelding URL', en: 'Image URL', fr: 'URL de l\'image' },
    ingredients: { nl: 'Ingrediënten (komma gescheiden)', en: 'Ingredients (comma separated)', fr: 'Ingrédients (séparés par des virgules)' },
    cancel: { nl: 'Annuleren', en: 'Cancel', fr: 'Annuler' },
    save: { nl: 'Opslaan', en: 'Save', fr: 'Enregistrer' },
    saving: { nl: 'Bezig…', en: 'Saving…', fr: 'Enregistrement…' },
    newBase: { nl: 'Nieuwe basis...', en: 'New base...', fr: 'Nouvelle base...' },
    newProtein: { nl: 'Nieuwe eiwit...', en: 'New protein...', fr: 'Nouvelle protéine...' },
    newMixIn: { nl: 'Nieuwe mix-in...', en: 'New mix-in...', fr: 'Nouveau mix-in...' },
    newDressing: { nl: 'Nieuwe dressing...', en: 'New dressing...', fr: 'Nouvelle sauce...' },
    newTopping: { nl: 'Nieuwe topping...', en: 'New topping...', fr: 'Nouvelle garniture...' },
    addBase: { nl: 'Basis toevoegen', en: 'Add base', fr: 'Ajouter une base' },
    addProtein: { nl: 'Eiwit toevoegen', en: 'Add protein', fr: 'Ajouter une protéine' },
    addMixIn: { nl: 'Mix-in toevoegen', en: 'Add mix-in', fr: 'Ajouter un mix-in' },
    addDressing: { nl: 'Dressing toevoegen', en: 'Add dressing', fr: 'Ajouter une sauce' },
    addTopping: { nl: 'Topping toevoegen', en: 'Add topping', fr: 'Ajouter une garniture' },
  },
};

export function t(key: string, lang: Language): string {
  const keys = key.split('.');
  let value: any = translations;

  for (const k of keys) {
    value = value?.[k];
    if (!value) return key; // fallback to key if not found
  }

  return value[lang] ?? value.nl ?? key; // fallback to Dutch, then key
}

