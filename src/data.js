import fs from 'fs';
import get from 'lodash.get';
import sample from 'lodash.sample';
import setWith from 'lodash.setwith';
import unset from 'lodash.unset';

const DATA_FILE_NAME = './data.json';
const BACKUP_DIR = 'backup/';

const data = {
    _aliases: {},
    _data: {},
    _last: {},

    get(userId, tokens) {
        const node = get(this._data[userId], tokens);
        if (!node || !Object.keys(node).length) return [];
        if (node[' ']) return [node[' ']];

        let res = [];
        let curNode = node;

        while (true) {
            if (!Object.keys(curNode).length) break;

            const key = sample(Object.keys(curNode));
            if (key === ' ') {
                res.push(curNode[key]);
                break;
            }
            res.push(key);
            curNode = curNode[key];
        }

        return res;
    },

    set(userId, tokens) {
        const userData = this._data[userId] || {};
        const end = tokens.length - 1
        setWith(userData, tokens.slice(0, end).concat([' ']), tokens[end], Object);
        this._data[userId] = userData;
    },

    reset(userId, tokens) {
        const userData = this._data[userId] || {};
        unset(userData, tokens);
        this._data[userId] = userData;
    },

    getAlias(key) {
        return this._aliases[key];
    },

    setAlias(key, userId) {
        this._aliases[key] = userId;
    },

    getLast(guildId, userId) {
        const last = this._last[guildId] || [];
        if (last[0] === userId) {
            return last[1];
        }
        return last[0];
    },

    setLast(guildId, userId) {
        const last = this._last[guildId] || [];
        if (last[0] === userId) return;

        last.unshift(userId);
        if (last.length > 2) {
            last.pop();
        }
        this._last[guildId] = last;
    },

    loadData(callback) {
        console.log('Loading data...');

        fs.readFile(DATA_FILE_NAME, (err, fileContent) => {
            if (err) {
                console.log(`Failed to load data: ${err}`);
                callback(false);
                return;
            }

            try {
                const fileData = JSON.parse(fileContent);
                Object.assign(this, fileData);
                console.log('Successfully loaded data.');
                callback(true);
            } catch (err) {
                console.log(`Failed to deserialize data: ${err}`);
                callback(false);
            }
        });
    },

    saveData() {
        console.log('Saving data...');

        try {
            const fileContent = JSON.stringify(this);

            fs.writeFile(DATA_FILE_NAME, fileContent, (err) => {
                if (err) {
                    console.log(`Failed to save data: ${err}`);
                    return;
                }

                console.log('Successfully saved data.');
            });
        } catch (err) {
            console.log(`Failed to serialize data: ${err}`);
        }
    },

    saveBackup() {
        !fs.existsSync(BACKUP_DIR) && fs.mkdirSync(BACKUP_DIR);
        const filePath = `${BACKUP_DIR}backup-${Date.now()}.json`;
        try {
            const fileContent = JSON.stringify(this);

            fs.writeFile(filePath, fileContent, (err) => {
                if (err) {
                    console.log(`Failed to save backup: ${err}`);
                    return;
                }

                console.log('Successfully saved backup.');
            });
        } catch (err) {
            console.log(`Failed to serialize backup: ${err}`);
        }
    },
}

export default data;
