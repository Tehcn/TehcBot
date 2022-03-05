import { createBot, Bot } from 'mineflayer';
import { pathfinder, Movements, goals } from 'mineflayer-pathfinder';
import { } from 'minecraft-data';
import { filterPlayers } from './util';
import { Action } from './action';
import { Vec3 } from 'vec3';

type ConnectionDetails = {
    host: string;
    port: number;
}

class TehcBot {
    public bot: Bot;
    public actions: Action[];

    private mcData: any;

    constructor(username: string, conn: ConnectionDetails, password?: string, tickEvent?: () => void) {
        this.actions = [];

        this.bot = createBot({
            host: conn.host,
            port: conn.port,
            username: username
        });

        this.bot.on('login', () => {
            console.log(`Logged in as ${username} to ${conn.host}:${conn.port}`);
        });

        this.bot.physicsEnabled = true 
        // default tick event handler
        if(!tickEvent) {
            this.bot.on('spawn', () => {
                this.bot.on('physicsTick', this.tick);
            });
        } else {
            this.bot.on('spawn', () => {
                this.bot.on('physicsTick', tickEvent);
            });
        }
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

    public moveTo(pos: Vec3) {
        this.lookAt(pos);
        this.bot.setControlState('forward', true);
        if(this.bot.entity.position.distanceTo(pos) > 4) {
            this.bot.setControlState('sprint', true);
        } else {

        }

        if(pos.y - this.bot.entity.position.y > 1) {
            this.bot.setControlState('jump', true);
        } else {
            this.bot.setControlState('jump', false);
        }
    }
}

export { TehcBot };