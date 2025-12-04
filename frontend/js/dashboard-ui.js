/**
 * dashboard-ui.js
 * Handles dashboard rendering, view switching, and chat header updates
 */

/**
 * Load the dashboard view in the center panel
 * Shows the home/news view in the right panel
 */
function loadDashboard() {
    // 1. Center Panel -> Dashboard Mode
    const centerPanel = document.querySelector('.center-panel');
    if (centerPanel) centerPanel.classList.add('dashboard-mode');

    // Show dashboard view, hide chat view
    const dashboardView = document.getElementById('view-dashboard');
    const chatView = document.getElementById('view-chat');

    if (dashboardView) dashboardView.style.display = 'block';
    if (chatView) chatView.style.display = 'none';

    const inputContainer = document.getElementById('messageInputContainer');
    if (inputContainer) inputContainer.style.display = 'none';

    // 2. RIGHT PANEL -> SHOW HOME (News Feed)
    const rightHome = document.getElementById('rightPanelHome');
    const rightTools = document.getElementById('rightPanelIntelligence');

    if (rightHome) rightHome.style.display = 'flex';
    if (rightTools) rightTools.style.display = 'none';

    // Load news if needed
    if (typeof loadMarketNews === 'function') loadMarketNews();

    // 3. Clear Selection State
    if (window.app && window.app.conversationCore) {
        window.app.conversationCore.currentConversationId = null;
        window.app.conversationCore.selectedConversation = null;
        document.querySelectorAll('.conversation-item').forEach(item => {
            item.classList.remove('selected', 'active');
        });
    }
}

/**
 * Update the chat header when a conversation is selected
 * Also switches the center panel to chat mode and right panel to tools
 * @param {string} companyName - The business/company name
 * @param {string} ownerName - The owner/contact name
 */
function updateChatHeader(companyName, ownerName) {
    // 1. Target the center panel
    const centerPanel = document.querySelector('.center-panel');
    const container = document.querySelector('.center-panel .panel-header');

    // 2. Switch Center Panel to CHAT Mode
    if (centerPanel) centerPanel.classList.remove('dashboard-mode');

    // Show chat view, hide dashboard view
    const dashboardView = document.getElementById('view-dashboard');
    const chatView = document.getElementById('view-chat');

    if (dashboardView) dashboardView.style.display = 'none';
    if (chatView) chatView.style.display = 'block';

    // 3. RIGHT PANEL -> SHOW TOOLS (AI, Docs, FCS)
    const rightHome = document.getElementById('rightPanelHome');
    const rightTools = document.getElementById('rightPanelIntelligence');

    if (rightHome) rightHome.style.display = 'none';
    if (rightTools) rightTools.style.display = 'flex';

    // 4. Render the Clean Header Text
    if (container) {
        const safeCompany = companyName || "Unknown Business";
        const safeOwner = ownerName || "Unknown Contact";

        container.innerHTML = `
            <button id="backHomeBtn" onclick="loadDashboard()" title="Back to Dashboard">
                <i class="fas fa-arrow-left"></i>
            </button>

            <div class="identity-text-group">
                <h2 class="header-merchant-name">${safeOwner}</h2>
                <span class="header-business-name">${safeCompany}</span>
            </div>

            <div style="margin-left: auto;">
                <button class="icon-btn-small" id="deleteLeadBtn" onclick="window.commandCenter.conversationUI.showDeleteConfirmation()" title="Delete Lead">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    }
}

/**
 * Test API connection and render news feed
 * Called on page load for debugging
 */
async function testNewsConnection() {
    console.log('Testing /api/news connection...');
    try {
        const response = await fetch('/api/news');
        console.log('Server responded with status:', response.status);

        if (response.ok) {
            const data = await response.json();
            console.log('Success! News data received:', data);

            const container = document.getElementById('newsFeedContainer');
            if (container && data.success) {
                container.innerHTML = data.data.map(item =>
                    `<div style="padding:10px; border-bottom:1px solid #eee;">
                        <b>${item.title}</b><br>
                        <span style="font-size:10px">${item.source}</span>
                    </div>`
                ).join('');
            }
        } else {
            console.error('Server Error:', response.statusText);
        }
    } catch (err) {
        console.error('Network Error:', err);
    }
}

// Make functions globally available
window.loadDashboard = loadDashboard;
window.updateChatHeader = updateChatHeader;

// Run connection test on load
document.addEventListener('DOMContentLoaded', testNewsConnection);
