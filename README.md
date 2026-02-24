# Roskisprojekti 
Ohjelmistotuotanto 2 ryhmäprojekti

## Frontend
Reactilla (Vite) toteutettu frontend roskasäiliön IoT-seurantaprojektiin.  
Tässä vaiheessa repositorio sisältää vain käyttöliittymän lähdekoodin.

### Teknologiat

- React
- Vite
- JavaScript (JSX)
- CSS
- npm

### Vaatimukset

Varmista, että seuraavat ovat asennettuna:

- Node.js (suositus v18 tai uudempi)
- npm
- Git
- Visual Studio Code

### Projektin kloonaus

Kloonaa repositorio omalle koneellesi:

`git clone https://github.com/USERNAME/REPOSITORY_NAME.git`

`cd REPOSITORY_NAME`

### Asenna projektin riippuvuudet:

`npm install`

### Käynnistä Vite kehityspalvelin:

`npm run dev`

Käyttöliittymä avautuu selaimeen osoitteeseen, jonka Vite tulostaa terminaaliin, yleensä:
`http://localhost:xxxx`

TIETOKANTAYHTEYS OHJEET:

INTELLJ:
Avaa View → Tool Windows → Database.

Klikkaa + → Data Source → MySQL.

Syötä:

Host: localhost

Port: 3306

User: root

Password: oma MySQL-salasana

Database: tietokannan nimi

Klikkaa Test Connection → jos onnistuu, paina OK.

Visual Studio Code
Yhdistä MySQL VS Code -laajennuksella (Helpoin)
Asenna MySQL (jos ei vielä ole)

Lataa ja asenna:

👉 MySQL Community Server

Asennuksen aikana:

Muista root-salasana

Oletusportti on yleensä 3306

2. Asenna MySQL-laajennus VS Codeen

Avaa VS Code

Mene Extensions (Ctrl + Shift + X)

Hae:

👉 MySQL (tekijä esim. cweijan)

Paina Install

3.Luo yhteys MySQL-palvelimeen

Paina vasemman reunan MySQL-ikonia

Valitse Add Connection

Täytä tiedot:

Kenttä	Arvo
Host	localhost
User	root
Password	(se jonka asetit)
Port	3306

Klikkaa Connect

Jos kaikki meni oikein, näet tietokannat vasemmalla 🎉
