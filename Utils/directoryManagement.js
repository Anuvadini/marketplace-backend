import { existsSync, mkdirSync } from "fs";

//  a function to create a folder
export function createFolder(folderPath) {
  if (!existsSync(folderPath)) {
    mkdirSync(folderPath);
    console.log("Folder created successfully.");
    // return the folder path
  } else {
    console.log("Folder already exists.");
  }
}
