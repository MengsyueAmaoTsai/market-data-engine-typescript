export interface Tick {
    symbol: string;
    timestamp: number;
    price: number;
    size: number;
}

export interface Depth {
    level: number;
    price: number;
    size: number;
}

export interface OrderBook {
    symbol: string;
    timestamp: number;
    bids: Array<Depth>;
    asks: Array<Depth>
}
