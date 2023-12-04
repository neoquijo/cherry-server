export interface Crop {
  x: number;
  y: number;
  width: number;
  height: number;
  unit: 'px' | '%';
}

export interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
  path: string;
  destination: string;
  filename: string;
}
