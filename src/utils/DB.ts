type ChatRoom = {
  id: string;
  name: string;
  memberCount: number;
  memberList?: number[]; // member 들의 프로필 이미지 유지를 위해
};

type Chat = {
  id: string;
  roomId: string;
  role: string;
  message: string;
  name: number;
  time: Date;
};

type CreateChatRoomParams = ChatRoom;
type CreateChatParams = Omit<Chat, "time">;

type Response = {
  result: boolean;
  data?: any;
  message?: string;
};

class DB {
  private db: IDBDatabase | null = null;

  constructor() {
    // this.factory = factory;
  }

  public async open(): Promise<Response> {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        window.alert("indexedDB를 지원하지 않는 브라우저입니다.");
        resolve({ result: false, message: "not supported indexedDB" });
      }
      const request = window.indexedDB.open("numbleAI");

      // open database named "numbleAI"

      request.onsuccess = (event: Event) => {
        console.log("done!");
        this.db = request.result;
        resolve({ result: true, message: "success" });
      };

      // If there has no DB named "numbeAI", create and initialize it.
      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        console.log("# db initialize called");
        this.db = request.result;

        const ChatRoom = this.db.createObjectStore("ChatRoom", {
          keyPath: "id",
        });
        ChatRoom.createIndex("id", "id", { unique: true });
        ChatRoom.createIndex("name", "name", { unique: true });

        const Chat = this.db.createObjectStore("Chat", {
          keyPath: "id",
        });
        Chat.createIndex("id", "id", { unique: true });
        Chat.createIndex("roomId", "roomId", { unique: false });
      };

      request.onerror = (event: Event) => {
        console.log("# db error");
        resolve({ result: false, message: "error while opening db" });
      };
    });
  }

  public createChatRoom = async (
    params: CreateChatRoomParams,
  ): Promise<Response> => {
    return new Promise((resolve, reject) => {
      const { id, name, memberCount, memberList } = params;
      console.log("# check ", params);
      if (!this.db) {
        console.log("# error");
        throw new Error("DB not initialized");
      }

      const transaction = this.db.transaction(["ChatRoom"], "readwrite");
      const store = transaction.objectStore("ChatRoom");
      const request = store.add({
        id: id,
        name: name,
        memberCount: memberCount,
        memberList: memberList || [],
      });
      request.onsuccess = (event: Event) => {
        resolve({ result: true, message: "create chat-room success" });
      };

      request.onerror = (event: Event) => {
        const error = (event.target as IDBRequest).error;
        if (error && error.name === "ConstraintError") {
          console.log("# key already exist");
          resolve({ result: false, message: "key already exist" });
        }
        if (error) {
          console.log("# error", error);
          resolve({ result: false, message: "error while creating chat-room" });
        }
      };
    });
  };

  public getChatRoom = async (id: string): Promise<Response> => {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        console.log("# error");
        throw new Error("DB not initialized");
      }

      const transaction = this.db.transaction(["ChatRoom"], "readonly");
      const store = transaction.objectStore("ChatRoom");

      const request = store.get(id);

      request.onsuccess = (event: Event) => {
        resolve({
          result: true,
          message: "get chat-room success",
          data: request.result,
        });
      };

      request.onerror = (event: Event) => {
        const error = (event.target as IDBRequest).error;
        if (error) {
          console.log("# error", error);
          resolve({ result: false, message: "error while getting chat-room" });
        }
      };
    });
  };

  public getAllChatRoom = async (): Promise<Response> => {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        console.log("# error");
        throw new Error("DB not initialized");
      }

      const transaction = this.db.transaction(["ChatRoom"], "readonly");
      const store = transaction.objectStore("ChatRoom");
      const request = store.getAll();
      request.onsuccess = (event: Event) => {
        resolve({
          result: true,
          message: "get all chat-room success",
          data: request.result,
        });
      };

      request.onerror = (event: Event) => {
        const error = (event.target as IDBRequest).error;
        if (error) {
          console.log("# error", error);
          resolve({ result: false, message: "error while getting chat-room" });
        }
      };
    });
  };

  public removeChatRoom = async (id: string): Promise<Response> => {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        console.log("# error");
        throw new Error("DB not initialized");
      }

      const transaction = this.db.transaction(["ChatRoom"], "readwrite");
      const store = transaction.objectStore("ChatRoom");
      const request = store.delete(id);
      request.onsuccess = (event: Event) => {
        resolve({ result: true, message: "remove chat-room success" });
      };

      request.onerror = (event: Event) => {
        const error = (event.target as IDBRequest).error;
        if (error) {
          console.log("# error", error);
          resolve({ result: false, message: "error while removing chat-room" });
        }
      };
    });
  };

  public removeAllChat = async (id: string): Promise<Response> => {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        console.log("# error");
        throw new Error("DB not initialized");
      }

      const transaction = this.db.transaction(["Chat"], "readwrite");
      const store = transaction.objectStore("Chat");

      const index = store.index("roomId");
      // TODO: remove all chat with roomId

      const request = index.openCursor(id);
      request.onsuccess = (event: Event) => {
        const cursor = resolve({
          result: true,
          message: "remove all chat success",
        });
      };

      request.onerror = (event: Event) => {
        const error = (event.target as IDBRequest).error;
        if (error) {
          console.log("# error", error);
          resolve({ result: false, message: "error while removing all chat" });
        }
      };
    });
  };

  public updateChatRoom = async (
    params: CreateChatRoomParams,
  ): Promise<Response> => {
    return new Promise((resolve, reject) => {
      const { id, memberCount } = params;
      if (!this.db) {
        console.log("# error");
        throw new Error("DB not initialized");
      }

      const transaction = this.db.transaction(["ChatRoom"], "readwrite");
      const store = transaction.objectStore("ChatRoom");
      const request = store.put({ id: id, memberCount: memberCount });

      request.onsuccess = (event: Event) => {
        resolve({ result: true, message: "update chat-room success" });
      };

      request.onerror = (event: Event) => {
        const error = (event.target as IDBRequest).error;
        if (error) {
          console.log("# error", error);
          resolve({ result: false, message: "error while updating chat-room" });
        }
      };
    });
  };

  public getChatList = async (roomId: string): Promise<Response> => {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        console.log("# error");
        throw new Error("DB not initialized");
      }

      const transaction = this.db.transaction(["Chat"], "readonly");
      const store = transaction.objectStore("Chat");

      // Get the index for the "roomId" key
      const index = store.index("roomId");

      const request = index.getAll(roomId);

      request.onsuccess = (event: Event) => {
        const result = request.result.filter(
          (chat: Chat) => chat.roomId === roomId,
        );
        resolve({
          result: true,
          message: "get chat-list success",
          data: result,
        });
      };

      request.onerror = (event: Event) => {
        const error = (event.target as IDBRequest).error;
        if (error) {
          console.log("# error", error);
          resolve({ result: false, message: "error while getting chat-list" });
        }
      };
    });
  };

  public createChat = async (params: CreateChatParams): Promise<Response> => {
    return new Promise((resolve, reject) => {
      const { roomId, id, message, name, role } = params;
      if (!this.db) {
        console.log("# error");
        throw new Error("DB not initialized");
      }

      const transaction = this.db.transaction(["Chat"], "readwrite");
      const store = transaction.objectStore("Chat");
      const request = store.add({
        roomId: roomId,
        id: id,
        message: message,
        name: name,
        role: role,
        time: new Date(),
      });

      request.onsuccess = (event: Event) => {
        resolve({ result: true, message: "create chat success" });
      };

      request.onerror = (event: Event) => {
        const error = (event.target as IDBRequest).error;
        if (error && error.name === "ConstraintError") {
          console.log("# key already exist");
          resolve({ result: false, message: "key already exist" });
        }
        if (error) {
          console.log("# error", error);
          resolve({ result: false, message: "error while creating chat" });
        }
      };
    });
  };
}

export default DB;
export type { Chat, ChatRoom };
