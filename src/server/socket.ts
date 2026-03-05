import { Server as SocketIOServer } from "socket.io"
import { type Server as HTTPServer } from "http"
import { auth } from "@/lib/auth"

interface DuelRoom {
  player1: { userId: string; socketId: string; score: number; answeredAt?: Date }
  player2?: { userId: string; socketId: string; score: number; answeredAt?: Date }
  questions: QuestionPayload[]
  currentQ: number
  status: "waiting" | "in_progress" | "finished"
  subject: string
  startedAt?: Date
}

interface QuestionPayload {
  id: string
  text: string
  options: string[]
  timeLimit: number // secondes
}

const rooms = new Map<string, DuelRoom>()
const waitingBySubject = new Map<string, string>() // subject -> roomId

export function initSocketServer(httpServer: HTTPServer) {
  const io = new SocketIOServer(httpServer, {
    cors: { origin: process.env.NEXT_PUBLIC_APP_URL, credentials: true },
    transports: ["websocket"],
  })
  
  io.on("connection", async (socket) => {
    const session = await auth() // Vérifier l'auth NextAuth
    if (!session?.user?.id) {
      socket.disconnect()
      return
    }
    const userId = session.user.id
    
    // ── JOIN_DUEL ──────────────────────────────────────────────────────────
    socket.on("join_duel", async ({ subject }: { subject: string }) => {
      const existing = waitingBySubject.get(subject)
      
      if (existing && rooms.get(existing)?.player2 === undefined) {
        // Rejoindre une room existante
        const room = rooms.get(existing)!
        room.player2 = { userId, socketId: socket.id, score: 0 }
        socket.join(existing)
        
        // Générer les questions via RAG
        const questions = await generateDuelQuestions(subject, 10)
        room.questions = questions
        room.status = "in_progress"
        room.startedAt = new Date()
        waitingBySubject.delete(subject)
        
        io.to(existing).emit("duel_start", {
          roomId: existing,
          questions,
          players: { player1: room.player1.userId, player2: userId },
        })
      } else {
        // Créer une nouvelle room
        const roomId = `duel_${Date.now()}_${Math.random().toString(36).slice(2, 7)}` 
        rooms.set(roomId, {
          player1: { userId, socketId: socket.id, score: 0 },
          questions: [],
          currentQ: 0,
          status: "waiting",
          subject,
        })
        socket.join(roomId)
        waitingBySubject.set(subject, roomId)
        socket.emit("duel_waiting", { roomId })
        
        // Timeout de 30s : si personne ne rejoint, lancer vs bot
        setTimeout(() => {
          const r = rooms.get(roomId)
          if (r && r.status === "waiting") {
            launchVsBot(io, roomId, r, subject)
          }
        }, 30_000)
      }
    })
    
    // ── ANSWER ────────────────────────────────────────────────────────────
    socket.on("duel_answer", ({ roomId, questionIdx, answerIdx }: {
      roomId: string; questionIdx: number; answerIdx: number
    }) => {
      const room = rooms.get(roomId)
      if (!room || room.status !== "in_progress") return
      
      const player = [room.player1, room.player2].find(p => p?.userId === userId)
      if (!player) return
      
      // La correction est vérifiée côté serveur (jamais côté client !)
      // correctIndex doit être stocké dans la question côté serveur seulement
      // et NON envoyé au client dans la payload initiale
      
      io.to(roomId).emit("duel_answer_received", {
        playerId: userId,
        questionIdx,
        answerIdx,
      })
    })
    
    // ── DISCONNECT ────────────────────────────────────────────────────────
    socket.on("disconnect", () => {
      for (const [roomId, room] of rooms) {
        if (room.player1?.socketId === socket.id || room.player2?.socketId === socket.id) {
          io.to(roomId).emit("duel_player_left", { playerId: userId })
          if (room.status === "in_progress") {
            // Donner la victoire à l'autre joueur
            finalizeDuel(io, roomId, room, userId === room.player1.userId ? room.player2?.userId : room.player1.userId)
          }
          rooms.delete(roomId)
          break
        }
      }
    })
  })
  
  return io
}

async function generateDuelQuestions(subject: string, count: number): Promise<QuestionPayload[]> {
  // Appel à la route RAG pour générer des questions adaptées
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/rag/generate-questions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.INTERNAL_API_SECRET}` },
    body: JSON.stringify({ subject, count, type: "duel_qcm" }),
  })
  return response.json()
}

async function launchVsBot(io: SocketIOServer, roomId: string, room: DuelRoom, subject: string) {
  const questions = await generateDuelQuestions(subject, 10)
  room.questions = questions
  room.status = "in_progress"
  room.player2 = { userId: "bot", socketId: "bot", score: 0 }
  room.startedAt = new Date()
  
  io.to(roomId).emit("duel_start", {
    roomId,
    questions,
    players: { player1: room.player1.userId, player2: "bot" },
    vsBot: true,
  })
}

async function finalizeDuel(io: SocketIOServer, roomId: string, room: DuelRoom, winnerId?: string) {
  room.status = "finished"
  io.to(roomId).emit("duel_end", {
    roomId,
    winnerId,
    scores: {
      player1: room.player1.score,
      player2: room.player2?.score ?? 0,
    },
  })
  // Persister en BDD + awardXp
}
