/* FireClient translations. One entry per language; the key is also the URL folder (/pl/, /zh-tw/ ...).
 * Shared by tools/build.mjs (Node) and admin/admin.js (browser) through lib/render.mjs.
 * To add a language: copy an entry, translate every value (keep the keys), then run
 *   node tools/i18n-check.mjs   and   node tools/build.mjs
 * See tools/TRANSLATING.md for the field list and rules.
 */
export const LOCALES = {
 "pl": {
  "code": "pl",
  "locale": "pl_PL",
  "name": "Polski",
  "title": "FireClient — darmowy launcher Minecraft dla Windows (Fabric 1.21.1)",
  "desc": "Pobierz FireClient: darmowy launcher Minecraft Java i klient Fabric 1.21.1 z przesuwanym HUD-em, menedżerem modów Modrinth i biblioteką światów. Windows 10 i 11.",
  "h1": "Pobierz FireClient na Windows",
  "home": "FireClient",
  "crumb": "Polski",
  "lede": "Darmowy launcher Minecraft Java Edition z klientem Fabric dla wersji 1.21.1, przesuwanym HUD-em, menedżerem modów Modrinth i biblioteką światów. Wczesny dostęp v1.0 dla Windows 10 i 11 (64-bit).",
  "dlh": "Pobierz wczesny dostęp.",
  "dllede": "Darmowy instalator dla Windows, v1.0. Do gry online potrzebujesz własnego konta Minecraft Java Edition.",
  "btn": "Pobierz wczesny dostęp dla Windows",
  "thanks": "Dziękujemy za pobranie FireClient. Uruchom instalator, a w razie problemów dołącz do Discorda.",
  "direct": "Bezpośredni link: FireClient-Setup.exe z GitHub Releases. Windows 10 lub 11, 64-bit.",
  "warn": "Instalator wczesnego dostępu nie jest podpisany, więc Windows może wyświetlić ostrzeżenie. Pobieraj tylko z tej strony lub z oficjalnego repozytorium GitHub.",
  "fh": "Co jest w środku",
  "feats": [
   "HUD z 11 elementami, które przesuwasz myszką (menu pod prawym Shiftem)",
   "3 motywy kolorystyczne",
   "Menedżer modów z Modrinth i własnymi plikami jar",
   "Biblioteka światów z ikoną, datą zapisu i rozmiarem",
   "Ustawienie pamięci RAM dla Javy",
   "Lokalne skiny i hostowanie serwera Paper"
  ],
  "rh": "Wymagania i ograniczenia",
  "reqs": [
   "Windows 10 lub 11, 64-bit",
   "Własne konto Minecraft Java Edition do gry online",
   "Klient w grze działa w Minecraft 1.21.1 na Fabric (Java 21)",
   "Tylko Windows. Edytor celownika i kosmetyki są planowane i jeszcze nie istnieją"
  ],
  "gh": "Przewodniki (po angielsku)",
  "guides": [
   [
    "/blog/install-fireclient-windows/",
    "Instalacja FireClient w pięciu krokach"
   ],
   [
    "/blog/is-fireclient-safe/",
    "Czy FireClient jest bezpieczny? Sprawdź pobrany plik"
   ],
   [
    "/blog/boost-fps-minecraft-1-21-1-fabric/",
    "Jak zwiększyć FPS w Minecraft 1.21.1"
   ],
   [
    "/blog/minecraft-ram-allocation-guide/",
    "Ile RAM-u dać Minecraftowi"
   ]
  ],
  "qh": "Pytania i odpowiedzi.",
  "faq": [
   [
    "Czy FireClient jest darmowy?",
    "Tak. Launcher i klient w grze są darmowe. Do gry online potrzebujesz własnego konta Minecraft Java Edition."
   ],
   [
    "Czy działa na Minecraft Bedrock, MCPE, Macu lub Linuksie?",
    "Nie. FireClient jest przeznaczony wyłącznie dla Minecraft Java Edition na Windows."
   ],
   [
    "Dlaczego Windows pokazuje ostrzeżenie?",
    "Instalator wczesnego dostępu nie jest podpisany, więc SmartScreen może wyświetlić komunikat. Pobieraj plik tylko z tej strony lub z oficjalnych wydań na GitHubie i w razie wątpliwości porównaj sumę SHA-256."
   ],
   [
    "Jaką wersję Minecrafta obsługuje klient w grze?",
    "Minecraft 1.21.1 na Fabric z Javą 21. Inne wersje można uruchomić bez moda FireClient."
   ]
  ],
  "flag": "🇵🇱",
  "suggest": "Zobacz tę stronę po polsku?",
  "share": "Udostępnij",
  "ui": {
   "nav_download": "Pobierz",
   "nav_blog": "Blog",
   "nav_faq": "Pytania",
   "nav_get": "Pobierz FireClient",
   "lang_label": "Język",
   "foot_notaff": "Brak powiązań z Mojang ani Microsoft.",
   "menu_open": "Otwórz menu nawigacji"
  }
 },
 "es": {
  "code": "es",
  "locale": "es_419",
  "name": "Español",
  "title": "FireClient — launcher gratis de Minecraft para Windows (Fabric 1.21.1)",
  "desc": "Descarga FireClient: launcher gratuito de Minecraft Java y cliente Fabric 1.21.1 con HUD movible, gestor de mods de Modrinth y biblioteca de mundos. Windows 10 y 11.",
  "h1": "Descarga FireClient para Windows",
  "home": "FireClient",
  "crumb": "Español",
  "lede": "Un launcher gratuito de Minecraft Java Edition con cliente Fabric para 1.21.1, HUD movible, gestor de mods de Modrinth y biblioteca de mundos. Acceso anticipado v1.0 para Windows 10 y 11 (64 bits).",
  "dlh": "Descarga el acceso anticipado.",
  "dllede": "Instalador gratuito para Windows, v1.0. Necesitas tu propia cuenta de Minecraft Java Edition para jugar en línea.",
  "btn": "Descargar acceso anticipado para Windows",
  "thanks": "Gracias por descargar FireClient. Ejecuta el instalador y, si necesitas ayuda, únete al Discord.",
  "direct": "Enlace directo: FireClient-Setup.exe desde GitHub Releases. Windows 10 u 11, 64 bits.",
  "warn": "El instalador de acceso anticipado no está firmado, así que Windows puede mostrar una advertencia. Descárgalo solo desde esta página o desde el repositorio oficial de GitHub.",
  "fh": "Qué incluye",
  "feats": [
   "HUD con 11 elementos que arrastras con el mouse (menú con Shift derecho)",
   "3 temas de color",
   "Gestor de mods con Modrinth y tus propios archivos jar",
   "Biblioteca de mundos con ícono, fecha de guardado y tamaño",
   "Ajuste de memoria para Java",
   "Skins locales y alojamiento de servidor Paper"
  ],
  "rh": "Requisitos y límites",
  "reqs": [
   "Windows 10 u 11, 64 bits",
   "Tu propia cuenta de Minecraft Java Edition para jugar en línea",
   "El cliente dentro del juego funciona en Minecraft 1.21.1 con Fabric (Java 21)",
   "Solo Windows. El editor de mira y los cosméticos están planificados y aún no existen"
  ],
  "gh": "Guías (en inglés)",
  "guides": [
   [
    "/blog/install-fireclient-windows/",
    "Instala FireClient en cinco pasos"
   ],
   [
    "/blog/is-fireclient-safe/",
    "¿Es seguro FireClient? Revisa tu descarga"
   ],
   [
    "/blog/boost-fps-minecraft-1-21-1-fabric/",
    "Cómo subir los FPS en Minecraft 1.21.1"
   ],
   [
    "/blog/minecraft-ram-allocation-guide/",
    "Cuánta RAM darle a Minecraft"
   ]
  ],
  "qh": "Preguntas frecuentes.",
  "faq": [
   [
    "¿FireClient es gratis?",
    "Sí. El launcher y el cliente dentro del juego son gratuitos. Necesitas tu propia cuenta de Minecraft Java Edition para jugar en línea."
   ],
   [
    "¿Funciona en Minecraft Bedrock, MCPE, Mac o Linux?",
    "No. FireClient es solo para Minecraft Java Edition en Windows."
   ],
   [
    "¿Por qué Windows muestra una advertencia?",
    "El instalador de acceso anticipado no está firmado, así que SmartScreen puede mostrar un aviso. Descarga el archivo solo desde esta página o desde las versiones oficiales de GitHub y compara el SHA-256 si quieres estar seguro."
   ],
   [
    "¿Qué versión de Minecraft admite el cliente dentro del juego?",
    "Minecraft 1.21.1 con Fabric y Java 21. Otras versiones se pueden iniciar sin el mod de FireClient."
   ]
  ],
  "flag": "🇪🇸",
  "suggest": "¿Ver esta página en español?",
  "share": "Compartir",
  "ui": {
   "nav_download": "Descargar",
   "nav_blog": "Blog",
   "nav_faq": "Preguntas",
   "nav_get": "Descargar FireClient",
   "lang_label": "Idioma",
   "foot_notaff": "No está afiliado a Mojang ni a Microsoft.",
   "menu_open": "Abrir menú de navegación"
  }
 },
 "pt": {
  "code": "pt",
  "locale": "pt_BR",
  "name": "Português",
  "flag": "🇧🇷",
  "crumb": "Português",
  "home": "FireClient",
  "suggest": "Ver esta página em português?",
  "title": "FireClient — launcher grátis de Minecraft para Windows (Fabric 1.21.1)",
  "desc": "Baixe o FireClient: launcher gratuito de Minecraft Java e cliente Fabric 1.21.1 com HUD móvel, gerenciador de mods do Modrinth e biblioteca de mundos. Windows 10 e 11.",
  "h1": "Baixe o FireClient para Windows",
  "lede": "Um launcher gratuito de Minecraft Java Edition com cliente Fabric para a 1.21.1, HUD móvel, gerenciador de mods do Modrinth e biblioteca de mundos. Acesso antecipado v1.0 para Windows 10 e 11 (64 bits).",
  "dlh": "Baixe o acesso antecipado.",
  "dllede": "Instalador gratuito para Windows, v1.0. Você precisa da sua própria conta do Minecraft Java Edition para jogar online.",
  "btn": "Baixar acesso antecipado para Windows",
  "thanks": "Obrigado por baixar o FireClient. Execute o instalador e, se precisar de ajuda, entre no Discord.",
  "direct": "Link direto: FireClient-Setup.exe no GitHub Releases. Windows 10 ou 11, 64 bits.",
  "warn": "O instalador de acesso antecipado não é assinado, então o Windows pode mostrar um aviso. Baixe apenas desta página ou do repositório oficial no GitHub.",
  "fh": "O que está incluído",
  "feats": [
   "HUD com 11 elementos que você arrasta com o mouse (menu com Shift direito)",
   "3 temas de cor",
   "Gerenciador de mods com Modrinth e seus próprios arquivos jar",
   "Biblioteca de mundos com ícone, data de salvamento e tamanho",
   "Ajuste de memória para o Java",
   "Skins locais e hospedagem de servidor Paper"
  ],
  "rh": "Requisitos e limites",
  "reqs": [
   "Windows 10 ou 11, 64 bits",
   "Sua própria conta do Minecraft Java Edition para jogar online",
   "O cliente dentro do jogo funciona no Minecraft 1.21.1 com Fabric (Java 21)",
   "Somente Windows. O editor de mira e os cosméticos estão planejados e ainda não existem"
  ],
  "gh": "Guias (em inglês)",
  "guides": [
   [
    "/blog/install-fireclient-windows/",
    "Instale o FireClient em cinco passos"
   ],
   [
    "/blog/is-fireclient-safe/",
    "O FireClient é seguro? Verifique seu download"
   ],
   [
    "/blog/boost-fps-minecraft-1-21-1-fabric/",
    "Como aumentar o FPS no Minecraft 1.21.1"
   ],
   [
    "/blog/minecraft-ram-allocation-guide/",
    "Quanta RAM dar ao Minecraft"
   ]
  ],
  "qh": "Perguntas frequentes.",
  "faq": [
   [
    "O FireClient é gratuito?",
    "Sim. O launcher e o cliente dentro do jogo são gratuitos. Você precisa da sua própria conta do Minecraft Java Edition para jogar online."
   ],
   [
    "Funciona no Minecraft Bedrock, MCPE, Mac ou Linux?",
    "Não. O FireClient é apenas para Minecraft Java Edition no Windows."
   ],
   [
    "Por que o Windows mostra um aviso?",
    "O instalador de acesso antecipado não é assinado, então o SmartScreen pode exibir um alerta. Baixe o arquivo apenas desta página ou das versões oficiais no GitHub e compare o SHA-256 se quiser ter certeza."
   ],
   [
    "Qual versão do Minecraft o cliente dentro do jogo suporta?",
    "Minecraft 1.21.1 com Fabric e Java 21. Outras versões podem ser iniciadas sem o mod do FireClient."
   ]
  ],
  "share": "Compartilhar",
  "ui": {
   "nav_download": "Baixar",
   "nav_blog": "Blog",
   "nav_faq": "Perguntas",
   "nav_get": "Baixar o FireClient",
   "lang_label": "Idioma",
   "foot_notaff": "Não é afiliado à Mojang nem à Microsoft.",
   "menu_open": "Abrir menu de navegação"
  }
 },
 "de": {
  "code": "de",
  "locale": "de_DE",
  "name": "Deutsch",
  "flag": "🇩🇪",
  "crumb": "Deutsch",
  "home": "FireClient",
  "suggest": "Diese Seite auf Deutsch ansehen?",
  "title": "FireClient — kostenloser Minecraft-Launcher für Windows",
  "desc": "FireClient herunterladen: kostenloser Minecraft-Java-Launcher und Fabric-1.21.1-Client mit verschiebbarem HUD, Modrinth-Mod-Manager und Weltenbibliothek. Windows 10 und 11.",
  "h1": "FireClient für Windows herunterladen",
  "lede": "Ein kostenloser Launcher für Minecraft Java Edition mit Fabric-Client für 1.21.1, verschiebbarem HUD, Modrinth-Mod-Manager und Weltenbibliothek. Early Access v1.0 für Windows 10 und 11 (64 Bit).",
  "dlh": "Early Access herunterladen.",
  "dllede": "Kostenloses Windows-Installationsprogramm, v1.0. Für Online-Spiele brauchst du ein eigenes Minecraft-Java-Edition-Konto.",
  "btn": "Early Access für Windows herunterladen",
  "thanks": "Danke für den Download von FireClient. Starte das Installationsprogramm und tritt bei Fragen dem Discord bei.",
  "direct": "Direktlink: FireClient-Setup.exe von GitHub Releases. Windows 10 oder 11, 64 Bit.",
  "warn": "Das Early-Access-Installationsprogramm ist nicht signiert, daher kann Windows eine Warnung anzeigen. Lade es nur von dieser Seite oder aus dem offiziellen GitHub-Repository herunter.",
  "fh": "Was enthalten ist",
  "feats": [
   "HUD mit 11 Elementen, die du mit der Maus verschiebst (Menü mit rechter Umschalttaste)",
   "3 Farbthemen",
   "Mod-Manager mit Modrinth und eigenen Jar-Dateien",
   "Weltenbibliothek mit Symbol, Speicherdatum und Größe",
   "Speichereinstellung für Java",
   "Lokale Skins und Paper-Server-Hosting"
  ],
  "rh": "Voraussetzungen und Grenzen",
  "reqs": [
   "Windows 10 oder 11, 64 Bit",
   "Ein eigenes Minecraft-Java-Edition-Konto für Online-Spiele",
   "Der Client im Spiel läuft in Minecraft 1.21.1 mit Fabric (Java 21)",
   "Nur Windows. Fadenkreuz-Editor und Kosmetik sind geplant und noch nicht gebaut"
  ],
  "gh": "Anleitungen (auf Englisch)",
  "guides": [
   [
    "/blog/install-fireclient-windows/",
    "FireClient in fünf Schritten installieren"
   ],
   [
    "/blog/is-fireclient-safe/",
    "Ist FireClient sicher? Prüfe deinen Download"
   ],
   [
    "/blog/boost-fps-minecraft-1-21-1-fabric/",
    "So steigerst du die FPS in Minecraft 1.21.1"
   ],
   [
    "/blog/minecraft-ram-allocation-guide/",
    "Wie viel RAM für Minecraft?"
   ]
  ],
  "qh": "Häufige Fragen.",
  "faq": [
   [
    "Ist FireClient kostenlos?",
    "Ja. Launcher und Client im Spiel sind kostenlos. Für Online-Spiele brauchst du ein eigenes Minecraft-Java-Edition-Konto."
   ],
   [
    "Läuft es auf Minecraft Bedrock, MCPE, Mac oder Linux?",
    "Nein. FireClient ist nur für Minecraft Java Edition unter Windows."
   ],
   [
    "Warum zeigt Windows eine Warnung?",
    "Das Early-Access-Installationsprogramm ist nicht signiert, daher kann SmartScreen eine Meldung zeigen. Lade die Datei nur von dieser Seite oder aus den offiziellen GitHub-Releases herunter und vergleiche bei Bedarf den SHA-256-Hash."
   ],
   [
    "Welche Minecraft-Version unterstützt der Client im Spiel?",
    "Minecraft 1.21.1 mit Fabric und Java 21. Andere Versionen lassen sich ohne die FireClient-Mod starten."
   ]
  ],
  "share": "Teilen",
  "ui": {
   "nav_download": "Download",
   "nav_blog": "Blog",
   "nav_faq": "Fragen",
   "nav_get": "FireClient laden",
   "lang_label": "Sprache",
   "foot_notaff": "Nicht mit Mojang oder Microsoft verbunden.",
   "menu_open": "Navigationsmenü öffnen"
  }
 },
 "fr": {
  "code": "fr",
  "locale": "fr_FR",
  "name": "Français",
  "flag": "🇫🇷",
  "crumb": "Français",
  "home": "FireClient",
  "suggest": "Voir cette page en français ?",
  "title": "FireClient — launcher Minecraft gratuit pour Windows (Fabric 1.21.1)",
  "desc": "Téléchargez FireClient : launcher Minecraft Java gratuit, client Fabric 1.21.1, HUD déplaçable, mods Modrinth et bibliothèque de mondes. Windows 10 et 11.",
  "h1": "Télécharger FireClient pour Windows",
  "lede": "Un launcher gratuit pour Minecraft Java Edition avec un client Fabric pour la 1.21.1, un HUD déplaçable, un gestionnaire de mods Modrinth et une bibliothèque de mondes. Accès anticipé v1.0 pour Windows 10 et 11 (64 bits).",
  "dlh": "Téléchargez l'accès anticipé.",
  "dllede": "Installateur Windows gratuit, v1.0. Il vous faut votre propre compte Minecraft Java Edition pour jouer en ligne.",
  "btn": "Télécharger l'accès anticipé pour Windows",
  "thanks": "Merci d'avoir téléchargé FireClient. Lancez l'installateur et rejoignez le Discord si vous avez besoin d'aide.",
  "direct": "Lien direct : FireClient-Setup.exe depuis GitHub Releases. Windows 10 ou 11, 64 bits.",
  "warn": "L'installateur de l'accès anticipé n'est pas signé, Windows peut donc afficher un avertissement. Téléchargez-le uniquement depuis cette page ou le dépôt GitHub officiel.",
  "fh": "Ce qui est inclus",
  "feats": [
   "HUD de 11 éléments que vous déplacez à la souris (menu avec Maj droite)",
   "3 thèmes de couleur",
   "Gestionnaire de mods avec Modrinth et vos propres fichiers jar",
   "Bibliothèque de mondes avec icône, date de sauvegarde et taille",
   "Réglage de la mémoire pour Java",
   "Skins locaux et hébergement de serveur Paper"
  ],
  "rh": "Configuration requise et limites",
  "reqs": [
   "Windows 10 ou 11, 64 bits",
   "Votre propre compte Minecraft Java Edition pour jouer en ligne",
   "Le client en jeu fonctionne sur Minecraft 1.21.1 avec Fabric (Java 21)",
   "Windows uniquement. L'éditeur de viseur et les cosmétiques sont prévus et pas encore développés"
  ],
  "gh": "Guides (en anglais)",
  "guides": [
   [
    "/blog/install-fireclient-windows/",
    "Installer FireClient en cinq étapes"
   ],
   [
    "/blog/is-fireclient-safe/",
    "FireClient est-il sûr ? Vérifiez votre téléchargement"
   ],
   [
    "/blog/boost-fps-minecraft-1-21-1-fabric/",
    "Comment augmenter les FPS dans Minecraft 1.21.1"
   ],
   [
    "/blog/minecraft-ram-allocation-guide/",
    "Combien de RAM donner à Minecraft"
   ]
  ],
  "qh": "Questions fréquentes.",
  "faq": [
   [
    "FireClient est-il gratuit ?",
    "Oui. Le launcher et le client en jeu sont gratuits. Il vous faut votre propre compte Minecraft Java Edition pour jouer en ligne."
   ],
   [
    "Fonctionne-t-il sur Minecraft Bedrock, MCPE, Mac ou Linux ?",
    "Non. FireClient est réservé à Minecraft Java Edition sous Windows."
   ],
   [
    "Pourquoi Windows affiche-t-il un avertissement ?",
    "L'installateur de l'accès anticipé n'est pas signé, SmartScreen peut donc afficher un message. Téléchargez le fichier uniquement depuis cette page ou les versions officielles sur GitHub, et comparez le SHA-256 si vous voulez être sûr."
   ],
   [
    "Quelle version de Minecraft le client en jeu prend-il en charge ?",
    "Minecraft 1.21.1 avec Fabric et Java 21. Les autres versions peuvent être lancées sans le mod FireClient."
   ]
  ],
  "share": "Partager",
  "ui": {
   "nav_download": "Télécharger",
   "nav_blog": "Blog",
   "nav_faq": "Questions",
   "nav_get": "Obtenir FireClient",
   "lang_label": "Langue",
   "foot_notaff": "Non affilié à Mojang ni à Microsoft.",
   "menu_open": "Ouvrir le menu de navigation"
  }
 },
 "tr": {
  "code": "tr",
  "locale": "tr_TR",
  "name": "Türkçe",
  "flag": "🇹🇷",
  "crumb": "Türkçe",
  "home": "FireClient",
  "suggest": "Bu sayfayı Türkçe görüntüle?",
  "title": "FireClient — Windows için ücretsiz Minecraft başlatıcısı",
  "desc": "FireClient'i indir: ücretsiz Minecraft Java başlatıcısı ve Fabric 1.21.1 istemcisi; taşınabilir HUD, Modrinth mod yöneticisi ve dünya kitaplığı. Windows 10 ve 11.",
  "h1": "FireClient'i Windows için indir",
  "lede": "Minecraft Java Edition için ücretsiz bir başlatıcı: 1.21.1 için Fabric istemcisi, taşınabilir HUD, Modrinth mod yöneticisi ve dünya kitaplığı. Windows 10 ve 11 (64 bit) için erken erişim v1.0.",
  "dlh": "Erken erişimi indir.",
  "dllede": "Ücretsiz Windows yükleyicisi, v1.0. Çevrimiçi oynamak için kendi Minecraft Java Edition hesabına ihtiyacın var.",
  "btn": "Windows için erken erişimi indir",
  "thanks": "FireClient'i indirdiğin için teşekkürler. Yükleyiciyi çalıştır, yardıma ihtiyacın olursa Discord'a katıl.",
  "direct": "Doğrudan bağlantı: GitHub Releases üzerinden FireClient-Setup.exe. Windows 10 veya 11, 64 bit.",
  "warn": "Erken erişim yükleyicisi imzalı değil, bu yüzden Windows bir uyarı gösterebilir. Yalnızca bu sayfadan veya resmi GitHub deposundan indir.",
  "fh": "Neler dahil",
  "feats": [
   "Fareyle taşıdığın 11 öğeli HUD (menü Sağ Shift ile açılır)",
   "3 renk teması",
   "Modrinth ve kendi jar dosyalarınla mod yöneticisi",
   "Simge, kayıt tarihi ve boyutla dünya kitaplığı",
   "Java için bellek ayarı",
   "Yerel skinler ve Paper sunucu barındırma"
  ],
  "rh": "Gereksinimler ve sınırlar",
  "reqs": [
   "Windows 10 veya 11, 64 bit",
   "Çevrimiçi oynamak için kendi Minecraft Java Edition hesabın",
   "Oyun içi istemci Fabric'li Minecraft 1.21.1'de çalışır (Java 21)",
   "Yalnızca Windows. Nişangah düzenleyici ve kozmetikler planlanıyor, henüz yapılmadı"
  ],
  "gh": "Rehberler (İngilizce)",
  "guides": [
   [
    "/blog/install-fireclient-windows/",
    "FireClient'i beş adımda kur"
   ],
   [
    "/blog/is-fireclient-safe/",
    "FireClient güvenli mi? İndirdiğin dosyayı kontrol et"
   ],
   [
    "/blog/boost-fps-minecraft-1-21-1-fabric/",
    "Minecraft 1.21.1'de FPS nasıl artırılır"
   ],
   [
    "/blog/minecraft-ram-allocation-guide/",
    "Minecraft'a ne kadar RAM verilmeli"
   ]
  ],
  "qh": "Sık sorulan sorular.",
  "faq": [
   [
    "FireClient ücretsiz mi?",
    "Evet. Başlatıcı ve oyun içi istemci ücretsizdir. Çevrimiçi oynamak için kendi Minecraft Java Edition hesabına ihtiyacın var."
   ],
   [
    "Minecraft Bedrock, MCPE, Mac veya Linux'ta çalışır mı?",
    "Hayır. FireClient yalnızca Windows'ta Minecraft Java Edition içindir."
   ],
   [
    "Windows neden uyarı gösteriyor?",
    "Erken erişim yükleyicisi imzalı değil, bu yüzden SmartScreen bir mesaj gösterebilir. Dosyayı yalnızca bu sayfadan veya resmi GitHub sürümlerinden indir, emin olmak istersen SHA-256'yı karşılaştır."
   ],
   [
    "Oyun içi istemci hangi Minecraft sürümünü destekliyor?",
    "Fabric'li Minecraft 1.21.1 ve Java 21. Diğer sürümler FireClient modu olmadan başlatılabilir."
   ]
  ],
  "share": "Paylaş",
  "ui": {
   "nav_download": "İndir",
   "nav_blog": "Blog",
   "nav_faq": "Sorular",
   "nav_get": "FireClient'i indir",
   "lang_label": "Dil",
   "foot_notaff": "Mojang veya Microsoft ile bağlantılı değildir.",
   "menu_open": "Gezinme menüsünü aç"
  }
 },
 "id": {
  "code": "id",
  "locale": "id_ID",
  "name": "Bahasa Indonesia",
  "flag": "🇮🇩",
  "crumb": "Bahasa Indonesia",
  "home": "FireClient",
  "suggest": "Lihat halaman ini dalam bahasa Indonesia?",
  "title": "FireClient — launcher Minecraft gratis untuk Windows (Fabric 1.21.1)",
  "desc": "Unduh FireClient: launcher Minecraft Java gratis dan klien Fabric 1.21.1 dengan HUD yang bisa digeser, pengelola mod Modrinth, dan pustaka dunia. Windows 10 dan 11.",
  "h1": "Unduh FireClient untuk Windows",
  "lede": "Launcher gratis untuk Minecraft Java Edition dengan klien Fabric untuk 1.21.1, HUD yang bisa digeser, pengelola mod Modrinth, dan pustaka dunia. Akses awal v1.0 untuk Windows 10 dan 11 (64-bit).",
  "dlh": "Unduh akses awal.",
  "dllede": "Penginstal Windows gratis, v1.0. Kamu membutuhkan akun Minecraft Java Edition sendiri untuk bermain online.",
  "btn": "Unduh akses awal untuk Windows",
  "thanks": "Terima kasih telah mengunduh FireClient. Jalankan penginstal dan gabung ke Discord jika butuh bantuan.",
  "direct": "Tautan langsung: FireClient-Setup.exe dari GitHub Releases. Windows 10 atau 11, 64-bit.",
  "warn": "Penginstal akses awal belum ditandatangani, jadi Windows mungkin menampilkan peringatan. Unduh hanya dari halaman ini atau repositori GitHub resmi.",
  "fh": "Yang disertakan",
  "feats": [
   "HUD dengan 11 elemen yang bisa digeser dengan mouse (menu dengan Shift kanan)",
   "3 tema warna",
   "Pengelola mod dengan Modrinth dan file jar milikmu",
   "Pustaka dunia dengan ikon, tanggal simpan, dan ukuran",
   "Pengaturan memori untuk Java",
   "Skin lokal dan hosting server Paper"
  ],
  "rh": "Persyaratan dan batasan",
  "reqs": [
   "Windows 10 atau 11, 64-bit",
   "Akun Minecraft Java Edition sendiri untuk bermain online",
   "Klien dalam game berjalan di Minecraft 1.21.1 dengan Fabric (Java 21)",
   "Hanya Windows. Editor crosshair dan kosmetik masih direncanakan dan belum dibuat"
  ],
  "gh": "Panduan (dalam bahasa Inggris)",
  "guides": [
   [
    "/blog/install-fireclient-windows/",
    "Instal FireClient dalam lima langkah"
   ],
   [
    "/blog/is-fireclient-safe/",
    "Apakah FireClient aman? Periksa unduhanmu"
   ],
   [
    "/blog/boost-fps-minecraft-1-21-1-fabric/",
    "Cara menaikkan FPS di Minecraft 1.21.1"
   ],
   [
    "/blog/minecraft-ram-allocation-guide/",
    "Berapa RAM untuk Minecraft"
   ]
  ],
  "qh": "Pertanyaan umum.",
  "faq": [
   [
    "Apakah FireClient gratis?",
    "Ya. Launcher dan klien dalam game gratis. Kamu membutuhkan akun Minecraft Java Edition sendiri untuk bermain online."
   ],
   [
    "Apakah bisa dipakai di Minecraft Bedrock, MCPE, Mac, atau Linux?",
    "Tidak. FireClient hanya untuk Minecraft Java Edition di Windows."
   ],
   [
    "Mengapa Windows menampilkan peringatan?",
    "Penginstal akses awal belum ditandatangani, jadi SmartScreen bisa menampilkan pesan. Unduh file hanya dari halaman ini atau rilis GitHub resmi, dan bandingkan SHA-256 jika ingin memastikan."
   ],
   [
    "Versi Minecraft apa yang didukung klien dalam game?",
    "Minecraft 1.21.1 dengan Fabric dan Java 21. Versi lain bisa dijalankan tanpa mod FireClient."
   ]
  ],
  "share": "Bagikan",
  "ui": {
   "nav_download": "Unduh",
   "nav_blog": "Blog",
   "nav_faq": "Pertanyaan",
   "nav_get": "Dapatkan FireClient",
   "lang_label": "Bahasa",
   "foot_notaff": "Tidak berafiliasi dengan Mojang atau Microsoft.",
   "menu_open": "Buka menu navigasi"
  }
 },
 "ur": {
  "code": "ur",
  "locale": "ur_PK",
  "name": "اردو",
  "flag": "🇵🇰",
  "crumb": "اردو",
  "home": "FireClient",
  "dir": "rtl",
  "suggest": "یہ صفحہ اردو میں دیکھیں؟",
  "title": "FireClient — ونڈوز کے لیے مفت مائن کرافٹ لانچر (Fabric 1.21.1)",
  "desc": "FireClient ڈاؤن لوڈ کریں: مفت مائن کرافٹ جاوا لانچر اور Fabric 1.21.1 کلائنٹ، منتقل ہونے والا HUD، Modrinth موڈ مینیجر اور ورلڈز لائبریری کے ساتھ۔ ونڈوز 10 اور 11۔",
  "h1": "ونڈوز کے لیے FireClient ڈاؤن لوڈ کریں",
  "lede": "مائن کرافٹ جاوا ایڈیشن کے لیے مفت لانچر، جس میں 1.21.1 کے لیے Fabric کلائنٹ، منتقل ہونے والا HUD، Modrinth موڈ مینیجر اور ورلڈز لائبریری شامل ہیں۔ ونڈوز 10 اور 11 (64 بٹ) کے لیے ابتدائی رسائی v1.0۔",
  "dlh": "ابتدائی رسائی ڈاؤن لوڈ کریں۔",
  "dllede": "ونڈوز کے لیے مفت انسٹالر، v1.0۔ آن لائن کھیلنے کے لیے آپ کو اپنا مائن کرافٹ جاوا ایڈیشن اکاؤنٹ درکار ہے۔",
  "btn": "ونڈوز کے لیے ابتدائی رسائی ڈاؤن لوڈ کریں",
  "thanks": "FireClient ڈاؤن لوڈ کرنے کا شکریہ۔ انسٹالر چلائیں، اور مدد کے لیے Discord میں شامل ہوں۔",
  "direct": "براہِ راست لنک: GitHub Releases سے FireClient-Setup.exe۔ ونڈوز 10 یا 11، 64 بٹ۔",
  "warn": "ابتدائی رسائی کا انسٹالر دستخط شدہ نہیں ہے، اس لیے ونڈوز وارننگ دکھا سکتا ہے۔ صرف اسی صفحے یا سرکاری GitHub ریپوزٹری سے ڈاؤن لوڈ کریں۔",
  "fh": "کیا شامل ہے",
  "feats": [
   "11 عناصر والا HUD جسے ماؤس سے منتقل کیا جا سکتا ہے (مینو دائیں Shift سے کھلتا ہے)",
   "3 رنگوں کے تھیمز",
   "Modrinth اور آپ کی اپنی jar فائلوں کے ساتھ موڈ مینیجر",
   "آئیکن، محفوظ کرنے کی تاریخ اور سائز کے ساتھ ورلڈز لائبریری",
   "Java کے لیے میموری کی ترتیب",
   "مقامی اسکنز اور Paper سرور ہوسٹنگ"
  ],
  "rh": "تقاضے اور حدود",
  "reqs": [
   "ونڈوز 10 یا 11، 64 بٹ",
   "آن لائن کھیلنے کے لیے اپنا مائن کرافٹ جاوا ایڈیشن اکاؤنٹ",
   "گیم کے اندر کلائنٹ Fabric کے ساتھ مائن کرافٹ 1.21.1 پر چلتا ہے (Java 21)",
   "صرف ونڈوز۔ کراس ہیئر ایڈیٹر اور کاسمیٹکس منصوبے میں ہیں اور ابھی نہیں بنے"
  ],
  "gh": "گائیڈز (انگریزی میں)",
  "guides": [
   [
    "/blog/install-fireclient-windows/",
    "FireClient پانچ مراحل میں انسٹال کریں"
   ],
   [
    "/blog/is-fireclient-safe/",
    "کیا FireClient محفوظ ہے؟ اپنا ڈاؤن لوڈ چیک کریں"
   ],
   [
    "/blog/boost-fps-minecraft-1-21-1-fabric/",
    "مائن کرافٹ 1.21.1 میں FPS کیسے بڑھائیں"
   ],
   [
    "/blog/minecraft-ram-allocation-guide/",
    "مائن کرافٹ کو کتنی RAM دیں"
   ]
  ],
  "qh": "عمومی سوالات۔",
  "faq": [
   [
    "کیا FireClient مفت ہے؟",
    "جی ہاں۔ لانچر اور گیم کے اندر کلائنٹ مفت ہیں۔ آن لائن کھیلنے کے لیے آپ کو اپنا مائن کرافٹ جاوا ایڈیشن اکاؤنٹ درکار ہے۔"
   ],
   [
    "کیا یہ Minecraft Bedrock، MCPE، میک یا لینکس پر چلتا ہے؟",
    "نہیں۔ FireClient صرف ونڈوز پر مائن کرافٹ جاوا ایڈیشن کے لیے ہے۔"
   ],
   [
    "ونڈوز وارننگ کیوں دکھاتا ہے؟",
    "ابتدائی رسائی کا انسٹالر دستخط شدہ نہیں ہے، اس لیے SmartScreen پیغام دکھا سکتا ہے۔ فائل صرف اسی صفحے یا سرکاری GitHub ریلیزز سے ڈاؤن لوڈ کریں، اور یقین کے لیے SHA-256 کا موازنہ کریں۔"
   ],
   [
    "گیم کے اندر کلائنٹ کون سا مائن کرافٹ ورژن سپورٹ کرتا ہے؟",
    "Fabric اور Java 21 کے ساتھ مائن کرافٹ 1.21.1۔ دوسرے ورژن FireClient موڈ کے بغیر چلائے جا سکتے ہیں۔"
   ]
  ],
  "share": "شیئر کریں",
  "ui": {
   "nav_download": "ڈاؤن لوڈ",
   "nav_blog": "بلاگ",
   "nav_faq": "سوالات",
   "nav_get": "FireClient حاصل کریں",
   "lang_label": "زبان",
   "foot_notaff": "Mojang یا Microsoft سے کوئی تعلق نہیں۔",
   "menu_open": "نیویگیشن مینو کھولیں"
  }
 },
 "hi": {
  "code": "hi",
  "locale": "hi_IN",
  "name": "हिन्दी",
  "flag": "🇮🇳",
  "crumb": "हिन्दी",
  "home": "FireClient",
  "suggest": "यह पेज हिन्दी में देखें?",
  "title": "FireClient — विंडोज़ के लिए मुफ़्त माइनक्राफ्ट लॉन्चर (Fabric 1.21.1)",
  "desc": "FireClient डाउनलोड करें: मुफ़्त माइनक्राफ्ट जावा लॉन्चर और Fabric 1.21.1 क्लाइंट, जिसमें खिसकाने योग्य HUD, Modrinth मॉड मैनेजर और वर्ल्ड लाइब्रेरी है। विंडोज़ 10 और 11।",
  "h1": "विंडोज़ के लिए FireClient डाउनलोड करें",
  "lede": "माइनक्राफ्ट जावा एडिशन के लिए मुफ़्त लॉन्चर, जिसमें 1.21.1 के लिए Fabric क्लाइंट, खिसकाने योग्य HUD, Modrinth मॉड मैनेजर और वर्ल्ड लाइब्रेरी शामिल है। विंडोज़ 10 और 11 (64-बिट) के लिए अर्ली एक्सेस v1.0।",
  "dlh": "अर्ली एक्सेस डाउनलोड करें।",
  "dllede": "विंडोज़ के लिए मुफ़्त इंस्टॉलर, v1.0। ऑनलाइन खेलने के लिए आपको अपना माइनक्राफ्ट जावा एडिशन अकाउंट चाहिए।",
  "btn": "विंडोज़ के लिए अर्ली एक्सेस डाउनलोड करें",
  "thanks": "FireClient डाउनलोड करने के लिए धन्यवाद। इंस्टॉलर चलाएँ, और मदद चाहिए तो Discord से जुड़ें।",
  "direct": "सीधा लिंक: GitHub Releases से FireClient-Setup.exe। विंडोज़ 10 या 11, 64-बिट।",
  "warn": "अर्ली एक्सेस इंस्टॉलर हस्ताक्षरित नहीं है, इसलिए विंडोज़ चेतावनी दिखा सकता है। केवल इसी पेज या आधिकारिक GitHub रिपॉज़िटरी से डाउनलोड करें।",
  "fh": "क्या शामिल है",
  "feats": [
   "11 तत्वों वाला HUD जिसे माउस से खिसकाया जा सकता है (मेन्यू राइट Shift से खुलता है)",
   "3 रंग थीम",
   "Modrinth और आपकी अपनी jar फ़ाइलों के साथ मॉड मैनेजर",
   "आइकन, सेव तारीख़ और साइज़ के साथ वर्ल्ड लाइब्रेरी",
   "Java के लिए मेमोरी सेटिंग",
   "लोकल स्किन और Paper सर्वर होस्टिंग"
  ],
  "rh": "ज़रूरतें और सीमाएँ",
  "reqs": [
   "विंडोज़ 10 या 11, 64-बिट",
   "ऑनलाइन खेलने के लिए अपना माइनक्राफ्ट जावा एडिशन अकाउंट",
   "गेम के अंदर का क्लाइंट Fabric के साथ माइनक्राफ्ट 1.21.1 पर चलता है (Java 21)",
   "केवल विंडोज़। क्रॉसहेयर एडिटर और कॉस्मेटिक्स योजना में हैं और अभी बने नहीं हैं"
  ],
  "gh": "गाइड (अंग्रेज़ी में)",
  "guides": [
   [
    "/blog/install-fireclient-windows/",
    "FireClient पाँच चरणों में इंस्टॉल करें"
   ],
   [
    "/blog/is-fireclient-safe/",
    "क्या FireClient सुरक्षित है? अपना डाउनलोड जाँचें"
   ],
   [
    "/blog/boost-fps-minecraft-1-21-1-fabric/",
    "माइनक्राफ्ट 1.21.1 में FPS कैसे बढ़ाएँ"
   ],
   [
    "/blog/minecraft-ram-allocation-guide/",
    "माइनक्राफ्ट को कितनी RAM दें"
   ]
  ],
  "qh": "अक्सर पूछे जाने वाले सवाल।",
  "faq": [
   [
    "क्या FireClient मुफ़्त है?",
    "हाँ। लॉन्चर और गेम के अंदर का क्लाइंट मुफ़्त हैं। ऑनलाइन खेलने के लिए आपको अपना माइनक्राफ्ट जावा एडिशन अकाउंट चाहिए।"
   ],
   [
    "क्या यह Minecraft Bedrock, MCPE, Mac या Linux पर चलता है?",
    "नहीं। FireClient केवल विंडोज़ पर माइनक्राफ्ट जावा एडिशन के लिए है।"
   ],
   [
    "विंडोज़ चेतावनी क्यों दिखाता है?",
    "अर्ली एक्सेस इंस्टॉलर हस्ताक्षरित नहीं है, इसलिए SmartScreen संदेश दिखा सकता है। फ़ाइल केवल इसी पेज या आधिकारिक GitHub रिलीज़ से डाउनलोड करें, और भरोसे के लिए SHA-256 मिलाकर देखें।"
   ],
   [
    "गेम के अंदर का क्लाइंट कौन-सा माइनक्राफ्ट वर्ज़न सपोर्ट करता है?",
    "Fabric और Java 21 के साथ माइनक्राफ्ट 1.21.1। दूसरे वर्ज़न FireClient मॉड के बिना चलाए जा सकते हैं।"
   ]
  ],
  "share": "शेयर करें",
  "ui": {
   "nav_download": "डाउनलोड",
   "nav_blog": "ब्लॉग",
   "nav_faq": "सवाल",
   "nav_get": "FireClient पाएँ",
   "lang_label": "भाषा",
   "foot_notaff": "Mojang या Microsoft से संबद्ध नहीं।",
   "menu_open": "नेविगेशन मेन्यू खोलें"
  }
 },
 "ar": {
  "code": "ar",
  "locale": "ar_AR",
  "name": "العربية",
  "flag": "🇸🇦",
  "crumb": "العربية",
  "home": "FireClient",
  "suggest": "عرض هذه الصفحة بالعربية؟",
  "dir": "rtl",
  "title": "FireClient — مشغّل ماينكرافت مجاني لنظام ويندوز (Fabric 1.21.1)",
  "desc": "حمّل FireClient: مشغّل ماينكرافت جافا مجاني وعميل Fabric 1.21.1 مع واجهة HUD قابلة للتحريك ومدير مودات Modrinth ومكتبة عوالم. ويندوز 10 و11.",
  "h1": "حمّل FireClient لنظام ويندوز",
  "lede": "مشغّل مجاني لماينكرافت جافا إديشن مع عميل Fabric للإصدار 1.21.1 وواجهة HUD قابلة للتحريك ومدير مودات Modrinth ومكتبة عوالم. وصول مبكر v1.0 لنظامي ويندوز 10 و11 (64 بت).",
  "dlh": "حمّل الوصول المبكر.",
  "dllede": "مثبّت مجاني لويندوز، v1.0. تحتاج إلى حساب ماينكرافت جافا إديشن خاص بك للعب عبر الإنترنت.",
  "btn": "حمّل الوصول المبكر لنظام ويندوز",
  "thanks": "شكرًا لتحميل FireClient. شغّل المثبّت، وانضم إلى Discord إذا احتجت إلى مساعدة.",
  "direct": "رابط مباشر: FireClient-Setup.exe من GitHub Releases. ويندوز 10 أو 11، 64 بت.",
  "warn": "مثبّت الوصول المبكر غير موقّع، لذا قد يعرض ويندوز تحذيرًا. حمّله فقط من هذه الصفحة أو من مستودع GitHub الرسمي.",
  "fh": "ما الذي يتضمنه",
  "feats": [
   "واجهة HUD بـ11 عنصرًا تحرّكها بالماوس (تُفتح القائمة بزر Shift الأيمن)",
   "3 سمات ألوان",
   "مدير مودات مع Modrinth وملفات jar الخاصة بك",
   "مكتبة عوالم مع أيقونة وتاريخ الحفظ والحجم",
   "إعداد الذاكرة لـ Java",
   "سكنات محلية واستضافة خادم Paper"
  ],
  "rh": "المتطلبات والحدود",
  "reqs": [
   "ويندوز 10 أو 11، 64 بت",
   "حساب ماينكرافت جافا إديشن خاص بك للعب عبر الإنترنت",
   "العميل داخل اللعبة يعمل على ماينكرافت 1.21.1 مع Fabric (Java 21)",
   "ويندوز فقط. محرر المؤشر والمستحضرات التجميلية مخطط لها ولم تُبنَ بعد"
  ],
  "gh": "الأدلة (بالإنجليزية)",
  "guides": [
   [
    "/blog/install-fireclient-windows/",
    "ثبّت FireClient في خمس خطوات"
   ],
   [
    "/blog/is-fireclient-safe/",
    "هل FireClient آمن؟ تحقق من تحميلك"
   ],
   [
    "/blog/boost-fps-minecraft-1-21-1-fabric/",
    "كيف ترفع FPS في ماينكرافت 1.21.1"
   ],
   [
    "/blog/minecraft-ram-allocation-guide/",
    "كم ذاكرة RAM تعطي ماينكرافت"
   ]
  ],
  "qh": "الأسئلة الشائعة.",
  "faq": [
   [
    "هل FireClient مجاني؟",
    "نعم. المشغّل والعميل داخل اللعبة مجانيان. تحتاج إلى حساب ماينكرافت جافا إديشن خاص بك للعب عبر الإنترنت."
   ],
   [
    "هل يعمل على Minecraft Bedrock أو MCPE أو ماك أو لينكس؟",
    "لا. FireClient مخصص لماينكرافت جافا إديشن على ويندوز فقط."
   ],
   [
    "لماذا يعرض ويندوز تحذيرًا؟",
    "مثبّت الوصول المبكر غير موقّع، لذا قد يعرض SmartScreen رسالة. حمّل الملف فقط من هذه الصفحة أو من إصدارات GitHub الرسمية، وقارن SHA-256 إن أردت التأكد."
   ],
   [
    "أي إصدار ماينكرافت يدعمه العميل داخل اللعبة؟",
    "ماينكرافت 1.21.1 مع Fabric وJava 21. يمكن تشغيل الإصدارات الأخرى بدون مود FireClient."
   ]
  ],
  "share": "مشاركة",
  "ui": {
   "nav_download": "تحميل",
   "nav_blog": "المدونة",
   "nav_faq": "الأسئلة",
   "nav_get": "احصل على FireClient",
   "lang_label": "اللغة",
   "foot_notaff": "غير تابع لـ Mojang أو Microsoft.",
   "menu_open": "افتح قائمة التنقل"
  }
 },
 "ru": {
  "code": "ru",
  "locale": "ru_RU",
  "name": "Русский",
  "flag": "🇷🇺",
  "crumb": "Русский",
  "home": "FireClient",
  "suggest": "Открыть эту страницу на русском?",
  "title": "FireClient — бесплатный лаунчер Minecraft для Windows (Fabric 1.21.1)",
  "desc": "Скачайте FireClient: бесплатный лаунчер Minecraft Java и клиент Fabric 1.21.1 с перетаскиваемым HUD, менеджером модов Modrinth и библиотекой миров. Windows 10 и 11.",
  "h1": "Скачать FireClient для Windows",
  "lede": "Бесплатный лаунчер для Minecraft Java Edition с клиентом Fabric для 1.21.1, перетаскиваемым HUD, менеджером модов Modrinth и библиотекой миров. Ранний доступ v1.0 для Windows 10 и 11 (64-бит).",
  "dlh": "Скачайте ранний доступ.",
  "dllede": "Бесплатный установщик для Windows, v1.0. Для игры онлайн нужна собственная учётная запись Minecraft Java Edition.",
  "btn": "Скачать ранний доступ для Windows",
  "thanks": "Спасибо за скачивание FireClient. Запустите установщик, а если нужна помощь, заходите в Discord.",
  "direct": "Прямая ссылка: FireClient-Setup.exe из GitHub Releases. Windows 10 или 11, 64-бит.",
  "warn": "Установщик раннего доступа не подписан, поэтому Windows может показать предупреждение. Скачивайте только с этой страницы или из официального репозитория GitHub.",
  "fh": "Что внутри",
  "feats": [
   "HUD из 11 элементов, которые перемещаются мышью (меню открывается правым Shift)",
   "3 цветовые темы",
   "Менеджер модов с Modrinth и вашими jar-файлами",
   "Библиотека миров со значком, датой сохранения и размером",
   "Настройка памяти для Java",
   "Локальные скины и хостинг сервера Paper"
  ],
  "rh": "Требования и ограничения",
  "reqs": [
   "Windows 10 или 11, 64-бит",
   "Собственная учётная запись Minecraft Java Edition для игры онлайн",
   "Клиент в игре работает в Minecraft 1.21.1 с Fabric (Java 21)",
   "Только Windows. Редактор прицела и косметика запланированы и ещё не созданы"
  ],
  "gh": "Руководства (на английском)",
  "guides": [
   [
    "/blog/install-fireclient-windows/",
    "Установка FireClient за пять шагов"
   ],
   [
    "/blog/is-fireclient-safe/",
    "Безопасен ли FireClient? Проверьте загрузку"
   ],
   [
    "/blog/boost-fps-minecraft-1-21-1-fabric/",
    "Как повысить FPS в Minecraft 1.21.1"
   ],
   [
    "/blog/minecraft-ram-allocation-guide/",
    "Сколько RAM выделить Minecraft"
   ]
  ],
  "qh": "Частые вопросы.",
  "faq": [
   [
    "FireClient бесплатный?",
    "Да. Лаунчер и клиент в игре бесплатны. Для игры онлайн нужна собственная учётная запись Minecraft Java Edition."
   ],
   [
    "Работает ли он в Minecraft Bedrock, MCPE, на Mac или Linux?",
    "Нет. FireClient предназначен только для Minecraft Java Edition на Windows."
   ],
   [
    "Почему Windows показывает предупреждение?",
    "Установщик раннего доступа не подписан, поэтому SmartScreen может показать сообщение. Скачивайте файл только с этой страницы или из официальных релизов на GitHub и при желании сверьте SHA-256."
   ],
   [
    "Какую версию Minecraft поддерживает клиент в игре?",
    "Minecraft 1.21.1 с Fabric и Java 21. Другие версии можно запускать без мода FireClient."
   ]
  ],
  "share": "Поделиться",
  "ui": {
   "nav_download": "Скачать",
   "nav_blog": "Блог",
   "nav_faq": "Вопросы",
   "nav_get": "Получить FireClient",
   "lang_label": "Язык",
   "foot_notaff": "Не связан с Mojang и Microsoft.",
   "menu_open": "Открыть меню навигации"
  }
 },
 "bn": {
  "code": "bn",
  "locale": "bn_BD",
  "name": "বাংলা",
  "flag": "🇧🇩",
  "crumb": "বাংলা",
  "home": "FireClient",
  "suggest": "এই পেজ বাংলায় দেখবেন?",
  "title": "FireClient — উইন্ডোজের জন্য বিনামূল্যে মাইনক্রাফট লঞ্চার",
  "desc": "FireClient ডাউনলোড করুন: বিনামূল্যে মাইনক্রাফট জাভা লঞ্চার এবং Fabric 1.21.1 ক্লায়েন্ট, সরানোর উপযোগী HUD, Modrinth মড ম্যানেজার ও ওয়ার্ল্ড লাইব্রেরিসহ। উইন্ডোজ ১০ ও ১১।",
  "h1": "উইন্ডোজের জন্য FireClient ডাউনলোড করুন",
  "lede": "মাইনক্রাফট জাভা এডিশনের জন্য বিনামূল্যে লঞ্চার, যাতে আছে 1.21.1-এর জন্য Fabric ক্লায়েন্ট, সরানোর উপযোগী HUD, Modrinth মড ম্যানেজার ও ওয়ার্ল্ড লাইব্রেরি। উইন্ডোজ ১০ ও ১১ (৬৪-বিট)-এর জন্য আর্লি অ্যাক্সেস v1.0।",
  "dlh": "আর্লি অ্যাক্সেস ডাউনলোড করুন।",
  "dllede": "উইন্ডোজের জন্য বিনামূল্যে ইনস্টলার, v1.0। অনলাইনে খেলতে আপনার নিজের মাইনক্রাফট জাভা এডিশন অ্যাকাউন্ট লাগবে।",
  "btn": "উইন্ডোজের জন্য আর্লি অ্যাক্সেস ডাউনলোড করুন",
  "thanks": "FireClient ডাউনলোড করার জন্য ধন্যবাদ। ইনস্টলার চালান, সাহায্য লাগলে Discord-এ যোগ দিন।",
  "direct": "সরাসরি লিংক: GitHub Releases থেকে FireClient-Setup.exe। উইন্ডোজ ১০ বা ১১, ৬৪-বিট।",
  "warn": "আর্লি অ্যাক্সেস ইনস্টলার স্বাক্ষরিত নয়, তাই উইন্ডোজ সতর্কবার্তা দেখাতে পারে। শুধু এই পেজ বা অফিশিয়াল GitHub রিপোজিটরি থেকে ডাউনলোড করুন।",
  "fh": "কী কী আছে",
  "feats": [
   "১১টি উপাদানের HUD, যা মাউস দিয়ে সরানো যায় (মেনু খোলে রাইট Shift দিয়ে)",
   "৩টি রঙের থিম",
   "Modrinth ও আপনার নিজের jar ফাইলসহ মড ম্যানেজার",
   "আইকন, সেভের তারিখ ও সাইজসহ ওয়ার্ল্ড লাইব্রেরি",
   "Java-এর জন্য মেমোরি সেটিং",
   "লোকাল স্কিন ও Paper সার্ভার হোস্টিং"
  ],
  "rh": "প্রয়োজনীয়তা ও সীমাবদ্ধতা",
  "reqs": [
   "উইন্ডোজ ১০ বা ১১, ৬৪-বিট",
   "অনলাইনে খেলতে নিজের মাইনক্রাফট জাভা এডিশন অ্যাকাউন্ট",
   "গেমের ভেতরের ক্লায়েন্ট Fabric সহ মাইনক্রাফট 1.21.1-এ চলে (Java 21)",
   "শুধু উইন্ডোজ। ক্রসহেয়ার এডিটর ও কসমেটিকস পরিকল্পনায় আছে, এখনো তৈরি হয়নি"
  ],
  "gh": "গাইড (ইংরেজিতে)",
  "guides": [
   [
    "/blog/install-fireclient-windows/",
    "পাঁচ ধাপে FireClient ইনস্টল করুন"
   ],
   [
    "/blog/is-fireclient-safe/",
    "FireClient কি নিরাপদ? আপনার ডাউনলোড যাচাই করুন"
   ],
   [
    "/blog/boost-fps-minecraft-1-21-1-fabric/",
    "মাইনক্রাফট 1.21.1-এ FPS কীভাবে বাড়াবেন"
   ],
   [
    "/blog/minecraft-ram-allocation-guide/",
    "মাইনক্রাফটকে কত RAM দেবেন"
   ]
  ],
  "qh": "সাধারণ প্রশ্ন।",
  "faq": [
   [
    "FireClient কি বিনামূল্যে?",
    "হ্যাঁ। লঞ্চার ও গেমের ভেতরের ক্লায়েন্ট বিনামূল্যে। অনলাইনে খেলতে আপনার নিজের মাইনক্রাফট জাভা এডিশন অ্যাকাউন্ট লাগবে।"
   ],
   [
    "এটা কি Minecraft Bedrock, MCPE, Mac বা Linux-এ চলে?",
    "না। FireClient শুধু উইন্ডোজে মাইনক্রাফট জাভা এডিশনের জন্য।"
   ],
   [
    "উইন্ডোজ কেন সতর্কবার্তা দেখায়?",
    "আর্লি অ্যাক্সেস ইনস্টলার স্বাক্ষরিত নয়, তাই SmartScreen বার্তা দেখাতে পারে। ফাইলটি শুধু এই পেজ বা অফিশিয়াল GitHub রিলিজ থেকে ডাউনলোড করুন, নিশ্চিত হতে চাইলে SHA-256 মিলিয়ে দেখুন।"
   ],
   [
    "গেমের ভেতরের ক্লায়েন্ট কোন মাইনক্রাফট ভার্সন সমর্থন করে?",
    "Fabric ও Java 21 সহ মাইনক্রাফট 1.21.1। অন্য ভার্সন FireClient মড ছাড়া চালানো যায়।"
   ]
  ],
  "share": "শেয়ার করুন",
  "ui": {
   "nav_download": "ডাউনলোড",
   "nav_blog": "ব্লগ",
   "nav_faq": "প্রশ্ন",
   "nav_get": "FireClient নিন",
   "lang_label": "ভাষা",
   "foot_notaff": "Mojang বা Microsoft-এর সঙ্গে সম্পর্কিত নয়।",
   "menu_open": "নেভিগেশন মেনু খুলুন"
  }
 },
 "it": {
  "code": "it",
  "locale": "it_IT",
  "name": "Italiano",
  "flag": "🇮🇹",
  "crumb": "Italiano",
  "home": "FireClient",
  "suggest": "Vedere questa pagina in italiano?",
  "title": "FireClient — launcher Minecraft gratuito per Windows (Fabric 1.21.1)",
  "desc": "Scarica FireClient: launcher Minecraft Java gratuito e client Fabric 1.21.1 con HUD spostabile, gestore di mod Modrinth e libreria dei mondi. Windows 10 e 11.",
  "h1": "Scarica FireClient per Windows",
  "lede": "Un launcher gratuito per Minecraft Java Edition con client Fabric per la 1.21.1, HUD spostabile, gestore di mod Modrinth e libreria dei mondi. Accesso anticipato v1.0 per Windows 10 e 11 (64 bit).",
  "dlh": "Scarica l'accesso anticipato.",
  "dllede": "Installer gratuito per Windows, v1.0. Per giocare online ti serve un tuo account Minecraft Java Edition.",
  "btn": "Scarica l'accesso anticipato per Windows",
  "thanks": "Grazie per aver scaricato FireClient. Avvia l'installer e, se ti serve aiuto, entra nel Discord.",
  "direct": "Link diretto: FireClient-Setup.exe da GitHub Releases. Windows 10 o 11, 64 bit.",
  "warn": "L'installer dell'accesso anticipato non è firmato, quindi Windows può mostrare un avviso. Scaricalo solo da questa pagina o dal repository GitHub ufficiale.",
  "fh": "Cosa include",
  "feats": [
   "HUD con 11 elementi che sposti con il mouse (menu con Maiusc destro)",
   "3 temi di colore",
   "Gestore di mod con Modrinth e i tuoi file jar",
   "Libreria dei mondi con icona, data di salvataggio e dimensione",
   "Impostazione della memoria per Java",
   "Skin locali e hosting di server Paper"
  ],
  "rh": "Requisiti e limiti",
  "reqs": [
   "Windows 10 o 11, 64 bit",
   "Un tuo account Minecraft Java Edition per giocare online",
   "Il client in gioco funziona su Minecraft 1.21.1 con Fabric (Java 21)",
   "Solo Windows. L'editor del mirino e i cosmetici sono pianificati e non ancora realizzati"
  ],
  "gh": "Guide (in inglese)",
  "guides": [
   [
    "/blog/install-fireclient-windows/",
    "Installa FireClient in cinque passaggi"
   ],
   [
    "/blog/is-fireclient-safe/",
    "FireClient è sicuro? Controlla il tuo download"
   ],
   [
    "/blog/boost-fps-minecraft-1-21-1-fabric/",
    "Come aumentare gli FPS in Minecraft 1.21.1"
   ],
   [
    "/blog/minecraft-ram-allocation-guide/",
    "Quanta RAM dare a Minecraft"
   ]
  ],
  "qh": "Domande frequenti.",
  "faq": [
   [
    "FireClient è gratuito?",
    "Sì. Launcher e client in gioco sono gratuiti. Per giocare online ti serve un tuo account Minecraft Java Edition."
   ],
   [
    "Funziona su Minecraft Bedrock, MCPE, Mac o Linux?",
    "No. FireClient è solo per Minecraft Java Edition su Windows."
   ],
   [
    "Perché Windows mostra un avviso?",
    "L'installer dell'accesso anticipato non è firmato, quindi SmartScreen può mostrare un messaggio. Scarica il file solo da questa pagina o dalle release ufficiali su GitHub e confronta l'SHA-256 se vuoi esserne certo."
   ],
   [
    "Quale versione di Minecraft supporta il client in gioco?",
    "Minecraft 1.21.1 con Fabric e Java 21. Le altre versioni possono essere avviate senza la mod FireClient."
   ]
  ],
  "share": "Condividi",
  "ui": {
   "nav_download": "Scarica",
   "nav_blog": "Blog",
   "nav_faq": "Domande",
   "nav_get": "Ottieni FireClient",
   "lang_label": "Lingua",
   "foot_notaff": "Non affiliato a Mojang né a Microsoft.",
   "menu_open": "Apri il menu di navigazione"
  }
 },
 "vi": {
  "code": "vi",
  "locale": "vi_VN",
  "name": "Tiếng Việt",
  "flag": "🇻🇳",
  "crumb": "Tiếng Việt",
  "home": "FireClient",
  "suggest": "Xem trang này bằng tiếng Việt?",
  "title": "FireClient — launcher Minecraft miễn phí cho Windows (Fabric 1.21.1)",
  "desc": "Tải FireClient: launcher Minecraft Java miễn phí và client Fabric 1.21.1 với HUD kéo thả, trình quản lý mod Modrinth và thư viện thế giới. Windows 10 và 11.",
  "h1": "Tải FireClient cho Windows",
  "lede": "Launcher miễn phí cho Minecraft Java Edition với client Fabric cho 1.21.1, HUD kéo thả, trình quản lý mod Modrinth và thư viện thế giới. Truy cập sớm v1.0 cho Windows 10 và 11 (64-bit).",
  "dlh": "Tải bản truy cập sớm.",
  "dllede": "Trình cài đặt Windows miễn phí, v1.0. Bạn cần tài khoản Minecraft Java Edition của riêng mình để chơi trực tuyến.",
  "btn": "Tải bản truy cập sớm cho Windows",
  "thanks": "Cảm ơn bạn đã tải FireClient. Hãy chạy trình cài đặt, và tham gia Discord nếu cần trợ giúp.",
  "direct": "Liên kết trực tiếp: FireClient-Setup.exe từ GitHub Releases. Windows 10 hoặc 11, 64-bit.",
  "warn": "Trình cài đặt truy cập sớm chưa được ký số, nên Windows có thể hiện cảnh báo. Chỉ tải từ trang này hoặc kho GitHub chính thức.",
  "fh": "Bao gồm những gì",
  "feats": [
   "HUD 11 thành phần kéo bằng chuột (mở menu bằng Shift phải)",
   "3 giao diện màu",
   "Trình quản lý mod với Modrinth và tệp jar của riêng bạn",
   "Thư viện thế giới có biểu tượng, ngày lưu và dung lượng",
   "Thiết lập bộ nhớ cho Java",
   "Skin cục bộ và lưu trữ máy chủ Paper"
  ],
  "rh": "Yêu cầu và giới hạn",
  "reqs": [
   "Windows 10 hoặc 11, 64-bit",
   "Tài khoản Minecraft Java Edition của riêng bạn để chơi trực tuyến",
   "Client trong game chạy trên Minecraft 1.21.1 với Fabric (Java 21)",
   "Chỉ Windows. Trình chỉnh tâm ngắm và vật phẩm trang trí đã được lên kế hoạch nhưng chưa có"
  ],
  "gh": "Hướng dẫn (tiếng Anh)",
  "guides": [
   [
    "/blog/install-fireclient-windows/",
    "Cài FireClient trong năm bước"
   ],
   [
    "/blog/is-fireclient-safe/",
    "FireClient có an toàn không? Kiểm tra bản tải của bạn"
   ],
   [
    "/blog/boost-fps-minecraft-1-21-1-fabric/",
    "Cách tăng FPS trong Minecraft 1.21.1"
   ],
   [
    "/blog/minecraft-ram-allocation-guide/",
    "Nên cấp bao nhiêu RAM cho Minecraft"
   ]
  ],
  "qh": "Câu hỏi thường gặp.",
  "faq": [
   [
    "FireClient có miễn phí không?",
    "Có. Launcher và client trong game đều miễn phí. Bạn cần tài khoản Minecraft Java Edition của riêng mình để chơi trực tuyến."
   ],
   [
    "Có chạy trên Minecraft Bedrock, MCPE, Mac hay Linux không?",
    "Không. FireClient chỉ dành cho Minecraft Java Edition trên Windows."
   ],
   [
    "Vì sao Windows hiện cảnh báo?",
    "Trình cài đặt truy cập sớm chưa được ký số, nên SmartScreen có thể hiện thông báo. Chỉ tải tệp từ trang này hoặc các bản phát hành GitHub chính thức, và so sánh SHA-256 nếu muốn chắc chắn."
   ],
   [
    "Client trong game hỗ trợ phiên bản Minecraft nào?",
    "Minecraft 1.21.1 với Fabric và Java 21. Các phiên bản khác có thể chạy mà không có mod FireClient."
   ]
  ],
  "share": "Chia sẻ",
  "ui": {
   "nav_download": "Tải về",
   "nav_blog": "Blog",
   "nav_faq": "Hỏi đáp",
   "nav_get": "Tải FireClient",
   "lang_label": "Ngôn ngữ",
   "foot_notaff": "Không liên kết với Mojang hay Microsoft.",
   "menu_open": "Mở menu điều hướng"
  }
 },
 "ja": {
  "code": "ja",
  "locale": "ja_JP",
  "name": "日本語",
  "flag": "🇯🇵",
  "crumb": "日本語",
  "home": "FireClient",
  "suggest": "このページを日本語で見ますか？",
  "title": "FireClient — Windows向け無料Minecraftランチャー（Fabric 1.21.1）",
  "desc": "FireClientをダウンロード：無料のMinecraft Javaランチャーと、移動可能なHUD、Modrinth対応のMod管理、ワールドライブラリを備えたFabric 1.21.1クライアント。Windows 10/11対応。",
  "h1": "Windows版FireClientをダウンロード",
  "lede": "Minecraft Java Edition向けの無料ランチャーです。1.21.1用Fabricクライアント、移動できるHUD、ModrinthのMod管理、ワールドライブラリを搭載。Windows 10/11（64ビット）向けアーリーアクセスv1.0。",
  "dlh": "アーリーアクセスをダウンロード。",
  "dllede": "Windows向け無料インストーラー v1.0。オンラインでプレイするには、ご自身のMinecraft Java Editionアカウントが必要です。",
  "btn": "Windows向けアーリーアクセスをダウンロード",
  "thanks": "FireClientをダウンロードいただきありがとうございます。インストーラーを実行してください。お困りの際はDiscordへどうぞ。",
  "direct": "直接リンク：GitHub ReleasesのFireClient-Setup.exe。Windows 10または11、64ビット。",
  "warn": "アーリーアクセス版のインストーラーは署名されていないため、Windowsが警告を表示することがあります。このページまたは公式GitHubリポジトリからのみダウンロードしてください。",
  "fh": "含まれるもの",
  "feats": [
   "マウスで動かせる11要素のHUD（メニューは右Shiftで開きます）",
   "3種類のカラーテーマ",
   "Modrinthとお手持ちのjarファイルに対応したMod管理",
   "アイコン・保存日・サイズ付きのワールドライブラリ",
   "Java用のメモリ設定",
   "ローカルスキンとPaperサーバーのホスティング"
  ],
  "rh": "動作要件と制限",
  "reqs": [
   "Windows 10または11、64ビット",
   "オンラインプレイにはご自身のMinecraft Java Editionアカウント",
   "ゲーム内クライアントはFabric搭載のMinecraft 1.21.1で動作（Java 21）",
   "Windowsのみ。クロスヘアエディターとコスメティックは計画中で、まだ作られていません"
  ],
  "gh": "ガイド（英語）",
  "guides": [
   [
    "/blog/install-fireclient-windows/",
    "FireClientを5ステップでインストール"
   ],
   [
    "/blog/is-fireclient-safe/",
    "FireClientは安全？ダウンロードを確認する方法"
   ],
   [
    "/blog/boost-fps-minecraft-1-21-1-fabric/",
    "Minecraft 1.21.1でFPSを上げる方法"
   ],
   [
    "/blog/minecraft-ram-allocation-guide/",
    "Minecraftに割り当てるRAMの目安"
   ]
  ],
  "qh": "よくある質問",
  "faq": [
   [
    "FireClientは無料ですか？",
    "はい。ランチャーとゲーム内クライアントは無料です。オンラインでプレイするには、ご自身のMinecraft Java Editionアカウントが必要です。"
   ],
   [
    "Minecraft Bedrock、MCPE、Mac、Linuxで動きますか？",
    "いいえ。FireClientはWindows上のMinecraft Java Edition専用です。"
   ],
   [
    "なぜWindowsが警告を表示するのですか？",
    "アーリーアクセス版のインストーラーは署名されていないため、SmartScreenがメッセージを表示することがあります。ファイルはこのページまたは公式GitHubリリースからのみダウンロードし、確認したい場合はSHA-256を比較してください。"
   ],
   [
    "ゲーム内クライアントはどのMinecraftバージョンに対応していますか？",
    "Fabricを使ったMinecraft 1.21.1とJava 21です。他のバージョンはFireClient Modなしで起動できます。"
   ]
  ],
  "share": "共有",
  "ui": {
   "nav_download": "ダウンロード",
   "nav_blog": "ブログ",
   "nav_faq": "よくある質問",
   "nav_get": "FireClientを入手",
   "lang_label": "言語",
   "foot_notaff": "MojangおよびMicrosoftとは無関係です。",
   "menu_open": "ナビゲーションメニューを開く"
  }
 },
 "ko": {
  "code": "ko",
  "locale": "ko_KR",
  "name": "한국어",
  "flag": "🇰🇷",
  "crumb": "한국어",
  "home": "FireClient",
  "suggest": "이 페이지를 한국어로 보시겠습니까?",
  "title": "FireClient — Windows용 무료 마인크래프트 런처 (Fabric 1.21.1)",
  "desc": "FireClient 다운로드: 무료 마인크래프트 자바 런처와 이동 가능한 HUD, Modrinth 모드 관리자, 월드 라이브러리를 갖춘 Fabric 1.21.1 클라이언트. Windows 10 및 11.",
  "h1": "Windows용 FireClient 다운로드",
  "lede": "마인크래프트 자바 에디션용 무료 런처입니다. 1.21.1용 Fabric 클라이언트, 이동 가능한 HUD, Modrinth 모드 관리자, 월드 라이브러리를 제공합니다. Windows 10 및 11(64비트)용 얼리 액세스 v1.0.",
  "dlh": "얼리 액세스 다운로드",
  "dllede": "Windows용 무료 설치 프로그램 v1.0. 온라인 플레이에는 본인의 마인크래프트 자바 에디션 계정이 필요합니다.",
  "btn": "Windows용 얼리 액세스 다운로드",
  "thanks": "FireClient를 다운로드해 주셔서 감사합니다. 설치 프로그램을 실행하세요. 도움이 필요하면 Discord에 참여하세요.",
  "direct": "직접 링크: GitHub Releases의 FireClient-Setup.exe. Windows 10 또는 11, 64비트.",
  "warn": "얼리 액세스 설치 프로그램은 서명되지 않아 Windows가 경고를 표시할 수 있습니다. 이 페이지 또는 공식 GitHub 저장소에서만 다운로드하세요.",
  "fh": "포함된 기능",
  "feats": [
   "마우스로 옮길 수 있는 11개 요소의 HUD(메뉴는 오른쪽 Shift로 열림)",
   "3가지 색상 테마",
   "Modrinth 및 직접 가진 jar 파일을 지원하는 모드 관리자",
   "아이콘, 저장 날짜, 크기가 표시되는 월드 라이브러리",
   "Java 메모리 설정",
   "로컬 스킨 및 Paper 서버 호스팅"
  ],
  "rh": "요구 사항 및 제한",
  "reqs": [
   "Windows 10 또는 11, 64비트",
   "온라인 플레이를 위한 본인의 마인크래프트 자바 에디션 계정",
   "게임 내 클라이언트는 Fabric이 설치된 마인크래프트 1.21.1에서 작동(Java 21)",
   "Windows 전용. 조준선 편집기와 치장 아이템은 계획 중이며 아직 만들어지지 않았습니다"
  ],
  "gh": "가이드(영어)",
  "guides": [
   [
    "/blog/install-fireclient-windows/",
    "FireClient를 5단계로 설치하기"
   ],
   [
    "/blog/is-fireclient-safe/",
    "FireClient는 안전한가요? 다운로드 확인하기"
   ],
   [
    "/blog/boost-fps-minecraft-1-21-1-fabric/",
    "마인크래프트 1.21.1에서 FPS 높이는 방법"
   ],
   [
    "/blog/minecraft-ram-allocation-guide/",
    "마인크래프트에 RAM을 얼마나 할당할까"
   ]
  ],
  "qh": "자주 묻는 질문",
  "faq": [
   [
    "FireClient는 무료인가요?",
    "네. 런처와 게임 내 클라이언트는 무료입니다. 온라인 플레이에는 본인의 마인크래프트 자바 에디션 계정이 필요합니다."
   ],
   [
    "Minecraft Bedrock, MCPE, Mac, Linux에서 작동하나요?",
    "아니요. FireClient는 Windows의 마인크래프트 자바 에디션 전용입니다."
   ],
   [
    "Windows가 왜 경고를 표시하나요?",
    "얼리 액세스 설치 프로그램은 서명되지 않아 SmartScreen이 메시지를 표시할 수 있습니다. 파일은 이 페이지 또는 공식 GitHub 릴리스에서만 다운로드하고, 확실히 하려면 SHA-256을 비교하세요."
   ],
   [
    "게임 내 클라이언트는 어떤 마인크래프트 버전을 지원하나요?",
    "Fabric이 설치된 마인크래프트 1.21.1과 Java 21입니다. 다른 버전은 FireClient 모드 없이 실행할 수 있습니다."
   ]
  ],
  "share": "공유",
  "ui": {
   "nav_download": "다운로드",
   "nav_blog": "블로그",
   "nav_faq": "자주 묻는 질문",
   "nav_get": "FireClient 받기",
   "lang_label": "언어",
   "foot_notaff": "Mojang 및 Microsoft와 관련이 없습니다.",
   "menu_open": "탐색 메뉴 열기"
  }
 },
 "zh": {
  "code": "zh",
  "hl": "zh-Hans",
  "locale": "zh_CN",
  "name": "简体中文",
  "flag": "🇨🇳",
  "crumb": "简体中文",
  "home": "FireClient",
  "share": "分享",
  "suggest": "用简体中文查看此页面？",
  "title": "FireClient — 免费 Windows Minecraft 启动器（Fabric 1.21.1）",
  "desc": "下载 FireClient：免费的 Minecraft Java 启动器，附带 Fabric 1.21.1 客户端，支持可拖动 HUD、Modrinth 模组管理器和世界库。适用于 Windows 10 和 11。",
  "h1": "下载适用于 Windows 的 FireClient",
  "lede": "面向 Minecraft Java 版的免费启动器，提供 1.21.1 的 Fabric 客户端、可拖动的 HUD、Modrinth 模组管理器和世界库。适用于 Windows 10 和 11（64 位）的抢先体验版 v1.0。",
  "dlh": "下载抢先体验版。",
  "dllede": "Windows 免费安装程序，v1.0。在线游玩需要你自己的 Minecraft Java 版账号。",
  "btn": "下载 Windows 抢先体验版",
  "thanks": "感谢下载 FireClient。请运行安装程序，需要帮助可加入 Discord。",
  "direct": "直接链接：来自 GitHub Releases 的 FireClient-Setup.exe。Windows 10 或 11，64 位。",
  "warn": "抢先体验版安装程序没有数字签名，因此 Windows 可能显示警告。请只从本页面或官方 GitHub 仓库下载。",
  "fh": "包含内容",
  "feats": [
   "11 个元素的 HUD，可用鼠标拖动（按右 Shift 打开菜单）",
   "3 种配色主题",
   "支持 Modrinth 和你自己 jar 文件的模组管理器",
   "带图标、保存日期和大小的世界库",
   "Java 内存设置",
   "本地皮肤和 Paper 服务器托管"
  ],
  "rh": "要求与限制",
  "reqs": [
   "Windows 10 或 11，64 位",
   "在线游玩需要你自己的 Minecraft Java 版账号",
   "游戏内客户端运行于带 Fabric 的 Minecraft 1.21.1（Java 21）",
   "仅支持 Windows。准星编辑器和外观装饰已在计划中，尚未开发"
  ],
  "gh": "指南（英文）",
  "guides": [
   [
    "/blog/install-fireclient-windows/",
    "五步安装 FireClient"
   ],
   [
    "/blog/is-fireclient-safe/",
    "FireClient 安全吗？检查你的下载文件"
   ],
   [
    "/blog/boost-fps-minecraft-1-21-1-fabric/",
    "如何在 Minecraft 1.21.1 中提升 FPS"
   ],
   [
    "/blog/minecraft-ram-allocation-guide/",
    "应该给 Minecraft 分配多少内存"
   ]
  ],
  "qh": "常见问题",
  "faq": [
   [
    "FireClient 免费吗？",
    "是的。启动器和游戏内客户端都是免费的。在线游玩需要你自己的 Minecraft Java 版账号。"
   ],
   [
    "它能在 Minecraft 基岩版、MCPE、Mac 或 Linux 上运行吗？",
    "不能。FireClient 仅适用于 Windows 上的 Minecraft Java 版。"
   ],
   [
    "为什么 Windows 会显示警告？",
    "抢先体验版安装程序没有数字签名，所以 SmartScreen 可能弹出提示。请只从本页面或官方 GitHub 发布页下载，如需确认可核对 SHA-256。"
   ],
   [
    "游戏内客户端支持哪个 Minecraft 版本？",
    "带 Fabric 和 Java 21 的 Minecraft 1.21.1。其他版本可以不带 FireClient 模组启动。"
   ]
  ],
  "ui": {
   "nav_download": "下载",
   "nav_blog": "博客",
   "nav_faq": "常见问题",
   "nav_get": "获取 FireClient",
   "lang_label": "语言",
   "foot_notaff": "与 Mojang 或 Microsoft 无关联。",
   "menu_open": "打开导航菜单"
  }
 },
 "zh-tw": {
  "code": "zh-tw",
  "hl": "zh-Hant",
  "locale": "zh_TW",
  "name": "繁體中文",
  "flag": "🇹🇼",
  "crumb": "繁體中文",
  "home": "FireClient",
  "share": "分享",
  "suggest": "以繁體中文檢視此頁面？",
  "title": "FireClient — 免費 Windows Minecraft 啟動器（Fabric 1.21.1）",
  "desc": "下載 FireClient：免費的 Minecraft Java 啟動器，附 Fabric 1.21.1 客戶端，支援可拖曳 HUD、Modrinth 模組管理器和世界庫。適用於 Windows 10 和 11。",
  "h1": "下載適用於 Windows 的 FireClient",
  "lede": "專為 Minecraft Java 版打造的免費啟動器，提供 1.21.1 的 Fabric 客戶端、可拖曳的 HUD、Modrinth 模組管理器和世界庫。適用於 Windows 10 和 11（64 位元）的搶先體驗版 v1.0。",
  "dlh": "下載搶先體驗版。",
  "dllede": "Windows 免費安裝程式，v1.0。線上遊玩需要你自己的 Minecraft Java 版帳號。",
  "btn": "下載 Windows 搶先體驗版",
  "thanks": "感謝下載 FireClient。請執行安裝程式，需要協助可加入 Discord。",
  "direct": "直接連結：來自 GitHub Releases 的 FireClient-Setup.exe。Windows 10 或 11，64 位元。",
  "warn": "搶先體驗版安裝程式沒有數位簽章，因此 Windows 可能顯示警告。請只從本頁面或官方 GitHub 儲存庫下載。",
  "fh": "包含內容",
  "feats": [
   "11 個元素的 HUD，可用滑鼠拖曳（按右 Shift 開啟選單）",
   "3 種配色主題",
   "支援 Modrinth 和你自己 jar 檔案的模組管理器",
   "附圖示、儲存日期和大小的世界庫",
   "Java 記憶體設定",
   "本機 Skin 與 Paper 伺服器代管"
  ],
  "rh": "需求與限制",
  "reqs": [
   "Windows 10 或 11，64 位元",
   "線上遊玩需要你自己的 Minecraft Java 版帳號",
   "遊戲內客戶端運作於搭載 Fabric 的 Minecraft 1.21.1（Java 21）",
   "僅支援 Windows。準星編輯器和外觀裝飾已在規劃中，尚未開發"
  ],
  "gh": "指南（英文）",
  "guides": [
   [
    "/blog/install-fireclient-windows/",
    "五步驟安裝 FireClient"
   ],
   [
    "/blog/is-fireclient-safe/",
    "FireClient 安全嗎？檢查你的下載檔案"
   ],
   [
    "/blog/boost-fps-minecraft-1-21-1-fabric/",
    "如何在 Minecraft 1.21.1 提升 FPS"
   ],
   [
    "/blog/minecraft-ram-allocation-guide/",
    "該給 Minecraft 分配多少記憶體"
   ]
  ],
  "qh": "常見問題",
  "faq": [
   [
    "FireClient 免費嗎？",
    "是的。啟動器和遊戲內客戶端都是免費的。線上遊玩需要你自己的 Minecraft Java 版帳號。"
   ],
   [
    "它能在 Minecraft 基岩版、MCPE、Mac 或 Linux 上執行嗎？",
    "不能。FireClient 僅適用於 Windows 上的 Minecraft Java 版。"
   ],
   [
    "為什麼 Windows 會顯示警告？",
    "搶先體驗版安裝程式沒有數位簽章，所以 SmartScreen 可能跳出提示。請只從本頁面或官方 GitHub 發佈頁下載，如需確認可核對 SHA-256。"
   ],
   [
    "遊戲內客戶端支援哪個 Minecraft 版本？",
    "搭載 Fabric 與 Java 21 的 Minecraft 1.21.1。其他版本可以不帶 FireClient 模組啟動。"
   ]
  ],
  "ui": {
   "nav_download": "下載",
   "nav_blog": "部落格",
   "nav_faq": "常見問題",
   "nav_get": "取得 FireClient",
   "lang_label": "語言",
   "foot_notaff": "與 Mojang 或 Microsoft 無關。",
   "menu_open": "開啟導覽選單"
  }
 }
};
