# Ordinarie Tentamen Backend

Du ska implementera ett REST API enligt specifikationen nedan. Det existerar tester för API:et som du kan köra för att verifiera ditt API. Du kör dem med `npm test` (servern behöver vara igång för att de ska funka). Titta även igenom testfilen (test/test.js) för att få mer information om hur API:et ska se ut (det är förväntat att du förstår allt i test/test.js och skulle kunna bygga implementationen enbart med den informationen). Datan skickas alltid som JSON.


API:et ska stödja en typ av resurs i formatet `{name: string, amount: number}`. Resurserna behöver bara sparas i minne.

För att få Godkänt på tentamen måste du ha implementera minst 5 av följande punkter (inkl den obligatoriska).

Routsen för API:et

* DELETE `/` - Ta bort alla existerande resurser **OBLIGATORISK**   
* DELETE `/:name` - Ta bort en specifik resurs
* GET `/` - Hämta alla existerande resurser, måste stödja pagination. Titta i testerna för info om hur querysträngen ska se ut.
* GET `/:name` - Hämta en resurs på dess namn
* POST `/` - Skapa en ny resurs
* POST `/` kan stödja att när vi postar en ny resurs med samma namn som en existerande, så summeras deras amount värden och sparas.
* PUT `/:name` - Skriva över en ny resurs


För att få Väl Godkänt på tentamen behöver **alla** punkter ovan (inte bara minst 5) samt alla följande punkter implementeras:

* Logging middleware - Logga alla anrop som sker till servern i formatet (`METHOD PATH STATUS RESPONSE_TIME_IN_MS`), du måste implementera den själv
* Implementera din egna JSON parsing middleware (du får lov att använda `JSON.parse`)
* Använda god struktur i ditt API för routes samt statuskoder
* Man ska med en miljövariabel kunna berätta för servern vilken port den ska köra på


## Inlämning

Inlämningen får ske tidigast 10:00 och senast 13:00. Inlämningen ska ske på pingpong, ladda upp alla filer du har skapat eller ändrat i. Lägg dem under "Obligatorisk Tentamen 1" som finns på pingpong. Dubbelkolla att du inte har glömt något! Lämna gärna in tentan som en zip eller tar fil. Zippa då gärna hela mappen och lämna in den direkt. Om du inte har zip/rar/tar eller något liknande kan du lämna in alla .js filerna. Du behöver då ladda upp filerna en och en på pingpong.



