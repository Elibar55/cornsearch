document.getElementById('loginButton').addEventListener('click', function() {
    const username = document.getElementById('username').value;
    if (username) {
        document.getElementById('user-selection').classList.add('hidden');
        document.getElementById('escalations-section').classList.remove('hidden');
        loadEscalations();
        document.getElementById('escalatedBy').value = username; // Set the username in the form
    } else {
        document.getElementById('error-message').innerText = 'Por favor, ingresa un nombre de usuario.';
    }
});

function loadEscalations() {
    fetch('/api/escalations')
        .then(response => {
            if (!response.ok) throw new Error('Error loading escalations');
            return response.json();
        })
        .then(data => {
            const list = document.getElementById('escalations-list');
            list.innerHTML = '';
            Object.keys(data).forEach(caseNumber => {
                const escalation = data[caseNumber];
                const listItem = document.createElement('div');
                listItem.innerText = `${caseNumber}: ${escalation.chatName}`;
                listItem.onclick = () => loadEscalation(caseNumber);
                list.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error loading escalations:', error));
}

function loadEscalation(caseNumber) {
    fetch(`/api/escalations/${caseNumber}`)
        .then(response => {
            if (!response.ok) {
                alert('No se encontró la escalación.');
                return;
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('caseNumber').value = caseNumber;
            document.getElementById('chatName').value = data.chatName;
            document.getElementById('escalatedBy').value = data.escalatedBy;
            document.getElementById('description').value = data.description;
            document.getElementById('mco').value = data.mco;
            document.getElementById('csamIM').value = data.csamIM;
            document.getElementById('status').value = data.status;
            document.getElementById('notes').value = data.notes;
            document.getElementById('escalation-details').classList.remove('hidden');
            document.getElementById('previous-notes').classList.add('hidden'); // Hide previous notes initially
        })
        .catch(error => console.error('Error loading escalation:', error));
}

function newEscalation() {
    // Clear the input fields
    document.getElementById('caseNumber').value = '';
    document.getElementById('chatName').value = '';
    document.getElementById('description').value = '';
    document.getElementById('mco').value = '';
    document.getElementById('csamIM').value = '';
    document.getElementById('status').value = 'ongoing';
    document.getElementById('notes').value = '';
    document.getElementById('escalation-details').classList.remove('hidden'); // Show the escalation details
}

function saveEscalation() {
    const caseNumber = document.getElementById('caseNumber').value;
    const newEscalationData = {
        chatName: document.getElementById('chatName').value,
        escalatedBy: document.getElementById('escalatedBy').value,
        description: document.getElementById('description').value,
        mco: document.getElementById('mco').value,
        csamIM: document.getElementById('csamIM').value,
        status: document.getElementById('status').value,
        notes: document.getElementById('notes').value,
    };

    fetch(`/api/escalations/${caseNumber}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEscalationData),
    })
        .then(response => {
            if (!response.ok) throw new Error('Error saving escalation');
            return response.json();
        })
        .then(data => {
            alert(data.message);
            loadEscalations(); // Reload escalations after saving
        })
        .catch(error => console.error('Error saving escalation:', error));
}

function searchEscalation() {
    const caseNumber = document.getElementById('searchCaseNumber').value;
    if (caseNumber) {
        loadEscalation(caseNumber);
    } else {
        alert('Por favor, ingresa un número de caso para buscar.');
    }
}

function deleteEscalation() {
    const caseNumber = document.getElementById('caseNumber').value;
    if (!caseNumber) {
        alert('No hay número de caso para eliminar.');
        return;
    }

    fetch(`/api/escalations/${caseNumber}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (!response.ok) throw new Error('Error deleting escalation');
            return response.json();
        })
        .then(data => {
            alert(data.message);
            loadEscalations(); // Reload escalations after deleting
            document.getElementById('escalation-details').classList.add('hidden'); // Hide details after deletion
        })
        .catch(error => console.error('Error deleting escalation:', error));
}

function displayPreviousNotes() {
    const notesList = document.getElementById('notes-list');
    const notes = document.getElementById('notes').value.split('\n'); // Split notes by newline

    notesList.innerHTML = ''; // Clear existing notes
    notes.forEach(note => {
        const noteItem = document.createElement('div');
        noteItem.innerText = note;
        notesList.appendChild(noteItem);
    });

    document.getElementById('previous-notes').classList.remove('hidden'); // Show previous notes section
}
