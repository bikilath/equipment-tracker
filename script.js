document.addEventListener('DOMContentLoaded', () => {
    const availableEquipment = document.getElementById('available-equipment');
    const currentEquipment = document.getElementById('current-equipments');
    const equipmentForm = document.getElementById('equipmentForm');
    const checkinBtn = document.getElementById('checkinBtn');

    let equipmentList = JSON.parse(localStorage.getItem('equipmentList')) || ['Vacuum Cleaner', 'Air Dryer', 'Iron', 'Mop'];
    let takenEquipment = JSON.parse(localStorage.getItem('takenEquipment')) || [];

    // Save to local storage
    function saveToLocalStorage() {
        localStorage.setItem('equipmentList', JSON.stringify(equipmentList));
        localStorage.setItem('takenEquipment', JSON.stringify(takenEquipment));
    }

    // Render initial available equipment list
    function renderAvailableEquipment() {
        availableEquipment.innerHTML = '';
        equipmentList.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            availableEquipment.appendChild(li);
        });
    }

    // Render current taken equipment list
    function renderTakenEquipment() {
        currentEquipment.innerHTML = '';
        takenEquipment.forEach(entry => {
            const li = document.createElement('li');
            li.textContent = `${entry.equipment} - Taken by ${entry.name} (Room ${entry.room}) on ${entry.takenTimestamp}`;
            if (entry.returnedTimestamp) {
                li.textContent += ` - Returned on ${entry.returnedTimestamp}`;
            }
            currentEquipment.appendChild(li);
        });
    }

    // Handle taking equipment
    equipmentForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = event.target.name.value;
        const room = event.target.room.value;
        const equipment = event.target.equipment.value;
        const takenTimestamp = new Date().toLocaleString();

        const equipmentIndex = equipmentList.findIndex(item => item.toLowerCase() === equipment.toLowerCase());
        if (equipmentIndex > -1) {
            equipmentList.splice(equipmentIndex, 1);
            takenEquipment.push({ name, room, equipment, takenTimestamp, returnedTimestamp: null });
            saveToLocalStorage();
            renderAvailableEquipment();
            renderTakenEquipment();
            equipmentForm.reset();
        } else {
            alert('Equipment not available for taking');
        }
    });

    // Handle returning equipment
    checkinBtn.addEventListener('click', () => {
        const name = equipmentForm.name.value;
        const room = equipmentForm.room.value;
        const equipment = equipmentForm.equipment.value;
        const returnedTimestamp = new Date().toLocaleString();

        const takenIndex = takenEquipment.findIndex(entry => 
            entry.name === name && entry.room === room && entry.equipment.toLowerCase() === equipment.toLowerCase() && !entry.returnedTimestamp
        );
        if (takenIndex > -1) {
            takenEquipment[takenIndex].returnedTimestamp = returnedTimestamp;
            equipmentList.push(equipment);
            saveToLocalStorage();
            renderAvailableEquipment();
            renderTakenEquipment();
            equipmentForm.reset();
        } else {
            alert('No matching taken equipment found or already returned');
        }
    });

    // Initial render
    renderAvailableEquipment();
    renderTakenEquipment();
});
