# Kolari

A simple, real‑time P2P chat and file-sharing web app built in Go, powered by WebSockets. Easily create collaborative sessions using unique links and share different types of files in real time.

## 🚀 Features

- **Session management**  
  Dynamically generate and join unique sessions via UUIDs.  
- **Real‑time chat**  
  Exchange messages instantly with all participants in a session.  
- **File sharing**  
  Drag & drop files to share them peer‑to‑peer. Supports various file types.  
- **Dockerized**  
  One‑step build & run with Docker.

## 🛠️ Technologies

- **Go** (1.24)  
- **Gorilla WebSocket** for real‑time messaging  
- **html/template** for server‑side templating  
- **UUID** for session IDs  
- **Bootstrap 5** + **Font Awesome** for responsive UI  
- **Docker** for containerization  

## 📦 Repository Structure

```
├── Dockerfile
├── go.mod
├── go.sum
├── main.go                 # Server entrypoint
└── public/                 # Static assets
    ├── index.html          # Landing page
    ├── landing-page.css    
    ├── landing-page.js     # Session creation + join logic
    ├── session.html        # Collaborative session UI
    ├── session.css
    └── session.js          # WebSocket + file transfer logic
```

## 💻 Getting Started

### Prerequisites

- [Go 1.24+](https://golang.org/dl/)  
- (Optional) [Docker](https://docs.docker.com/get-docker/)

### Clone & Run Locally

```bash
git clone https://github.com/rajendra0000/kolari.git
cd kolari

# 1. Download dependencies
go mod download

# 2. Build and run
go build -o kolari .
./kolari
```

By default, the server listens on port `8080`. To change:

```bash
export PORT=3000    # or any port you like
go run main.go
```

Then open `http://localhost:8080` in your browser.

### With Docker

```bash
# Build the image
docker build -t kolari-app .

# Run the container
docker run -p 8080:8080 kolari-app
```

## 🔌 API Endpoints

| Route                  | Method | Description                                |
|------------------------|--------|--------------------------------------------|
| `/`                    | GET    | Landing page (create or join sessions)     |
| `/generate-session`    | GET    | Returns JSON `{ "uuid": "<session-id>" }` |
| `/ws/{session-id}`     | WS     | WebSocket endpoint for real‑time messages  |
| `/public/...`          | GET    | Static assets (JS, CSS)                    |

## 🎨 Usage

1. **Create a new session**  
   On the landing page, click “Generate Session” to get a unique link (e.g. `/#123e4567-e89b-12d3-a456-426614174000`).  
2. **Share & join**  
   Send that link to collaborators; they’ll be dropped into the same session UI.  
3. **Chat & Share Files**  
   - Type in the message box to chat with others in real time.  
   - Drag & drop files to share them instantly.  


## 🤝 Contributing

1. Fork the repo  
2. Create a feature branch (`git checkout -b feature/YourFeature`)  
3. Commit your changes (`git commit -m 'Add awesome feature'`)  
4. Push to your branch (`git push origin feature/YourFeature`)  
5. Open a Pull Request

Please ensure any user‑facing changes include updates to this README.

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

⭐ If you find Kolari useful, please give it a star on GitHub!
