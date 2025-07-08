// Fully Updated Session Page JavaScript - Kalori P2P Document Sharing

document.addEventListener('DOMContentLoaded', function () {
    let sessionId = '';
    let socket = null;
    let isConnected = false;
    let userId = generateUserId();

    // DOM Elements
    const sessionIdDisplay = document.getElementById('sessionId');
    const connectionStatus = document.getElementById('connectionStatus');
    const userCountDisplay = document.getElementById('userCountDisplay');
    const copyUrlBtn = document.getElementById('copyUrlBtn');
    const editor = document.getElementById('editor');
    const waitingState = document.getElementById('userNotJoinInfo');
    const mainContent = document.querySelector('.main-content');
    const uploadBtn = document.getElementById('uploadBtn');
    const fileInput = document.getElementById('fileInput');
    const uploadArea = document.getElementById('uploadArea');
    const receivedFiles = document.getElementById('receivedFiles');
    const sentFiles = document.getElementById('sentFiles'); 

    // Init session
    init();

    function init() {
        const pathParts = window.location.pathname.split('/');
        sessionId = pathParts[pathParts.length - 1];
        if (!sessionId) window.location.href = '/';
        sessionIdDisplay.textContent = sessionId;
        connectWebSocket();
        setupEventListeners();
    }

    function generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    function connectWebSocket() {
        const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${location.host}/ws/${sessionId}?peerId=${userId}`;
        socket = new WebSocket(wsUrl);

        socket.onopen = () => {
            isConnected = true;
            updateConnectionStatus('connected');
            sendMessage({ type: 'user_join', userId, timestamp: Date.now() });
        };

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log('[WS MESSAGE]', data);
                handleMessage(data);
            } catch (err) {
                console.error('Error parsing WebSocket message:', err);
            }
        };

        socket.onclose = () => {
            isConnected = false;
            updateConnectionStatus('disconnected');
            setTimeout(connectWebSocket, 3000);
        };

        socket.onerror = (err) => {
            console.error('WebSocket error:', err);
            updateConnectionStatus('error');
        };
    }

    function sendMessage(message) {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(message));
        }
    }

    function handleMessage(data) {
        switch (data.type) {
            case 'user_join':
                showToast('success', 'User joined the session');
                break;
            case 'user_leave':
                showToast('info', 'User left the session');
                break;
            case 'text-sync':
                handleTextChange(data);
                break;
            case 'file-received':
                renderReceivedFile(data.file);
                break;
            case 'client-connected':
            case 'client-reconnected':
            case 'new-peer':
            case 'peer-disconnected':
            case 'existing-peers':
                updateUserCountFromServer(data.userCount);
                break;
            default:
                console.warn('Unhandled WS type:', data.type);
        }
    }

    function handleTextChange(data) {
        if (data.userId !== userId && data.text !== editor.value) {
            const pos = editor.selectionStart;
            editor.value = data.text;
            editor.setSelectionRange(pos, pos);
        }
    }

    function updateConnectionStatus(status) {
        connectionStatus.className = 'badge status-badge';
        switch (status) {
            case 'connected':
                connectionStatus.classList.add('connected');
                connectionStatus.innerHTML = '<i class="fas fa-circle me-1"></i>Connected';
                break;
            case 'disconnected':
                connectionStatus.classList.add('disconnected');
                connectionStatus.innerHTML = '<i class="fas fa-circle me-1"></i>Disconnected';
                break;
            case 'error':
                connectionStatus.classList.add('disconnected');
                connectionStatus.innerHTML = '<i class="fas fa-exclamation-circle me-1"></i>Connection Error';
                break;
            default:
                connectionStatus.innerHTML = '<i class="fas fa-circle me-1"></i>Connecting...';
        }
    }

    function updateUserCountFromServer(count) {
        if (typeof count === 'number') {
            userCountDisplay.textContent = `Current Users: ${count}`;
            if (count > 1) showMainContent();
            else showWaitingState();
        }
    }

    function setupEventListeners() {
        copyUrlBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(window.location.href).then(() => {
                showToast('success', 'Session URL copied!');
            });
        });

        let debounceTimer;
        editor.addEventListener('input', function () {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                sendMessage({ type: 'text-sync', text: editor.value, userId, timestamp: Date.now() });
            }, 300);
        });

        uploadBtn.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => handleFiles(e.target.files));

        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, (e) => {
                e.preventDefault();
                uploadArea.classList.add('dragover');
            });
        });
        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, (e) => {
                e.preventDefault();
                uploadArea.classList.remove('dragover');
            });
        });

        uploadArea.addEventListener('drop', (e) => {
            const files = e.dataTransfer.files;
            handleFiles(files);
        });
    }

    function handleFiles(files) {
        for (let file of files) {
            const reader = new FileReader();
            reader.onload = () => {
                sendMessage({
                    type: 'file-sent',
                    file: {
                        name: file.name,
                        size: file.size,
                        content: reader.result
                    },
                    userId,
                    timestamp: Date.now()
                });
                renderSentFile(file); 
                showToast('success', `Sent: ${file.name}`);
            };
            reader.readAsDataURL(file);
        }
    }

    function renderReceivedFile(file) {
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';

    const fileInfo = document.createElement('div');
    fileInfo.className = 'file-info';

    const fileIcon = document.createElement('i');
    fileIcon.className = 'fas fa-file file-icon';

    const fileDetails = document.createElement('div');
    fileDetails.className = 'file-details';

    const fileName = document.createElement('div');
    fileName.className = 'file-name';
    fileName.textContent = file.name;

    const fileSize = document.createElement('div');
    fileSize.className = 'file-size';
    fileSize.textContent = `${(file.size / 1024).toFixed(1)} KB`;

    fileDetails.appendChild(fileName);
    fileDetails.appendChild(fileSize);

    fileInfo.appendChild(fileIcon);
    fileInfo.appendChild(fileDetails);

    const downloadBtn = document.createElement('button');
    downloadBtn.className = 'file-action-btn';
    downloadBtn.innerHTML = '<i class="fas fa-download me-1"></i>Download';
    downloadBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.href = file.content;
        link.download = file.name;
        link.click();
    });

    const fileActions = document.createElement('div');
    fileActions.className = 'file-actions';
    fileActions.appendChild(downloadBtn);

    fileItem.appendChild(fileInfo);
    fileItem.appendChild(fileActions);

    receivedFiles.appendChild(fileItem);
    }


    function renderSentFile(file) {
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';

    const fileName = document.createElement('span');
    fileName.textContent = file.name;

    const fileSize = document.createElement('small');
    fileSize.className = 'file-size ms-2';
    fileSize.textContent = `${(file.size / 1024).toFixed(1)} KB`;

    const fileInfo = document.createElement('div');
    fileInfo.className = 'file-info';
    fileInfo.appendChild(fileName);
    fileInfo.appendChild(fileSize);

    const sentLabel = document.createElement('span');
    sentLabel.textContent = 'Sent';
    sentLabel.className = 'file-action-btn'; // Styled in CSS

    fileItem.appendChild(fileInfo);
    fileItem.appendChild(sentLabel);
    sentFiles.appendChild(fileItem);
    }


    function showMainContent() {
        waitingState.style.display = 'none';
        mainContent.style.display = 'block';
        mainContent.classList.add('fade-in');
    }

    function showWaitingState() {
        mainContent.style.display = 'none';
        waitingState.style.display = 'block';
        waitingState.classList.add('fade-in');
    }

    function showToast(type, message) {
        const toastId = type === 'error' ? 'errorToast' : 'successToast';
        const toastElement = document.getElementById(toastId);
        const toastBody = toastElement.querySelector('.toast-body');
        toastBody.textContent = message;
        const toast = new bootstrap.Toast(toastElement);
        toast.show();
    }

    window.addEventListener('beforeunload', function () {
        if (socket && socket.readyState === WebSocket.OPEN) {
            sendMessage({ type: 'user_leave', userId, timestamp: Date.now() });
            socket.close();
        }
    });

    document.addEventListener('visibilitychange', function () {
        if (!document.hidden && !isConnected) {
            connectWebSocket();
        }
    });
});
