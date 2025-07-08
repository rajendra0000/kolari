# Use official Go image
FROM golang:1.24

# Set working directory
WORKDIR /app

# Copy go.mod and go.sum first (for dependency caching)
COPY go.mod go.sum ./
RUN go mod download

# Copy all source files, including public/
COPY . .

# Build the app
RUN go build -o main .

# Expose the port your app runs on
EXPOSE 8080

# Run the app
CMD ["./main"]

# docker build -t my-go-app .
# docker run -p 8080:8080 my-go-app

