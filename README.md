
# Pikaset hätäset kätyset ohjeet

  

### Mitä nää vähintään tarviit:

- VScode
-  `Dev Containers` vscoden marketplacesta
- Docker tai docker desktop

## Vaihe 1 (kloonaa branchi ja säädä .env kuntoon):

- Avaa terminal

- Kloonaile branchi `git clone -b testailu https://github.com/iot-roskisprojekti/Roskisprojekti.git`

- Nimeä `.env.pohja -> .env` (tee tämä ennen kun avaat projektin dev containerina vscodessa, muuten kaput)

- Avaa `.env` ja aseta vapaavalintainen salasana kohtaan `DB_PASS=`, esim `DB_PASS=päähänsattuu`


## Vaihe 2 (VScode säätö):
- Asenna `Dev Containers` marketplacesta jos ei vielä asennettuna
- Avaa gitistä kloonattu branchi vscodessa (eli se kansio koneellasi) 
- Jos `Dev Containers` asennettuna, niin vscode kysyy oikeassa alareunassa, että tahdotko käynnistää dev containerin. Älä hättäile. Varmista että olet nimennyt`.env.pohja -> .env`
- Valitse oikean alareunan pop-upista `Reopen in Container`
- Jos pop-up on liian nopea tai ei näy ollenkaan, niin paina `F1` kirjoita `Dev Containers: Reopen in container`. Ensimmäisellä kerralla vscode buildailee ympäristön kasaan. Odota rauhassa ja ihmettele vaikka logeja.

## Vaihe 3 (ympäristö kasassa):
- Vscodesta, Dev Containerin sisällä `Run -> Run without debugging` käynnistää ainakin omalla koneella pelkän backendin. Tämän jälkeen vscoden alareunan toolbaariin tulee näkymä `Launch: ......tekstiä....`, josta voi valita käynnistää myös erikseen frontendin, backendin tai kaiken kerralla. 




