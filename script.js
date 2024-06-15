document.getElementById('bankersForm').addEventListener('submit', function (e) {
    e.preventDefault();
    calculateSafeSequence();
});

function generateMatrices() {
    const numProcesses = document.getElementById('numProcesses').value;
    const numResources = document.getElementById('numResources').value;
    const matricesDiv = document.getElementById('matrices');

    matricesDiv.innerHTML = '';

    // Allocation Matrix
    matricesDiv.innerHTML += '<h3>Allocation Matrix</h3>';
    for (let i = 0; i < numProcesses; i++) {
        for (let j = 0; j < numResources; j++) {
            matricesDiv.innerHTML += `<input type="number" id="alloc_${i}_${j}" min="0" required>`;
        }
        matricesDiv.innerHTML += '<br>';
    }

    // Max Matrix
    matricesDiv.innerHTML += '<h3>Max Matrix</h3>';
    for (let i = 0; i < numProcesses; i++) {
        for (let j = 0; j < numResources; j++) {
            matricesDiv.innerHTML += `<input type="number" id="max_${i}_${j}" min="0" required>`;
        }
        matricesDiv.innerHTML += '<br>';
    }

    // Available Resources
    matricesDiv.innerHTML += '<h3>Available Resources</h3>';
    for (let i = 0; i < numResources; i++) {
        matricesDiv.innerHTML += `<input type="number" id="avail_${i}" min="0" required>`;
    }
    matricesDiv.innerHTML += '<br>';
}

function calculateSafeSequence() {
    const numProcesses = parseInt(document.getElementById('numProcesses').value);
    const numResources = parseInt(document.getElementById('numResources').value);

    const alloc = [];
    const max = [];
    const avail = [];

    for (let i = 0; i < numProcesses; i++) {
        alloc[i] = [];
        max[i] = [];
        for (let j = 0; j < numResources; j++) {
            alloc[i][j] = parseInt(document.getElementById(`alloc_${i}_${j}`).value);
            max[i][j] = parseInt(document.getElementById(`max_${i}_${j}`).value);
        }
    }

    for (let i = 0; i < numResources; i++) {
        avail[i] = parseInt(document.getElementById(`avail_${i}`).value);
    }

    const f = Array(numProcesses).fill(0);
    const ans = [];
    let ind = 0;
    const need = Array.from({ length: numProcesses }, () => Array(numResources).fill(0));

    for (let i = 0; i < numProcesses; i++) {
        for (let j = 0; j < numResources; j++) {
            need[i][j] = max[i][j] - alloc[i][j];
        }
    }

    let y = 0;
    for (let k = 0; k < numProcesses; k++) {
        for (let i = 0; i < numProcesses; i++) {
            if (f[i] === 0) {
                let flag = 0;
                for (let j = 0; j < numResources; j++) {
                    if (need[i][j] > avail[j]) {
                        flag = 1;
                        break;
                    }
                }

                if (flag === 0) {
                    ans[ind] = i;
                    ind++;
                    for (y = 0; y < numResources; y++) {
                        avail[y] += alloc[i][y];
                    }
                    f[i] = 1;
                }
            }
        }
    }

    let flag = 1;
    for (let i = 0; i < numProcesses; i++) {
        if (f[i] === 0) {
            flag = 0;
            document.getElementById('result').innerHTML = 'The following system is not safe';
            break;
        }
    }

    if (flag === 1) {
        let safeSequence = 'Following is the SAFE Sequence:<br>';
        for (let i = 0; i < numProcesses - 1; i++) {
            safeSequence += ` P${ans[i]} ->`;
        }
        safeSequence += ` P${ans[numProcesses - 1]}`;
        document.getElementById('result').innerHTML = safeSequence;
    }
}
