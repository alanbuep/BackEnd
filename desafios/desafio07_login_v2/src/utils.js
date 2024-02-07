import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

export const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

export const isValidPassword = (savedPassword, password) => {
    console.log(savedPassword);
    console.log(bcrypt.hashSync(password, bcrypt.genSaltSync(10)));

    return bcrypt.compareSync(password, savedPassword);
};

async function readFile(file) {
    try {
        let result = await fs.promises.readFile(__dirname + "/" + file, "utf-8");
        let data = await JSON.parse(result);
        return data;
    } catch (error) {
        console.log(error);
    }
}

async function writeFile(file, data) {
    try {
        await fs.promises.writeFile(__dirname + "/" + file, JSON.stringify(data));
        return true;
    } catch (error) {
        console.log(error);
    }
}

async function deleteFile(file) {
    try {
        await fs.promises.unlink(__dirname + "/" + file);
        return true;
    } catch (error) {
        console.log(error);
    }
}

export default {
    readFile,
    writeFile,
    deleteFile,
};