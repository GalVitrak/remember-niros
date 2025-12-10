import { httpsCallable } from "firebase/functions";
import type MemoryModel from "../Models/MemoryModel";
import { functions } from "../../firebase-config";

class MemoryService {
  public async uploadImages(
    images: string[]
  ): Promise<string[]> {
    const uploadImages = httpsCallable(
      functions,
      "uploadImages"
    );
    const result = await uploadImages({
      images: images,
    });
    const data = result.data as {
      imageUrls: string[];
      message: string;
    };
    return data.imageUrls;
  }

  public async addMemory(
    memory: MemoryModel
  ): Promise<MemoryModel> {
    const addMemory = httpsCallable(
      functions,
      "addMemory"
    );
    const result = await addMemory({
      memory: memory.memory,
      writer: memory.writer,
      imageUrl: memory.imageUrl, // For backward compatibility
      imageUrls: memory.imageUrls, // Array of image URLs
    });
    return result.data as MemoryModel;
  }
}

const memoryService = new MemoryService();
export default memoryService;
