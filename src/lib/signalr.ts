// @ts-ignore
import { HubConnection, HubConnectionBuilder, LogLevel } from "@aspnet/signalr";
import type {
  GameStartedResponse,
  JoinGameResponse,
  Move,
  MoveItem,
  PlayerNameChangedResponse,
} from "@/lib/types";
import type { PieceType } from "@/lib/types";

export class SignalrConnection {
  private connection: HubConnection;
  constructor() {
    this.connection = new HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_GAME_HUB_URL}`)
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

  async joinGame(gameId: string, token: string, playerName: string) {
    await this.connection.invoke("JoinGame", {
      gameId,
      token,
      playerName,
    });
  }

  async joinSpectator(gameId: string) {
    await this.connection.invoke("JoinSpectator", {
      gameId,
    });
  }

  async leaveSpectator(gameId: string) {
    await this.connection.invoke("LeaveSpectator", {
      gameId,
    });
  }

  async makeMove(gameId: string, move: Move, promoteToType: PieceType | null) {
    await this.connection.invoke("Move", {
      gameId,
      from: move.from,
      to: move.to,
      promoteToType,
    });
  }

  async changeName(token: string, name: string) {
    await this.connection.invoke("ChangeName", {
      token,
      name,
    });
  }

  onPlayerNameChanged(callback: (e: PlayerNameChangedResponse) => void) {
    this.connection.on("playerNameChanged", callback);
  }

  onGameFull(callback: () => void) {
    this.connection.on("gameFull", callback);
  }

  onGameNotFound(callback: () => void) {
    this.connection.on("gameNotFound", callback);
  }

  onPlayerNotFound(callback: () => void) {
    this.connection.on("playerNotFound", callback);
  }

  onInvalidMove(callback: () => void) {
    this.connection.on("invalidMove", callback);
  }

  onGameJoined(callback: (e: JoinGameResponse) => void) {
    this.connection.on("gameJoined", callback);
  }

  onGameStarted(callback: (e: GameStartedResponse) => void) {
    this.connection.on("gameStarted", callback);
  }

  onMove(callback: (e: MoveItem) => Promise<void>) {
    this.connection.on("move", callback);
  }
}
