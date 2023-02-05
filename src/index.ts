import winston from "winston";
import { Server, WebSocket } from "ws";


class MarketDataEngine {
    private logger?: winston.Logger;

    private websocketServer?: Server;
    
    constructor() {
        // Create logger
        this.logger = this.createLogger();
    }

    public start = () => {
        this.logger?.info('Starting market data engine ...');

        // Create websocket server.
        const port = 8080;
        this.websocketServer = new Server({ port: port });
        this.websocketServer.on('connection', this.onNewConnection);

        this.logger?.info(`Market data engine started on ws://localhost:${port}.`)
    }

    public stop = () => {
        this.logger?.info('Stopping market data engine ...');

        // Close websocket server.
        this.websocketServer?.close();

        this.logger?.info('Market data engine stopped.')
    }

    private onNewConnection = (socket: WebSocket) => {
        socket.on('message', this.onMessageReceived.bind);
        this.logger?.info(`A client connected. ${socket}`);
    }

    private onMessageReceived = (message: string) => {
        this.logger?.info(`Recevied a message from client: ${message}`);
        try {
            const request = JSON.parse(message);
            
            switch (request.action) {
                case 'subscribe':
                    this.logger?.info(`Subscribe symbol: ${request.symbol}`);
                    break;
                case 'unsubscribe':
                    this.logger?.info(`Unsubscribe symbol: ${request.symbol}`)   
                default:
                    this.logger?.info(`Unknown action.`)
                    // TODO: Send error message to client. 
            }
        } catch {
            // Send error message to client.
        }
    };

    private createLogger = (): winston.Logger => {
        return winston.createLogger({
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.printf(info => {
                    return `${info.timestamp} - [${info.level}] - ${info.message}`
                }),
            ),
            transports: [
                new winston.transports.Console(),
            ]
        });
    }

    private publishTickData = () => {

    }

    private publishOrderBookData = () => {
        
    }
}

export default MarketDataEngine;

// const engine = new MarketDataEngine();
// engine.start();
// engine.stop();