<!DOCTYPE html>
<html lang="en" data-theme="light">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{% block title %}Dashboard{% endblock %}</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        /* Reset and Base Styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        /* Theme Variables */
        :root {
            --bg-color: #e0e8f5;
            --text-color: #333;
            --sidebar-bg: white;
            --header-bg: white;
            --content-bg: white;
            --card-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
            --hover-color: rgba(74, 134, 247, 0.08);
            --sidebar-text: #8c8c8c;
            --active-color: #4a86f7;
            --search-bg: #f8f8f8;
            --border-color: #e0e0e0;
            --icon-color: #8c8c8c;
            --logout-color: #e74c3c;
            --logo-color: #f8b627;
            --notification-bg: #f8b627;
            --transition: all 0.3s ease;
        }

        /* Dark Theme */
        html[data-theme='dark'] {
            --bg-color: #1a1a2e;
            --text-color: #e0e0e0;
            --sidebar-bg: #16213e;
            --header-bg: #16213e;
            --content-bg: #16213e;
            --card-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            --hover-color: rgba(74, 134, 247, 0.15);
            --sidebar-text: #a0a0a0;
            --active-color: #4a86f7;
            --search-bg: #0f3460;
            --border-color: #2a2a40;
            --icon-color: #a0a0a0;
            --logout-color: #ff6b6b;
            --logo-color: #f8b627;
            --notification-bg: #f8b627;
        }

        body {
            background-color: var(--bg-color);
            color: var(--text-color);
            min-height: 100vh;
            display: flex;
            transition: var(--transition);
        }

        /* Sidebar Styles */
        .sidebar {
            width: 240px;
            background-color: var(--sidebar-bg);
            display: flex;
            flex-direction: column;
            padding: 20px 0;
            box-shadow: 2px 0 10px rgba(0, 0, 0, 0.05);
            position: relative;
            z-index: 10;
            transition: width 0.3s ease, background-color 0.3s ease;
        }

        .sidebar.collapsed {
            width: 80px;
        }

        .logo {
            color: var(--logo-color);
            font-size: 26px;
            margin-bottom: 40px;
            padding: 0 25px;
            display: flex;
            align-items: center;
        }

        .logo-text {
            margin-left: 15px;
            font-weight: bold;
            transition: opacity 0.3s ease, visibility 0.3s ease;
        }

        .sidebar.collapsed .logo-text {
            opacity: 0;
            visibility: hidden;
            display: none;
        }

        .nav-items {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .nav-item {
            display: flex;
            align-items: center;
            padding: 12px 25px;
            color: var(--sidebar-text);
            cursor: pointer;
            transition: all 0.3s;
            text-decoration: none;
        }

        .nav-item:hover, .nav-item.active {
            color: var(--active-color);
            background-color: var(--hover-color);
        }

        .nav-item.active {
            border-left: 3px solid var(--active-color);
        }

        .nav-icon {
            font-size: 18px;
            width: 24px;
            text-align: center;
        }

        .nav-text {
            margin-left: 15px;
            font-size: 15px;
            white-space: nowrap;
            transition: opacity 0.3s ease, visibility 0.3s ease;
        }

        .sidebar.collapsed .nav-text {
            opacity: 0;
            visibility: hidden;
            display: none;
        }

        .logout-button {
            margin-top: auto;
            margin-bottom: 20px;
            padding: 12px 25px;
            display: flex;
            align-items: center;
            color: var(--logout-color);
            cursor: pointer;
            transition: background-color 0.3s;
            text-decoration: none;
        }

        .logout-button:hover {
            background-color: rgba(231, 76, 60, 0.08);
        }

        .logout-text {
            margin-left: 15px;
            font-size: 15px;
            transition: opacity 0.3s ease, visibility 0.3s ease;
        }

        .sidebar.collapsed .logout-text {
            opacity: 0;
            visibility: hidden;
            display: none;
        }

        .toggle-sidebar {
            position: absolute;
            top: 20px;
            right: -12px;
            background-color: var(--sidebar-bg);
            border-radius: 50%;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            cursor: pointer;
            z-index: 20;
            transition: background-color 0.3s ease;
        }

        /* Main Content Area */
        .main-container {
            flex: 1;
            display: flex;
            flex-direction: column;
            padding: 20px;
            overflow-y: auto;
            transition: margin-left 0.3s ease;
        }

        /* Header */
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
            background-color: var(--header-bg);
            padding: 15px 20px;
            border-radius: 12px;
            box-shadow: var(--card-shadow);
            transition: background-color 0.3s ease, box-shadow 0.3s ease;
        }

        .search-bar {
            background-color: var(--search-bg);
            border-radius: 20px;
            padding: 8px 15px;
            width: 300px;
            display: flex;
            align-items: center;
        }

        .search-bar input {
            border: none;
            background: transparent;
            outline: none;
            width: 100%;
            padding-left: 8px;
            font-size: 14px;
            color: var(--text-color);
        }

        .search-bar i {
            color: var(--icon-color);
        }

        .date-display {
            background-color: var(--search-bg);
            border-radius: 20px;
            padding: 8px 15px;
            font-size: 14px;
            color: var(--text-color);
        }

        .date-display i {
            color: var(--icon-color);
            margin-right: 5px;
        }

        .user-profile {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .notification-bell {
            color: var(--icon-color);
            position: relative;
            cursor: pointer;
            font-size: 18px;
        }

        .notification-count {
            position: absolute;
            top: -5px;
            right: -8px;
            background-color: var(--notification-bg);
            color: white;
            border-radius: 50%;
            width: 16px;
            height: 16px;
            font-size: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .profile-area {
            display: flex;
            align-items: center;
            gap: 10px;
            cursor: pointer;
        }

        .profile-pic {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background-color: var(--logo-color);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
        }

        .user-info {
            display: flex;
            flex-direction: column;
        }

        .user-name {
            font-size: 14px;
            font-weight: 500;
        }

        .user-role {
            font-size: 12px;
            color: var(--sidebar-text);
        }

        /* Theme toggle button */
        .theme-toggle {
            background-color: var(--search-bg);
            border-radius: 20px;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }

        .theme-toggle i {
            color: var(--icon-color);
            font-size: 18px;
        }

        /* Content Area */
        .content {
            background-color: var(--content-bg);
            border-radius: 12px;
            padding: 25px;
            box-shadow: var(--card-shadow);
            transition: background-color 0.3s ease, box-shadow 0.3s ease;
        }

        /* Responsive Design */
        @media (max-width: 1100px) {
            .sidebar {
                width: 80px;
            }
            
            .logo-text, .nav-text, .logout-text {
                opacity: 0;
                visibility: hidden;
                display: none;
            }
            
            .toggle-sidebar {
                display: none;
            }

            .user-info {
                display: none;
            }
        }

        @media (max-width: 768px) {
            .search-bar {
                width: 180px;
            }
            
            .date-display {
                display: none;
            }
        }

        @media (max-width: 576px) {
            .header {
                flex-wrap: wrap;
                gap: 10px;
            }
            
            .search-bar {
                order: 3;
                width: 100%;
            }
        }
    </style>
</head>

<body>
    <!-- Sidebar -->
    <aside class="sidebar">
        <div class="toggle-sidebar">
            <i class="fas fa-chevron-left" id="sidebar-toggle-icon"></i>
        </div>
        <div class="logo">
            <i class="fas fa-bolt"></i>
            <span class="logo-text">ToyForge</span>
        </div>
        <div class="nav-items">
            <a href="/" class="nav-item active">
                <i class="fas fa-th-large nav-icon"></i>
                <span class="nav-text">Dashboard</span>
            </a>
            <a href="/products" class="nav-item">
                <i class="fas fa-box nav-icon"></i>
                <span class="nav-text">Products</span>
            </a>
            <a href="/categories" class="nav-item">
                <i class="fas fa-tags nav-icon"></i>
                <span class="nav-text">Categories</span>
            </a>
            <a href="/reports" class="nav-item">
                <i class="fas fa-chart-line nav-icon"></i>
                <span class="nav-text">Sales Reports</span>
            </a>
            <a href="/bulk-import" class="nav-item">
                <i class="fas fa-file-import nav-icon"></i>
                <span class="nav-text">Bulk Import</span>
            </a>
            <a href="/users" class="nav-item admin-only">
                <i class="fas fa-users nav-icon"></i>
                <span class="nav-text">Users</span>
            </a>
            <a href="/settings" class="nav-item">
                <i class="fas fa-cog nav-icon"></i>
                <span class="nav-text">Settings</span>
            </a>
        </div>
        <a href="/logout" class="logout-button">
            <i class="fas fa-sign-out-alt nav-icon"></i>
            <span class="logout-text">Logout</span>
        </a>
    </aside>

    <!-- Main Content Area -->
    <main class="main-container">
        <!-- Header -->
        <header class="header">
            <div class="search-bar">
                <i class="fas fa-search"></i>
                <input type="text" placeholder="Search...">
            </div>

            <div class="date-display">
                <i class="far fa-calendar-alt"></i>
                <span id="current-date">3 August, 2023</span>
            </div>

            <div class="user-profile">
                <!-- Theme Toggle Button -->
                <div class="theme-toggle" id="theme-toggle">
                    <i class="fas fa-moon" id="theme-icon"></i>
                </div>
                
                <div class="notification-bell">
                    <i class="far fa-bell"></i>
                    <div class="notification-count">2</div>
                </div>
                
                <div class="profile-area">
                    <div class="profile-pic">
                        <span id="user-initial">S</span>
                    </div>
                    <div class="user-info">
                        <span class="user-name" id="user-name">Sarah</span>
                        <span class="user-role" id="user-role">Admin</span>
                    </div>
                </div>
            </div>
        </header>

        <!-- Content Block -->
        <div class="content">
            {% block content %}
            <!-- Page specific content will be inserted here -->
            {% endblock %}
        </div>
    </main>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Set user information
            // In production, this would come from your Flask backend
            const userName = "{{ current_user.name if current_user else 'Guest' }}";
            const userRole = "{{ current_user.role if current_user else 'Visitor' }}";
            const userInitial = userName ? userName[0] : 'G';
            
            document.getElementById('user-name').textContent = userName;
            document.getElementById('user-role').textContent = userRole;
            document.getElementById('user-initial').textContent = userInitial;

            // Display current date
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const today = new Date();
            const currentDate = document.getElementById('current-date');
            if (currentDate) {
                currentDate.textContent = today.toLocaleDateString('en-US', options);
            }

            // Toggle sidebar
            const sidebar = document.querySelector('.sidebar');
            const toggleBtn = document.querySelector('.toggle-sidebar');
            const toggleIcon = document.getElementById('sidebar-toggle-icon');
            
            if (toggleBtn) {
                toggleBtn.addEventListener('click', function() {
                    sidebar.classList.toggle('collapsed');
                    if (sidebar.classList.contains('collapsed')) {
                        toggleIcon.classList.remove('fa-chevron-left');
                        toggleIcon.classList.add('fa-chevron-right');
                    } else {
                        toggleIcon.classList.remove('fa-chevron-right');
                        toggleIcon.classList.add('fa-chevron-left');
                    }
                });
            }

            // Active navigation item
            const navItems = document.querySelectorAll('.nav-item');
            const currentPath = window.location.pathname;
            
            navItems.forEach(item => {
                const href = item.getAttribute('href');
                if (href === currentPath || (href === '/' && currentPath === '')) {
                    navItems.forEach(i => i.classList.remove('active'));
                    item.classList.add('active');
                }
                
                item.addEventListener('click', function() {
                    navItems.forEach(i => i.classList.remove('active'));
                    this.classList.add('active');
                });
            });

            // Check if user is admin for admin-only items
            // In production, this would be determined by the backend
            const isAdmin = userRole === 'Admin'; 
            const adminOnlyItems = document.querySelectorAll('.admin-only');
            
            adminOnlyItems.forEach(item => {
                if (!isAdmin) {
                    item.style.display = 'none';
                }
            });
            
            // Notification functionality
            const notificationBell = document.querySelector('.notification-bell');
            if (notificationBell) {
                notificationBell.addEventListener('click', function() {
                    alert('Notifications clicked - you would show a dropdown here');
                });
            }
            
            // Profile picture functionality
            const profileArea = document.querySelector('.profile-area');
            if (profileArea) {
                profileArea.addEventListener('click', function() {
                    alert('Profile clicked - you would show a dropdown here');
                });
            }

            // Theme toggle functionality
            const themeToggle = document.getElementById('theme-toggle');
            const themeIcon = document.getElementById('theme-icon');
            const htmlElement = document.documentElement;
            
            // Check for saved theme preference or use default
            const savedTheme = localStorage.getItem('theme') || 'light';
            htmlElement.setAttribute('data-theme', savedTheme);
            
            // Update icon based on current theme
            updateThemeIcon(savedTheme);
            
            // Theme toggle click handler
            themeToggle.addEventListener('click', function() {
                const currentTheme = htmlElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                
                htmlElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                
                updateThemeIcon(newTheme);
            });
            
            // Function to update the theme icon
            function updateThemeIcon(theme) {
                if (theme === 'dark') {
                    themeIcon.classList.remove('fa-moon');
                    themeIcon.classList.add('fa-sun');
                } else {
                    themeIcon.classList.remove('fa-sun');
                    themeIcon.classList.add('fa-moon');
                }
            }
        });

        // Add any additional JavaScript below
        {% block scripts %}{% endblock %}
    </script>
</body>

</html>