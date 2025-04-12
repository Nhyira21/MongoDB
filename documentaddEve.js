document.addEventListener('DOMContentLoaded', () => {
  // ========= Sidebar Toggle =========
  // Toggles the sidebar's visibility when the toggle button is clicked
  const sidebar = document.querySelector('.sidebar');
  const toggleButton = document.querySelector('.toggle-sidebar');

  if (toggleButton) {
    toggleButton.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }

  // ========= Dropdowns (User Profile and Notifications) =========
  // Generic function to toggle any dropdown by class name
  function toggleDropdown(dropdownClass) {
    const dropdown = document.querySelector(dropdownClass);
    if (dropdown) {
      dropdown.classList.toggle('open');
    }
  }

  // User dropdown: triggered by clicking the avatar
  const userAvatar = document.querySelector('.user-avatar');
  if (userAvatar) {
    userAvatar.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevents the click from closing the dropdown immediately
      toggleDropdown('.user-dropdown');
    });
  }

  // Notification dropdown: triggered by clicking the bell icon
  const notificationBell = document.querySelector('.notification-bell');
  if (notificationBell) {
    notificationBell.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleDropdown('.notification-dropdown');
    });
  }

  // Close all dropdowns when clicking outside
  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown').forEach(dropdown => {
      dropdown.classList.remove('open');
    });
  });

  // ========= Modals =========
  // Function to open a modal by ID
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('open');
    }
  }

  // Function to close a modal by ID
  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('open');
    }
  }

  // Close modals when clicking outside (on the modal background)
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
      closeModal(e.target.id);
    }
  });

  // Close all open modals with the Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal.open').forEach(modal => {
        closeModal(modal.id);
      });
    }
  });

  // Attach close functionality to all modal close buttons
  document.querySelectorAll('.modal .close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      closeModal(btn.closest('.modal').id);
    });
  });

  // ========= Create New Modal =========
  // Opens the "create new" modal when the button is clicked
  const createNewButton = document.querySelector('.create-new');
  if (createNewButton) {
    createNewButton.addEventListener('click', () => {
      openModal('create-new-modal');
    });
  }

  // ========= Notification Details Modals =========
  // Opens a modal when a notification item is clicked, using its data-modal attribute
  document.querySelectorAll('.notification-item').forEach(item => {
    item.addEventListener('click', () => {
      const modalId = item.getAttribute('data-modal');
      if (modalId) {
        openModal(modalId);
      }
    });
  });

  // ========= Quick Action Buttons =========
  // Opens modals linked to action buttons via data-modal attributes
  document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-modal');
      if (modalId) {
        openModal(modalId);
      }
    });
  });

  // ========= Statistical Cards Animation (Optional) =========
  // Updates a card's value and triggers a brief animation
  function updateCardData(cardId, newValue) {
    const card = document.getElementById(cardId);
    if (card) {
      card.querySelector('.card-value').textContent = newValue;
      card.classList.add('animate');
      setTimeout(() => card.classList.remove('animate'), 500); // Animation lasts 0.5s
    }
  }

  // Example usage of the stats card update (remove or replace as needed):
  // updateCardData('stats-card-1', '42');
});