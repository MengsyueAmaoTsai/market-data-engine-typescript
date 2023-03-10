import winston from "winston";
import { Server, WebSocket } from "ws";
import { OrderBook, Tick } from "./data";
import * as crypto from 'crypto';


class MarketDataEngine {
    private logger?: winston.Logger;

    private websocketServer?: Server;
    private clients: Map<string, WebSocket> = new Map();
    
    constructor() {
        // Create logger
        this.logger = this.createLogger();
    }

    public start = (): void => {
        this.logger?.info('Starting market data engine ...');

        // Create websocket server.
        const port = 8080;
        this.websocketServer = new Server({ port: port });
        this.websocketServer.on('connection', this.onNewConnection);

        this.logger?.info(`Market data engine started on ws://localhost:${port}.`);
    }

    public stop = (): void => {
        this.logger?.info('Stopping market data engine ...');

        // Close websocket server.
        this.websocketServer?.close();

        this.logger?.info('Market data engine stopped.');
    }

    private onNewConnection = (socket: WebSocket): void => {
        const socketId = this.generateUniqueId();
        this.clients.set(socketId, socket);
        socket.on('message', (message: string) => this.onMessageReceived(socketId, message));
        this.logger?.info(`A client connected.`);
    }

    private onMessageReceived = (id: string, message: string): void => {
        this.logger?.info(`Recevied a message from client(${id}): ${message}`);

        if (!this.clients.has(id)) {
            this.logger?.info(`Client with id: ${id} does not exists.`);
            return;
        }
        
        try {
            const request = JSON.parse(message);
            
            switch (request.action) {
                case 'subscribe':
                    this.logger?.info(`Subscribe symbol: ${request.symbol}`);
                    break;
                case 'unsubscribe':
                    this.logger?.info(`Unsubscribe symbol: ${request.symbol}`);   
                default:
                    this.logger?.info(`Unknown action.`);
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
                    return `${info.timestamp} - [${info.level.toUpperCase()}] - ${info.message}`;
                }),
            ),
            transports: [
                new winston.transports.Console(),
            ]
        });
    }

    private publishTickData = (tick: Tick): void => {
        // Get all clients which subscribed this symbol.
        // Broadcast message
    }

    private publishBarData = (): void => {
    }

    private publishOrderBookData = (orderBook: OrderBook): void => {
    }

    private generateUniqueId = (): string => crypto.randomBytes(16).toString("hex");
}


export default MarketDataEngine;
