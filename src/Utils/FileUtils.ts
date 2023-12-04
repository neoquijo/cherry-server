import { Dirent, promises as fsPromises } from 'fs';

export class FileUtils {
  static async moveFile(
    sourcePath: string,
    destinationPath: string,
  ): Promise<void> {
    try {
      const fileContent = await fsPromises.readFile(sourcePath);
      await fsPromises.writeFile(destinationPath, fileContent);
      await fsPromises.unlink(sourcePath);
    } catch (error) {
      throw new Error(`Error moving file: ${error.message}`);
    }
  }

  static async createTempUploadFolder(name: string) {
    try {
      console.log(name);
      await fsPromises.access(name);
    } catch (error) {
      try {
        await fsPromises.mkdir(name);
      } catch (mkdirError) {
        throw new Error(`Error creating folder ${mkdirError.message}`);
      }
    }
  }

  static async copyFile(
    sourcePath: string,
    destinationPath: string,
  ): Promise<void> {
    try {
      const fileContent = await fsPromises.readFile(sourcePath);
      await fsPromises.writeFile(destinationPath, fileContent);
    } catch (error) {
      throw new Error(`Error copying file: ${error.message}`);
    }
  }

  static async readDir(directoryPath: string): Promise<Dirent[]> {
    try {
      const directoryContents = await fsPromises.readdir(directoryPath, {
        withFileTypes: true,
      });
      return directoryContents;
    } catch (error) {
      return [];
    }
  }

  static async deleteFile(filePath: string): Promise<void> {
    try {
      await fsPromises.unlink(filePath);
    } catch (error) {
      throw new Error(`Error deleting file: ${error.message}`);
    }
  }
}
