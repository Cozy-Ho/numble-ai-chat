type CreateChatRoomParams = {
  id: string;
  name: string;
  memberCount: number;
};

class DB {
  private request: IDBOpenDBRequest;
  private db: IDBDatabase | null = null;

  constructor(factory: IDBFactory) {
    this.request = factory.open("numbleAI");
    this.db = this.request.result;

    this.init();
  }

  private async init(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // open database named "numbleAI"

      if (!this.request) return;

      // If there has no DB named "numbeAI", create and initialize it.
      this.request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        console.log("# db inintalize called");
        this.db = this.request.result;

        const ChatRoom = this.db.createObjectStore("ChatRoom", {
          keyPath: "id",
        });
        ChatRoom.createIndex("id", "id", { unique: true });

        const Chat = this.db.createObjectStore("Chat", {
          keyPath: "id",
        });
        Chat.createIndex("id", "id", { unique: true });
        Chat.createIndex("roomId", "roomId", { unique: false });
      };

      this.request.onsuccess = (event: Event) => {
        console.log("done!");
        this.db = this.request.result;
        resolve(true);
      };

      this.request.onerror = (event: Event) => {
        console.log("# db error");
        resolve(false);
      };
    });
  }

  public createChatRoom = async (
    params: CreateChatRoomParams,
  ): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const { id, name, memberCount } = params;
      console.log("# check ", this.db);
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
      });
      request.onsuccess = (event: Event) => {
        resolve(true);
      };

      request.onerror = (event: Event) => {
        console.log("# db error", JSON.stringify(event));
        resolve(false);
      };
    });
  };
}

export default DB;
