<template>
  <GameLayout
    :pieces="pieces"
    :move-history="moveHistory"
    :reverse-board="false"
    :active-color="activeColor"
    :is-player="false"
    :player-color="PlayerColor.None"
    :game-has-started="gameHasStarted"
    :white-player-name="whitePlayerName"
    :black-player-name="blackPlayerName"
    :panel-tabs="[GameInfoTab.Game, GameInfoTab.Share, GameInfoTab.Settings]"
    :highlight-squares="[]"
  >
    <template #board-overlay>
      <SuperDuperModal v-if="loading">
        <LoadingModalContent />
      </SuperDuperModal>
    </template>
  </GameLayout>
</template>

<script setup lang="ts">
import { GameInfoTab, PieceColor, PieceType, PlayerColor } from "@/lib/types";
import type {
  JoinGameResponse,
  MoveItem,
  Piece,
  PlayerNameChangedResponse,
} from "@/lib/types";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { SignalrConnection } from "@/lib/signalr";
import { get, set } from "@vueuse/core";
import { applyMove, invertColor } from "@/lib/chess";
import GameLayout from "@/components/GameLayout.vue";
import SuperDuperModal from "@/components/modals/SuperDuperModal.vue";
import LoadingModalContent from "@/components/modals/LoadingModalContent.vue";

const router = useRouter();
const hubConnection = new SignalrConnection();

const gameId = ref(useRoute().params.gameId as string);

const pieces = ref<Piece[]>([]);

const whitePlayerName = ref("");
const blackPlayerName = ref("");

const moveHistory = ref<MoveItem[]>([]);

const gameHasStarted = ref(false);

const activeColor = ref<PieceColor>(PieceColor.White);

const loading = ref(true);

const initialize = async () => {
  await hubConnection.start();

  hubConnection.onGameNotFound(() => {
    alert("Game not found!");
    router.push({ name: "home" });
  });

  hubConnection.onGameJoined((e: JoinGameResponse) => {
    // the game joined event means we successfully joined the game as a player
    // we need to set up the board and player color
    // the opponent may or may not have joined yet

    // setup board
    e.board.forEach((piece) => {
      get(pieces).push({
        type: piece.type as PieceType,
        color: piece.color as PieceColor,
        x: piece.position.x,
        y: piece.position.y,
      });
    });

    // set player names
    set(whitePlayerName, e.whitePlayerName || "White");
    set(blackPlayerName, e.blackPlayerName || "Black");

    // set move history
    set(moveHistory, e.moves);

    // set active color
    set(activeColor, e.activeColor as PieceColor);

    // set game has started
    set(gameHasStarted, e.whitePlayerName !== "" && e.blackPlayerName !== "");

    set(loading, false);
  });

  hubConnection.onGameStarted((e) => {
    set(whitePlayerName, e.whitePlayerName);
    set(blackPlayerName, e.blackPlayerName);

    set(gameHasStarted, true);
  });

  hubConnection.onMove(async (e: MoveItem) => {
    resolveMove(e);
  });

  hubConnection.onPlayerNameChanged((e: PlayerNameChangedResponse) => {
    if (e.color === PieceColor.White) {
      set(whitePlayerName, e.name);
    } else {
      set(blackPlayerName, e.name);
    }
  });

  // join the game as a spectator
  await hubConnection.joinSpectator(get(gameId));
};

const resolveMove = (move: MoveItem) => {
  console.log("resolving move", move);

  // update the board
  set(pieces, applyMove(get(pieces), move));

  // push the move to the move history
  get(moveHistory).push(move);

  // change the active color
  set(activeColor, invertColor(move.color));
};

onMounted(async () => {
  await initialize();
});
</script>
