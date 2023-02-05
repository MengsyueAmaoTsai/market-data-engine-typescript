import winston from 'winston';
import WebSocket from 'ws';
import MarketDataEngine from '../src';


describe('MarketDataEngine', () => {
  let marketDataEngine: MarketDataEngine;
  let loggerSpy: jest.SpyInstance;
  let wsServer: WebSocket.Server;
  let wsServerSpy: jest.SpyInstance;

  beforeEach(() => {
    marketDataEngine = new MarketDataEngine();
    loggerSpy = jest.spyOn(winston, 'createLogger');
    wsServerSpy = jest.spyOn(WebSocket, 'Server');
    wsServer = new WebSocket.Server({ port: 8080 });
    wsServerSpy.mockImplementation(() => wsServer);
  });

  afterEach(() => {
    loggerSpy.mockReset();
    wsServerSpy.mockReset();
  });

  it('should start the market data engine and create a websocket server', () => {
    marketDataEngine.start();
    expect(loggerSpy).toHaveBeenCalled();
    expect(wsServerSpy).toHaveBeenCalledWith({ port: 8080 });
  });

  it('should stop the market data engine and close the websocket server', () => {
    marketDataEngine.start();
    const closeSpy = jest.spyOn(wsServer, 'close');
    marketDataEngine.stop();
    expect(closeSpy).toHaveBeenCalled();
  });
});