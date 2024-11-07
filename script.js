// Sample equipment data
let equipmentData = [
    { name: "Vacuum Cleaner", status: "available", user: "", room: "" },
    { name: "Air Dryer", status: "available", user: "", room: "" },
    { name: "Iron", status: "available", user: "", room: "" },
    { name: "Mop", status: "available", user: "", room: "" }
];

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
    displayAvailableEquipment();
    document.getElementById('equipmentForm').addEventListener('submit', handleCheckOut);
    document.getElementById('checkinBtn').addEventListener('click', handleCheckIn);
});

// Display available equipment
function displayAvailableEquipment() {
    const availableEquipmentList = document.getElementById('available-equipment');
    availableEquipmentList.innerHTML = '';
    equipmentData.forEach((equipment) => {
        if (equipment.status === 'available') {
            const li = document.createElement('li');
            li.textContent = equipment.name;
            availableEquipmentList.appendChild(li);
        }
    });
}

// Handle equipment check out
function handleCheckOut(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const room = document.getElementById('room').value;
    const selectedEquipment = document.getElementById('equipment').value;

    const equipment = equipmentData.find(eq => eq.name.toLowerCase().replace(" ", "-") === selectedEquipment);
    if (equipment && equipment.status === 'available') {
        equipment.status = 'checked out';
        equipment.user = name;
        equipment.room = room;
        alert(`${name} from room ${room} has checked out the ${equipment.name}`);
        displayAvailableEquipment();
        displayCurrentCheckOuts();
    } else {
        alert('Selected equipment is not available.');
    }
}

// Handle equipment check in
function handleCheckIn() {
    const name = document.getElementById('name').value;
    const room = document.getElementById('room').value;
    const selectedEquipment = document.getElementById('equipment').value;

    const equipment = equipmentData.find(eq => eq.name.toLowerCase().replace(" ", "-") === selectedEquipment);
    if (equipment && equipment.status === 'checked out' && equipment.user === name && equipment.room === room) {
        equipment.status = 'available';
        equipment.user = '';
        equipment.room = '';
        alert(`${name} has checked in the ${equipment.name}`);
        displayAvailableEquipment();
        displayCurrentCheckOuts();
    } else {
        alert('Check-in action failed. Check your details.');
    }
}

// Display currently checked out equipment
function displayCurrentCheckOuts() {
    const currentEquipmentsList = document.getElementById('current-equipments');
    currentEquipmentsList.innerHTML = '';
    equipmentData.forEach(equipment => {
        if (equipment.status === 'checked out') {
            const li = document.createElement('li');
            li.textContent = `${equipment.name} checked out by ${equipment.user} (Room: ${equipment.room})`;
            currentEquipmentsList.appendChild(li);
        }
    });
}
