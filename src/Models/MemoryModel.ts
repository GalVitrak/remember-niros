class MemoryModel {
  id?: string;
  memory: string;
  writer: string;
  imageUrl?: string; // For backward compatibility
  imageUrls?: string[]; // Array of image URLs (max 5)
  createdAt?: Date;
  status?: string;
  ApprovedAt?: Date;
  ApprovedBy?: string;

  constructor(
    memory: string,
    writer: string,
    imageUrl?: string,
    imageUrls?: string[],
    createdAt?: Date,
    status?: string,
    ApprovedAt?: Date,
    ApprovedBy?: string,
    id?: string
  ) {
    this.memory = memory;
    this.writer = writer;
    this.imageUrl = imageUrl;
    this.imageUrls = imageUrls;
    this.createdAt = createdAt;
    this.status = status;
    this.ApprovedAt = ApprovedAt;
    this.ApprovedBy = ApprovedBy;
    this.id = id;
  }
}

export default MemoryModel;
