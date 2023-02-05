import {HttpTransportType, HubConnection, HubConnectionBuilder, LogLevel} from "@aspnet/signalr";

export class SignalrConnection {
    private connection: HubConnection;
    constructor() {
        this.connection = new HubConnectionBuilder()
            .withUrl(`${import.meta.env.VITE_HUB_URL}`)
            .configureLogging(LogLevel.Debug)
            .build();
    }

    async start() {
        try {
            await this.connection.start();
            console.log("SignalR Connected.");
        } catch (err) {
            console.log(err);
            setTimeout(() => this.start(), 5000);
        }
    }

    async stop() {
        await this.connection.stop();
    }

    async joinGame(gameId: string, token: string) {
        await this.connection.invoke("Join", gameId, token);
    }

    async leaveGame(gameId: string, token: string) {
        await this.connection.invoke("Leave", gameId, token);
    }

    onMoveMade(callback: (fromX: number, fromY: number, toX: number, toY: number) => Promise<void>) {
        this.connection.on("moveMade", callback);
    }

    onOpponentJoined(callback: (opponentName: string) => void) {
        this.connection.on("gameJoined", callback);
    }
}