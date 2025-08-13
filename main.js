// Tallennetaan äänestykset
let aanestykset = JSON.parse(localStorage.getItem("aanestykset") || "[]");
let yllapitajaKirjautunut = false;
const uiTila = {}; // UI-tila, ei tallenneta localStorageen

// Elementit
const aanestysLista = document.getElementById("aanestys_lista");
const luoAanestysNappi = document.getElementById("luo_aanestys");
const kirjauduNappi = document.getElementById("kirjaudu_nappi");
const kirjauduUlosNappi = document.getElementById("kirjaudu_ulos");
const yllapitajaTyokalut = document.getElementById("yllapitaja_tyokalut");

//Haetaan ylläpitäjät
let yllapitajat = JSON.parse(localStorage.getItem("yllapitajat") || "[]");

function tallennaYllapitajat() {
    localStorage.setItem("yllapitajat", JSON.stringify(yllapitajat));
}

// Äänestykset
function naytaAanestykset() {
    aanestysLista.innerHTML = "";

    aanestykset.forEach((aanestys, indeksi) => {
        let laatikko = document.createElement("div");
        laatikko.className = "aanestys_laatikko";

        let otsikko = document.createElement("h3");
        otsikko.textContent = aanestys.kysymys;
        laatikko.appendChild(otsikko);

        const naytetaanLomake = !!uiTila[indeksi];
        const kayttajaOnAanestanyt = typeof aanestys.kayttajanValinta === "number";

        if (kayttajaOnAanestanyt && !naytetaanLomake) {
            naytaTulokset(laatikko, aanestys);

            //Mahdollisuus muuttaa ääntä
            const muutaNappi = document.createElement("button");
            muutaNappi.textContent = "Muuta ääntäsi";
            muutaNappi.onclick = () => {
                uiTila[indeksi] = true;
                naytaAanestykset();
            };
            laatikko.appendChild(muutaNappi);
        } else {
            //Näytetään äänestysLomake
            aanestys.vaihtoehdot.forEach((vaihtoehto, vIndex) => {
                let label = document.createElement("label");
                label.className = "vaihtoehto";

                let radio = document.createElement("input");
                radio.type = "radio";
                radio.name = "aanestys_" + indeksi;
                radio.value = vIndex;

                //Esitäytä aiempi valinta
                if (aanestys.kayttajanValinta === vIndex) radio.checked = true;

                label.appendChild(radio);
                label.appendChild(document.createTextNode(" " + vaihtoehto));
                laatikko.appendChild(label);
            });

            // Äänestä-painike
            const aanestaNappi = document.createElement("button");
            aanestaNappi.textContent = kayttajaOnAanestanyt ? "Tallenna uusi ääni" : "Äänestä";
            aanestaNappi.onclick = () => {
                const valittu = laatikko.querySelector(`input[name="aanestys_${indeksi}"]:checked`);
                if (!valittu) {
                    naytaIlmoitus("Valitse vaihtoehto ennen äänestämistä!", true);
                    return;
                }
                aanesta(indeksi, parseInt(valittu.value, 10));
            };
            laatikko.appendChild(aanestaNappi);

            //Takaisin tuloksiin (jos aiempi ääni on olemassa)
            if (kayttajaOnAanestanyt) {
                const peruuta = document.createElement("button");
                peruuta.textContent = "Takaisin tuloksiin";
                peruuta.onclick = () => {
                    uiTila[indeksi] = false;
                    naytaAanestykset();
                };
                laatikko.appendChild(peruuta);
            }
        }

        // Poistonappi vain ylläpitäjälle
        if (yllapitajaKirjautunut) {
            const poistoNappi = document.createElement("button");
            poistoNappi.textContent = "Poista äänestys";
            poistoNappi.onclick = () => poistaAanestys(indeksi);
            laatikko.appendChild(poistoNappi);
        }

        aanestysLista.appendChild(laatikko);
    });
}

// Äänestäminen
function aanesta(aanestysIndex, vaihtoehtoIndex) {
    const a = aanestykset[aanestysIndex];

    //Varmista järkevät taulukot
    if (!Array.isArray(a.aanet) || a.aanet.length !== a.vaihtoehdot.length) {
        a.aanet = Array.from({ length: a.vaihtoehdot.length }, () => 0);
    }

    //Jos käyttäjällä oli aiempi ääni, vähennä se ensin
    if (typeof a.kayttajanValinta === "number") {
        const prev = a.kayttajanValinta;
        a.aanet[prev] = Math.max(0, (a.aanet[prev] || 0) - 1);
    }

    //Lisää uusi ääni
    a.aanet[vaihtoehtoIndex] = (a.aanet[vaihtoehtoIndex] || 0) + 1;
    a.kayttajanValinta = vaihtoehtoIndex;

    //Tallennus ja takaisin tulosnäkymään
    tallenna();
    uiTila[aanestysIndex] = false;
    naytaAanestykset();
}

// Tulosten näyttäminen
function naytaTulokset(kohde, aanestys) {
    const aanetTaulukko = Array.from({ length: aanestys.vaihtoehdot.length }, (_, i) => aanestys.aanet?.[i] || 0);
    const yhteensa = aanetTaulukko.reduce((sum, n) => sum + n, 0);

    aanestys.vaihtoehdot.forEach((vaihtoehto, idx) => {
        const maara = aanetTaulukko[idx];
        const prosentti = yhteensa > 0 ? Math.round((maara / yhteensa)* 100) : 0;

        const teksti = document.createElement("div");
        teksti.textContent = `${vaihtoehto} - ${prosentti}% (${maara} ääntä)`;

        const palkki = document.createElement("div");
        palkki.className = "tulos_palkki";
        palkki.style.width = prosentti + "%";

        kohde.appendChild(teksti);
        kohde.appendChild(palkki);
    });

    //Pieni yhteenveto loppuun
    const summa = document.createElement("div");
    summa.style.marginTop = "6px";
    summa.textContent = `Yhteensä ${yhteensa} ääntä`;
    kohde.appendChild(summa);
}

// Uuden äänestyksen luonti
luoAanestysNappi.onclick = () => {
    let kysymys = document.getElementById("kysymys").value.trim();
    let v1 = document.getElementById("vaihtoehto1").value.trim();
    let v2 = document.getElementById("vaihtoehto2").value.trim();
    let v3 = document.getElementById("vaihtoehto3").value.trim();
    let v4 = document.getElementById("vaihtoehto4").value.trim();

    if (!kysymys || !v1 || !v2 || !v3 || !v4) {
        naytaIlmoitus("Täytä kaikki kentät!", true);
        return;
    }

    const vaihtoehdot = [v1, v2, v3, v4];

    aanestykset.push({
        kysymys,
        vaihtoehdot,
        aanet: Array.from({ length: vaihtoehdot.length }, () => 0),
        kayttajanValinta: null //Mahdollistaa uudelleen äänestyksen
    });

    naytaIlmoitus("Äänestys luotu onnistuneesti");
    tallenna();
    naytaAanestykset();

    //Tyhjennä kentät
    document.getElementById("kysymys").value = "";
    document.getElementById("vaihtoehto1").value = "";
    document.getElementById("vaihtoehto2").value = "";
    document.getElementById("vaihtoehto3").value = "";
    document.getElementById("vaihtoehto4").value = "";
};

// Poisto
function poistaAanestys(index) {
    if (confirm("Haluatko varmasti poistaa tämän äänestyksen?")) {
        aanestykset.splice(index, 1);
        delete uiTila[index];
        tallenna();
        naytaAanestykset();
    }
}

// Tallennus localStorageen
function tallenna() {
    localStorage.setItem("aanestykset", JSON.stringify(aanestykset));
}

// Kirjautuminen
kirjauduNappi.onclick = () => {
    const tunnus = document.getElementById("kayttajatunnus").value.trim();
    const salasana = document.getElementById("salasana").value.trim();

    const loytyi = yllapitajat.find(u => u.username === tunnus && u.password === salasana);

    if (loytyi) {
        yllapitajaKirjautunut = true;
        yllapitajaTyokalut.style.display = "block";
        kirjauduNappi.style.display = "none"
        kirjauduUlosNappi.style.display = "inline-block";
        naytaIlmoitus(`Tervetuloa, ${tunnus}!`);
        naytaAanestykset();
    } else {
        naytaIlmoitus("Väärä käyttäjätunnus tai salasana!", true);
    }
};

kirjauduUlosNappi.onclick = () => {
    yllapitajaKirjautunut = false;
    yllapitajaTyokalut.style.display = "none";
    kirjauduNappi.style.display = "inline-block"
    kirjauduUlosNappi.style.display = "none";
    document.getElementById("kayttajatunnus").value = "";
    document.getElementById("salasana").value = "";
    naytaIlmoitus("Kirjauduttu ulos")
    naytaAanestykset();
};

//Rekisteröinti
document.getElementById("rekisteroi_nappi").onclick = () => {
    const uusiTunnus = document.getElementById("uusi_tunnus").value.trim();
    const uusiSalasana = document.getElementById("uusi_salasana").value.trim();

    if (!uusiTunnus || !uusiSalasana) {
        naytaIlmoitus("Täytä käyttäjätunnus ja salasana!", true);
        return;
    }
    if (yllapitajat.some(u => u.username === uusiTunnus)) {
        naytaIlmoitus("Käyttäjätunnus on jo olemassa!", true);
        return;
    }

    yllapitajat.push({ username: uusiTunnus, password: uusiSalasana });
    tallennaYllapitajat();

    document.getElementById("uusi_tunnus").value = "";
    document.getElementById("uusi_salasana").value = "";

    naytaIlmoitus("Ylläpitäjä rekisteröity onnistuneesti!");
};

document.getElementById("uusi_kayttaja_nappi").onclick = () => {
    //Tyhjennetään tämän selaimen "äänestysmuisti"
    aanestykset.forEach(a => {
        delete a.kayttajanValinta;
    });
    tallenna();
    naytaIlmoitus("Uusi käyttäjä voi nyt äänestää");
    naytaAanestykset();
};

//Ilmoitus
function naytaIlmoitus(teksti, onVirhe = false) {
    const laatikko = document.getElementById("ilmoitus");
    laatikko.textContent = teksti;
    laatikko.className = onVirhe ? "virhe" : "";
    laatikko.style.display = "block";
    setTimeout(() => (laatikko.style.display = "none"), 3000);
}

// Käynnistys
naytaAanestykset();