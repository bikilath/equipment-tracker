document.addEventListener('DOMContentLoaded', () => {
    const availableEquipment = document.getElementById('available-equipment');
    const currentEquipment = document.getElementById('current-equipments');
    const equipmentForm = document.getElementById('equipmentForm');
    const returnBtn = document.getElementById('returnBtn');
    const bookBtn = document.getElementById('bookBtn');
    const calendarEl = document.getElementById('calendar');

    let equipmentList = JSON.parse(localStorage.getItem('equipmentList')) || [
        { name: 'Vacuum Cleaner', image: 'vacuum.jpg' },
        { name: 'Air Dryer', image: 'dryer.jpg' },
        { name: 'Iron', image: 'iron.jpg' },
        { name: 'Mop', image: 'mop.jpg' }
    ];
    let takenEquipment = JSON.parse(localStorage.getItem('takenEquipment')) || [];
    let bookings = JSON.parse(localStorage.getItem('bookings')) || [];

    // Save to local storage
    function saveToLocalStorage() {
        localStorage.setItem('equipmentList', JSON.stringify(equipmentList));
        localStorage.setItem('takenEquipment', JSON.stringify(takenEquipment));
        localStorage.setItem('bookings', JSON.stringify(bookings));
    }

    // Render initial available equipment list
    function renderAvailableEquipment() {
        availableEquipment.innerHTML = '';
        equipmentList.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `<img src="${item.image}" alt="${item.name}"> ${item.name}`;
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

        const equipmentIndex = equipmentList.findIndex(item => item.name.toLowerCase() === equipment.toLowerCase());
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
    returnBtn.addEventListener('click', () => {
        const name = equipmentForm.name.value;
        const room = equipmentForm.room.value;
        const equipment = equipmentForm.equipment.value;
        const returnedTimestamp = new Date().toLocaleString();

        const takenIndex = takenEquipment.findIndex(entry => 
            entry.name === name && entry.room === room && entry.equipment.toLowerCase() === equipment.toLowerCase() && !entry.returnedTimestamp
        );
        if (takenIndex > -1) {
            takenEquipment[takenIndex].returnedTimestamp = returnedTimestamp;
            equipmentList.push({ name: equipment, image: takenEquipment[takenIndex].image });
            saveToLocalStorage();
            renderAvailableEquipment();
            renderTakenEquipment();
            equipmentForm.reset();
        } else {
            alert('No matching taken equipment found or already returned');
        }
    });

    // Handle booking equipment
    bookBtn.addEventListener('click', () => {
        const name = equipmentForm.name.value;
        const room = equipmentForm.room.value;
        const equipment = equipmentForm.equipment.value;
        const bookingDate = event.target.bookingDate.value;
        const time = event.target.time.value;

        const booking = { name, room, equipment, bookingDate, time };
        bookings.push(booking);
        saveToLocalStorage();
        renderCalendar();
        equipmentForm.reset();
    });

    // Render calendar with bookings
    function renderCalendar() {
        $(calendarEl).fullCalendar('destroy');
        $(calendarEl).fullCalendar({
            events: bookings.map(booking => ({
                title: `${booking.equipment} booked by ${booking.name} (Room ${booking.room})`,
                start: `${booking.bookingDate}T${booking.time}`
            }))
        });
    }

    // Initial render
    renderAvailableEquipment();
    renderTakenEquipment();
    renderCalendar();
});
