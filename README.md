VoteMe! Äänestyssovellus

UseCase-kaavio:
https://esedu-my.sharepoint.com/:w:/r/personal/tanja_heino_esedulainen_fi/Documents/Ohjelmointi/usecase-kaavio.docx?d=we4e371d154974892a4c5e6445d1e200d&csf=1&web=1&e=GYgsJO

Käyttötapauskuvaukset:

Käyttötapauksen nimi: Äänestäminen
Käyttäjät: Käyttäjät ja Ylläpitäjät
Laukaisija: Käyttäjä tai ylläpitäjä valitsee haluamansa vastausvaihtoehdon ja painaa "Äänestä"-painiketta.
Esiehto: Ylläpitäjän on täytynyt ensin luoda joku äänestys ja jos käyttäjä on jo äänestänyt, täytyy hänen painaa "Uusi käyttäjä"-painiketta äänestääkseen uudelleen.
Jälkiehto: Äänestyksen jälkeen käyttäjälle tulee näkyviin äänestystulos. Tämän jälkeen hän voi äänestää uudelleen painamalla "Uusi käyttäjä"-painiketta.
Käyttötapauksen kulku: Käyttäjät voivat äänestää haluamiaan äänestyksiä ja näkevät äänestystulokset. Ylläpitäjät voivat myös äänestää, kuten käyttäjätkin. Molemmat voivat myös muuttaa omaa vastaustaan halutessaan.
Poikkeuksellinen toiminta: Mikäli äänestyksiä ei ole luotu, äänestystä ei voida tehdä.

Käyttötapauksen nimi: Rekisteröityminen
Käyttäjät: Käyttäjät
Laukaisija: Käyttäjä luo itselleen käyttäjätunnuksen ja salasanan ja painaa "Rekisteröidy ylläpitäjäksi!"-painiketta.
Esiehto: Käyttäjä luo onnistuneesti käyttäjätunnuksen ja salasanan
Jälkiehto: Käyttäjälle avautuu ylläpitäjän näkymä, jossa hän voi luoda uusia tai poistaa vanhoja äänestyksiä.
Käyttötapauksen kulku: Käyttäjä onnistuu luomaan tunnukset. Näin hän saa käyttöönsä ylläpitäjän näkymän, jossa hän voi äänestää, luoda uusia tai poistaa vanhoja äänestyksiä. Tämän jälkeen hän voi painaa "Kirjaudu ulos"-painiketta.
Poikkeuksellinen toiminta: Jos käyttäjätunnus on jo olemassa, ei rekisteröintiä voi tehdä. Tästä tulee virheilmoitus.

Käyttötapauksen nimi: Kirjautuminen
Käyttäjät: Ylläpitäjät
Laukaisija: Käyttäjä kirjoittaa käyttäjätunnuksensa ja salasanansa ja painaa "Kirjaudu sisään"-painiketta.
Esiehto: Käyttäjän on täytynyt ensin rekisteröityä sisään.
Jälkiehto: Ylläpitäjälle avautuu ylläpitäjän näkymä. Lisäksi hän voi kirjautua ulos painamalla "Kirjaudu ulos"-painiketta.
Käyttötapauksen kulku: Ylläpitäjälle avautuu näkymä, jossa hän voi äänestää, nähdä äänestystulokset, luoda uusia äänestyksiä tai poistaa vanhoja. Lisäksi hän voi kirjautua ulos painamalla "Kirjaudu ulos"-painiketta.
Poikkeuksellinen toiminta: Mikäli käyttäjä ei ole rekisteröitynyt tai kirjoittaa käyttäjätunnuksensa väärin, siitä tulee virheilmoitus.
