function Ekszerek() {
    let ekszerHTML = "";
    let ekszerLista = document.getElementById("ekszer-lista");
    let xhr = new XMLHttpRequest();
  
    xhr.open('GET', 'http://localhost:3000/ekszerek', true);

    xhr.onload = function() {

        if (xhr.status === 200) {
            let ekszerek = JSON.parse(xhr.responseText); 

            csokik.forEach(function(ekszer) {
                csokiHTML += `
                    <div class="col">
                        <div class="${ekszer.raktaron ? "bg-success" : "bg-danger"} m-2 p-2">
                            <h2>${ekszer.nev}</h2>
                            <p>A termék ára: ${ekszer.ara} Ft</p>
                            <button class="btn btn-danger" onclick="torles(${ekszer.id})">Törlés</button>
                            <button class="btn btn-primary" onclick="modositas(${ekszer.id})">Módosítás</button>
                        </div>
                    </div>
                `;
            });

            ekszerLista.innerHTML = eskzerHTML;
        } else {
            console.error('Hiba történt az adatok betöltésekor:', xhr.status, xhr.statusText);
           
        }
    };

    xhr.send();
}

document.getElementById('ujtermek').onclick = function () {
    let newFormHTML = `
        <h4>Áru hozzáadása:</h4>
        <form id="uj-csoki" class="p-5">
            <label class="w-100">
                <h5>Termék neve:</h5>
                <input class="form-control" type="text" name="nev">
            </label>
            <label class="w-100">
                <h5>Termék ára:</h5>
                <input class="form-control" type="number" name="ara">
            </label>
            <label>
                <h5>Van raktáron?</h5> 
                <input type="checkbox" name="raktaron">
            </label>
            <br>
            <button class="btn btn-success" type="submit">Küldés</button>
        </form>
    `;

    let ujElem = document.getElementById('uj');
    ujElem.innerHTML = newFormHTML;
    document.getElementById('ujtermek').style.display = 'none';

    let ujekszerForm = document.getElementById("uj-ekszer");
    ujekszerForm.onsubmit = function (event) {
        event.preventDefault();
        let nev = event.target.elements.nev.value;
        let ara = event.target.elements.ara.value;
        let raktaron = event.target.elements.raktaron.checked;

        let xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:3000/csokik', true);
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xhr.onload = function() {
            if (xhr.status === 201) {
                renderCsokik();
                ujElem.innerHTML = '';
                document.getElementById('ujtermek').style.display = 'block';
            } else {
                console.error('Hiba történt az adatok létrehozása során:', xhr.status, xhr.statusText);
            }
        };

        xhr.send(JSON.stringify({
            nev: nev,
            ara: ara,
            raktaron: raktaron
        }));
    };
};

function torles(id) {
    let xhr = new XMLHttpRequest();
    xhr.open('DELETE', 'http://localhost:3000/csokik/' + id, true);

    xhr.onload = function() {
        if (xhr.status === 200 || xhr.status === 204) {
            Ekszerek();
        } else {
            console.error('Hiba történt a törlés során:', xhr.status, xhr.statusText);
        }
    };

    xhr.send();
}

function modositas(id) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:3000/ekszerek/' + id, true);

    xhr.onload = function() {
        if (xhr.status === 200) {
            let ekszer = JSON.parse(xhr.responseText);
            let modositasFormHTML = `
                <h4>Termék módosítása:</h4>
                <form id="modositas-csoki" class="p-5">
                    <label class="w-100">
                        <h5>Termék neve:</h5>
                        <input class="form-control" type="text" name="nev" value="${ekszer.nev}">
                    </label>
                    <label class="w-100">
                        <h5>Termék ára:</h5>
                        <input class="form-control" type="number" name="ara" value="${ekszer.ara}">
                    </label>
                    <label>
                        <h5>Van raktáron?</h5> 
                        <input type="checkbox" name="raktaron" ${ekszer.raktaron ? 'checked' : ''}>
                    </label>
                    <br>
                    <button class="btn btn-primary" type="submit">Mentés</button>
                </form>
            `;

            let szerkesztesElem = document.getElementById('szerkesztes');
            szerkesztesElem.innerHTML = modositasFormHTML;
            document.getElementById('ujtermek').style.display = 'none';

            let modositasCsokiForm = document.getElementById("modositas-ekszer");
            modositasCsokiForm.onsubmit = function (event) {
                event.preventDefault();
                let nev = event.target.elements.nev.value;
                let ara = event.target.elements.ara.value;
                let raktaron = event.target.elements.raktaron.checked;

                let xhr = new XMLHttpRequest();
                xhr.open('PUT', 'http://localhost:3000/ekszerek/' + id, true);
                xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

                xhr.onload = function() {
                    if (xhr.status === 200) {
                        Ekszerek();
                        szerkesztesElem.innerHTML = '';
                        document.getElementById('ujtermek').style.display = 'block';
                    } else {
                        console.error('Hiba történt az adatok módosítása során:', xhr.status, xhr.statusText);
                    }
                };

                xhr.send(JSON.stringify({
                    nev: nev,
                    ara: ara,
                    raktaron: raktaron
                }));
            }
        } else {
            console.error('Hiba történt a módosítás során:', xhr.status, xhr.statusText);
        }
    };

    xhr.send();
}

window.onload = Ekszerek;