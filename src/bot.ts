import { createBot, Bot } from 'mineflayer';
import { pathfinder, Movements, goals } from 'mineflayer-pathfinder';
import { filterPlayers } from './util';
import { Action } from './action';
import { Vec3 } from 'vec3';
import { IndexedData } from 'minecraft-data';

type ConnectionDetails = {
    host: string;
    port: number;
}

class TehcBot {
    public bot: Bot;
    public actions: Action[];

    private mcData!: IndexedData;
    private movements!: Movements;
    private static RANGE_GOAL = 1;

    constructor(username: string, conn: ConnectionDetails, password?: string, tickEvent?: () => void) {
        this.actions = [];

        this.bot = createBot({
            host: conn.host,
            port: conn.port,
            username: username
        });

        this.bot.loadPlugin(pathfinder);

        this.bot.on('login', () => {
            console.log(`Logged in as ${username} to ${conn.host}:${conn.port}`);
        });

        this.bot.physicsEnabled = true 
        // default tick event handler
        this.bot.on('spawn', () => {
            this.mcData = require('minecraft-data')(this.bot.version);
            this.movements = new Movements(this.bot, this.mcData);

            // this.bot.on('chat', (username: string, message: string) => {
            //     if(username === this.bot.username) return;
            //     if(message.toLowerCase() !== ("start" || "go")) return;
            //     const target = this.bot.players[username]?.entity;
            //     if(!target) {
            //         this.bot.chat(`Player ${username} out of range!`);
            //         return
            //     }

            //     const { x: playerX, y: playerY, z: playerZ} = target.position;

            //     this.bot.pathfinder.setMovements(this.movements);
            //     this.bot.pathfinder.setGoal(new goals.GoalNear(playerX, playerY, playerZ, TehcBot.RANGE_GOAL));
            // })

            if(!tickEvent) {
                this.bot.on('physicsTick', this.tick);
            } else {
                this.bot.on('physicsTick', tickEvent);
            }
        });
    }

    public addAction(action: Action) {
        this.actions.push(action);
    }

    public addActions(actions: Action[]) {
       actions.forEach(action => this.addAction(action));
    }

    public tick() {
        if(this.actions) this.actions.forEach((action: Action) => action.perform());
        this.actions = [];
    }

    public nearestPlayer() {
        return this.bot.nearestEntity(filterPlayers);
    }

    public lookAt(pos: Vec3) {
        this.bot.lookAt(pos);
    }

    public moveToPlayer(username: string | undefined) {
        if(!username) return;
        this.lookAt(this.bot.players[username]?.entity.position);
        const target = this.bot.players[username]?.entity;
        if(!target) {
            this.bot.chat(`Player ${username} out of range!`);
            return
        }
        const { x: playerX, y: playerY, z: playerZ} = target.position;
        this.bot.pathfinder.setMovements(this.movements);
        this.bot.pathfinder.setGoal(new goals.GoalNear(playerX, playerY, playerZ, TehcBot.RANGE_GOAL));
    }
}

export { TehcBot };