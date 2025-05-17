const apiURL = 'https://jsonplaceholder.typicode.com/users';
let contactsData = [];  // <-- global state

// Fetch once and store locally
async function fetchContacts() {
  try {
    const res = await fetch(apiURL);
    if (!res.ok) throw new Error(`Error ${res.status}`);
    contactsData = await res.json();
    displayContacts(contactsData);
  } catch (err) {
    console.error('Fetch failed:', err);
    alert('Could not load contacts.');
  }
}

// Render from our local array
function displayContacts(list) {
  const ul = document.getElementById('contacts-list');
  ul.innerHTML = '';
  list.forEach(c => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${c.name} – ${c.phone || '(no phone)'}</span>
      <div class="actions">
        <button onclick="editContact(${c.id})">Edit</button>
        <button onclick="deleteContact(${c.id})">Delete</button>
      </div>`;
    ul.appendChild(li);
  });
}

// Add: push to both server (fake) and local
async function addContact() {
  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  if (!name || !phone) return alert('Enter both fields.');

  // Send to server (won’t persist on JSONPlaceholder)
  await fetch(apiURL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, phone })
  });

  // Locally assign a temporary id
  const newId = contactsData.length
    ? Math.max(...contactsData.map(c => c.id)) + 1
    : 1;
  const newContact = { id: newId, name, phone };
  contactsData.push(newContact);

  // Log the new contact to the console
  console.log('New contact added:', newContact);

  displayContacts(contactsData);

  // Clear the input fields
  document.getElementById('name').value = '';
  document.getElementById('phone').value = '';
}

// Edit: prompt and update local array
function editContact(id) {
  const contact = contactsData.find(c => c.id === id);
  const name = prompt('Name:', contact.name);
  const phone = prompt('Phone:', contact.phone);
  if (name == null || phone == null) return;

  // Send to server (fake)
  fetch(`${apiURL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, phone })
  }).catch(console.error);

  // Update locally
  contact.name = name.trim();
  contact.phone = phone.trim();
  displayContacts(contactsData);
}

// Delete: remove from local array
function deleteContact(id) {
  if (!confirm('Delete this contact?')) return;

  // Send to server (fake)
  fetch(`${apiURL}/${id}`, { method: 'DELETE' }).catch(console.error);

  // Remove locally
  contactsData = contactsData.filter(c => c.id !== id);
  displayContacts(contactsData);
}

// Search: filter the local array
function searchContact() {
  const q = document.getElementById('search').value.toLowerCase();
  const filtered = contactsData.filter(c =>
    c.name.toLowerCase().includes(q) ||
    (c.phone && c.phone.includes(q))
  );
  displayContacts(filtered);
}

// Wire up input listener
document.getElementById('search')
        .addEventListener('input', searchContact);

// Initial load
document.addEventListener('DOMContentLoaded', fetchContacts);

