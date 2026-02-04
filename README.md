# Reversi (Othello) Game

A classic implementation of the Reversi (also known as Othello) board game built with HTML, CSS, and JavaScript.

## Features

- **Complete Reversi Gameplay**: Full implementation of standard Reversi rules
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Visual Feedback**: Animated disk placement, valid move indicators, and turn indicators
- **Game Tracking**: Real-time score display and move history
- **Game Rules**: Built-in rules explanation accessible from the interface
- **Restart Functionality**: Easy game reset with a single click

## Game Rules

### Objective
Have the majority of disks of your color on the board at the end of the game.

### Setup
- The game is played on an 8×8 board
- Initial position: 2 black and 2 white disks placed diagonally in the center
- Black always moves first

### Gameplay
1. Players take turns placing disks on empty squares
2. A move must capture at least one opponent's disk
3. Disks are captured by "outflanking" opponent's disks (sandwiching them between your disks)
4. All captured disks are flipped to your color
5. If you have no valid moves, your turn is skipped
6. The game ends when neither player can make a valid move

### Winning
The player with the most disks of their color on the board when the game ends wins.

## Project Structure

```
reversi-game/
├── index.html          # Main HTML file with game interface
├── style.css           # CSS styles for responsive design and UI
├── script.js           # JavaScript game logic and functionality
├── README.md           # This documentation file
├── Dockerfile          # Docker configuration for deployment
└── docker-compose.yml  # Docker Compose configuration
```

## Local Development

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- (Optional) A local web server for testing

### Quick Start
1. Clone or download the project files
2. Open `index.html` in your web browser
3. Start playing!

### Using a Local Server
For best results, run the game through a local web server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js with http-server
npx http-server .
```

Then open `http://localhost:8000` in your browser.

## Deployment

### Docker Deployment

The game can be easily deployed using Docker.

#### Using Dockerfile
```bash
# Build the Docker image
docker build -t reversi-game .

# Run the container
docker run -d -p 8080:80 --name reversi reversi-game
```

Access the game at `http://localhost:8080`

#### Using Docker Compose
```bash
# Start the service
docker-compose up -d

# Stop the service
docker-compose down
```

Access the game at `http://localhost:80`

### Coolify Deployment

This application is deployment-friendly for Coolify. The Docker configuration is optimized for static file serving with Nginx.

#### Coolify Deployment Steps:
1. Create a new project in Coolify
2. Connect your Git repository
3. Select "Dockerfile" as the build method
4. Coolify will automatically build and deploy the application

## Technical Details

### Game Logic
- **Board Representation**: 8×8 2D array
- **Move Validation**: Checks all 8 directions for valid captures
- **Disk Flipping**: Automatically flips all captured disks
- **Turn Management**: Handles turn skipping when no valid moves exist
- **Game State**: Tracks scores, valid moves, and game status

### Responsive Design
- Mobile-first CSS approach
- Flexible grid layouts
- Media queries for different screen sizes
- Touch-friendly interface elements

### Browser Compatibility
- Compatible with all modern browsers (Chrome 60+, Firefox 60+, Safari 12+, Edge 79+)
- Uses vanilla JavaScript (no external dependencies)
- Progressive enhancement principles

## License

This project is open source and available for personal and educational use.

## Credits

- Game logic based on standard Reversi/Othello rules
- Font Awesome icons for UI elements
- Google Fonts for typography
- Built with vanilla HTML, CSS, and JavaScript

## Support

For issues or suggestions, please:
1. Check the game rules in the interface
2. Try restarting the game
3. Ensure you're using a modern browser

Enjoy playing Reversi!